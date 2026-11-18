# Stock Market Analysis Platform --- Architecture and Implementation Blueprint

> Plain-text Markdown export of the visible conversation.
>
> Scope: India + US markets, broker APIs, personal use, full available
> data granularity, real-time synchronization, Nx monorepo
> implementation.
>
> Note: This export includes the visible user requirements and the
> architecture blueprint in this conversation. Any messages omitted by
> the conversation interface are not available to reproduce.

## Conversation --- User requirements

### Initial request

I want you to explain the stock market analysis platform Screener
architecture, how it works, the design and technologies used, why those
technologies are used instead of alternatives, their pros and cons, and
how I should develop my own stock market analysis platform while keeping
live-market data synchronized smoothly.

### Detailed implementation requirements

Design my stock market analysis platform implementation using these
requirements:

-   Market: both India and US.
-   Data source: broker.
-   Scope: personal.
-   Data granularity: full.
-   Deliver a detailed production architecture, API contracts, database
    schema, event flows, data synchronization design and Nx
    implementation roadmap.

------------------------------------------------------------------------

# 1. Architecture overview

The recommended design is a single-user, multi-market quantitative
analysis platform with independently managed market-data infrastructure.

  Requirement   Decision
  ------------- ------------------------------------------
  Markets       India (NSE/BSE) + US (NYSE/NASDAQ)
  Data source   Broker APIs
  Users         One personal user initially
  Market data   LTP, OHLC, volume, bid/ask, market depth
  Processing    Real-time event-driven
  Backend       Node.js + TypeScript
  Frontend      Next.js + React
  Database      PostgreSQL + TimescaleDB
  Cache         Redis
  Repository    Nx monorepo
  Deployment    Docker + AWS

Important constraint: full market depth is not universally available
through broker APIs. Depth levels, exchange coverage, subscription
requirements, historical availability and redistribution rights differ
by broker and market. Design provider adapters around actual
capabilities rather than assuming every broker provides identical data.

## 1.1 Core architectural principles

1.  **Market-agnostic core:** NSE, BSE, NYSE and NASDAQ data must be
    normalized into a common internal model.
2.  **Provider isolation:** Broker-specific WebSocket protocols must
    never leak into the analytics engine.
3.  **Event-driven processing:** Every market update enters a controlled
    pipeline.
4.  **Historical/live consistency:** Historical candles and real-time
    events must reconcile before an instrument is marked synchronized.
5.  **Independent analytics:** Indicators, screeners and alerts should
    operate independently of the frontend.

Support different data capabilities per instrument and provider. One
provider might supply five-level depth, while another supplies only
top-of-book quotes. Never silently represent five-level depth as full
order-book data.

## 1.2 High-level architecture

``` text
                     EXTERNAL BROKERS
              +--------------------------+
              |                          |
          INDIA BROKERS              US BROKERS
          Upstox                   Interactive Brokers
          Angel One                Alpaca
              |                          |
              +------------+-------------+
                           |
                           v
                  PROVIDER ADAPTERS
                           |
                  WebSocket Connections
                           |
                           v
                MARKET DATA NORMALIZER
                           |
                  Validation / Ordering
                           |
                           v
                  MARKET EVENT PIPELINE
                           |
              +------------+------------+
              |            |            |
              v            v            v
          Redis Cache   Candle Engine   Raw Archive
              |            |            |
              |            v            |
              |       TimescaleDB       |
              |                         |
              +------------+------------+
                           |
                  ANALYTICS ENGINE
                           |
              +------------+------------+
              |            |            |
              v            v            v
          Indicators    Screener       Alerts
                        Engine
              +------------+------------+
                           |
                     APPLICATION API
                           |
              +------------+------------+
              |                         |
              v                         v
          REST API                 WebSocket API
              |                         |
              +------------+------------+
                           |
                           v
                   NEXT.JS DASHBOARD
```

There are two independent paths:

-   The market-data path handles continuous market updates.
-   The application path handles user interaction, configuration and
    visualization.

This separation prevents dashboard activity from affecting market-data
ingestion.

------------------------------------------------------------------------

# 2. Broker integration strategy: India and US

Broker capabilities determine what the analytics engine can calculate.

## 2.1 Candidate providers

### India --- NSE/BSE

**Upstox** - WebSocket Market Feed V3. - Full mode: five market
levels. - Full D30 mode: up to 30 market levels, subject to
subscription. - OHLC, LTP, volume, OI and other metadata. - Official API
documentation: https://upstox.com/developer/api-documentation/

**Angel One SmartAPI** - WebSocket Streaming 2.0. - Best-five market
depth. - LTP, OHLC, volume and additional quote information. - Useful as
an alternative adapter. - Official API documentation:
https://smartapi.angelone.in/

### US --- NYSE/NASDAQ

**Interactive Brokers** - TWS API / IB Gateway. - Streaming Level I. -
Market depth through `reqMarketDepth`. - Exchange-specific and
SMART-routed depth options. - Historical data API. - Official API
documentation:
https://www.interactivebrokers.com/campus/ibkr-api-page/twsapi-doc/

**Alpaca** - REST and WebSocket market data. - Trades, quotes and
historical data. - Node.js SDK availability. - Useful for a simpler US
market-data integration. - Not a substitute for Level II order-book
depth. - Documentation: https://docs.alpaca.markets/

## 2.2 Suggested provider configuration

  Market    Primary candidate     Secondary candidate
  --------- --------------------- ---------------------
  NSE/BSE   Upstox                Angel One
  US        Interactive Brokers   Alpaca for Level I

Why this combination:

-   Upstox documents full-depth feed modes with five or 30 levels,
    depending on mode and entitlement.
-   Angel One provides a separate WebSocket streaming interface with
    best-five data.
-   IBKR exposes incremental market-depth operations, including insert,
    update and delete, useful for maintaining an order-book
    representation.
-   Alpaca provides real-time streaming market data, but should be used
    for trade and quote analytics rather than assumed to supply Level II
    depth.

## 2.3 Market-data terminology

  -----------------------------------------------------------------------
  Data                                Meaning
  ----------------------------------- -----------------------------------
  Level I                             Best bid and ask

  Level II                            Multiple price levels

  Level III                           More detailed market/order
                                      information, depending on venue

  Tick-by-tick                        Individual trade events

  Order-by-order                      Individual order lifecycle events,
                                      where explicitly provided
  -----------------------------------------------------------------------

Even 30-level depth is not the same as the complete exchange order book.

IBKR requires appropriate market-data subscriptions. Returned depth has
coverage limitations, including odd-lot exclusions.

## 2.4 Provider capability model

``` typescript
interface ProviderCapabilities {
  trades: boolean;
  quotes: boolean;
  ohlc: boolean;
  historicalCandles: boolean;
  marketDepth: boolean;

  depthLevels: number | null;
  orderByOrder: boolean;

  historicalTrades: boolean;
  historicalDepth: boolean;
}
```

This prevents the analytics engine from assuming every instrument has
identical available data.

## 2.5 Provider failover

Do not automatically switch providers and blindly mix their data.

Providers may differ in: - Exchange timestamps. - Volume semantics. -
Depth coverage. - Instrument identifiers. - Quote freshness. -
Historical-data boundaries.

Instead:

1.  Detect the failure.
2.  Mark the provider's instruments as stale.
3.  Establish the alternative provider connection.
4.  Subscribe to the required instruments.
5.  Obtain a fresh snapshot.
6.  Reconcile the market state.
7.  Change the active source.
8.  Record the source transition.

For market depth, rebuild the book from a fresh snapshot rather than
merging two providers' order-book updates.

------------------------------------------------------------------------

# 3. Provider adapter design

Every provider should implement the same interface.

``` typescript
export interface MarketDataProvider {
  readonly providerId: string;

  connect(): Promise<void>;
  disconnect(): Promise<void>;

  getCapabilities(): ProviderCapabilities;

  subscribe(
    instruments: ProviderSubscription[]
  ): Promise<void>;

  unsubscribe(
    instrumentIds: string[]
  ): Promise<void>;

  getQuote(
    instrument: ProviderInstrument
  ): Promise<NormalizedQuote>;

  getHistoricalCandles(
    instrument: ProviderInstrument,
    request: CandleRequest
  ): Promise<NormalizedCandle[]>;

  onMarketEvent(
    handler: (event: NormalizedMarketEvent) => void
  ): void;

  getConnectionStatus(): ProviderConnectionStatus;
}
```

Provider implementations:

``` text
MarketDataProvider
       |
       +---- UpstoxAdapter
       |
       +---- AngelOneAdapter
       |
       +---- IBKRAdapter
       |
       +---- AlpacaAdapter
```

Example configuration:

``` typescript
const providerRegistry = {
  india: {
    primary: "upstox",
    secondary: "angel-one"
  },

  us: {
    primary: "ibkr",
    secondary: "alpaca"
  }
};
```

The registry is configuration, not a hardcoded dependency.

------------------------------------------------------------------------

# 4. Canonical market-data model

All provider adapters must produce the same internal representation.

## 4.1 Instrument model

``` typescript
export type Market = "INDIA" | "US";

export type Exchange =
  | "NSE"
  | "BSE"
  | "NYSE"
  | "NASDAQ"
  | "ARCA";

export interface Instrument {
  id: string;

  market: Market;
  exchange: Exchange;

  symbol: string;
  name: string;

  currency: "INR" | "USD";

  instrumentType:
    | "EQUITY"
    | "ETF"
    | "INDEX"
    | "OPTION"
    | "FUTURE";

  tickSize: number;
  lotSize: number;

  isActive: boolean;
}
```

Use a UUID for the internal ID. Never use provider tokens as the primary
database identifier.

## 4.2 Normalized quote model

``` typescript
export interface NormalizedQuote {
  instrumentId: string;

  lastPrice: number;
  lastQuantity?: number;

  open: number;
  high: number;
  low: number;
  previousClose: number;

  cumulativeVolume: number;
  averagePrice?: number;

  totalBuyQuantity?: number;
  totalSellQuantity?: number;

  openInterest?: number;

  exchangeTimestamp?: number;
  receivedAt: number;

  provider: string;

  sourceSequence?: number;

  dataStatus:
    | "LIVE"
    | "DELAYED"
    | "STALE"
    | "UNAVAILABLE";
}
```

Use decimal-safe representations for financial values at persistence and
calculation boundaries. JavaScript `number` is IEEE-754 floating point,
so do not rely on it for exact monetary arithmetic or tick-size
equality.

For calculations, use integer price units where practical, or a decimal
arithmetic library.

## 4.3 Market-depth model

``` typescript
export interface OrderBookLevel {
  price: string;
  quantity: string;

  orderCount?: number;

  venue?: string;
}

export interface MarketDepth {
  instrumentId: string;

  bids: OrderBookLevel[];
  asks: OrderBookLevel[];

  depthLevelCount: number;

  bookType:
    | "AGGREGATED"
    | "VENUE_SPECIFIC"
    | "ORDER_LEVEL";

  provider: string;

  exchangeTimestamp?: number;
  receivedAt: number;

  sequence?: number;

  snapshotVersion: number;
}
```

Strings preserve provider decimal values and avoid accidental precision
loss.

## 4.4 Unified market event

``` typescript
export interface MarketEvent<T> {
  eventId: string;

  eventType:
    | "QUOTE"
    | "TRADE"
    | "DEPTH_SNAPSHOT"
    | "DEPTH_DELTA"
    | "CANDLE"
    | "MARKET_STATUS";

  instrumentId: string;

  market: Market;

  provider: string;

  exchangeTimestamp?: number;
  receivedAt: number;

  sourceSequence?: number;

  schemaVersion: number;

  payload: T;
}
```

This event envelope supports schema evolution without breaking every
consumer.

------------------------------------------------------------------------

# 5. Database architecture and schema

Use three logical data stores:

1.  **PostgreSQL:** users, instruments, provider configuration,
    watchlists, screeners, alerts and application metadata.
2.  **TimescaleDB:** historical trades, candles, quote history and
    analytics snapshots.
3.  **Redis:** latest quotes, live order books, current candles,
    indicator state and transient event distribution.

For the personal version, PostgreSQL and TimescaleDB can run in the same
database instance. Redis runs separately.

## 5.1 Database relationships

``` mermaid
erDiagram
    MARKETS ||--o{ EXCHANGES : contains
    EXCHANGES ||--o{ INSTRUMENTS : lists
    INSTRUMENTS ||--o{ PROVIDER_INSTRUMENTS : mapped_to
    PROVIDERS ||--o{ PROVIDER_INSTRUMENTS : supplies
    INSTRUMENTS ||--o{ MARKET_CANDLES : has
    INSTRUMENTS ||--o{ MARKET_TRADES : has
    INSTRUMENTS ||--o{ MARKET_DEPTH_SNAPSHOTS : has
    WATCHLISTS ||--o{ WATCHLIST_ITEMS : contains
    INSTRUMENTS ||--o{ WATCHLIST_ITEMS : selected
    SCREENERS ||--o{ SCREENER_CONDITIONS : defines
    SCREENERS ||--o{ ALERTS : triggers
    ALERTS ||--o{ ALERT_EXECUTIONS : generates
```

## 5.2 Core PostgreSQL schema

``` sql
CREATE EXTENSION IF NOT EXISTS timescaledb;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE markets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    timezone VARCHAR(50) NOT NULL,
    currency VARCHAR(10) NOT NULL
);

CREATE TABLE exchanges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    market_id UUID NOT NULL REFERENCES markets(id),
    code VARCHAR(20) NOT NULL,
    name VARCHAR(100) NOT NULL,
    timezone VARCHAR(50) NOT NULL,
    UNIQUE(market_id, code)
);

CREATE TABLE instruments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exchange_id UUID NOT NULL REFERENCES exchanges(id),
    symbol VARCHAR(100) NOT NULL,
    name VARCHAR(255),
    instrument_type VARCHAR(30) NOT NULL,
    currency VARCHAR(10) NOT NULL,
    tick_size NUMERIC(24, 10),
    lot_size NUMERIC(24, 8),
    is_active BOOLEAN DEFAULT TRUE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(exchange_id, symbol)
);

CREATE TABLE providers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    market VARCHAR(20) NOT NULL,
    enabled BOOLEAN DEFAULT TRUE,
    capabilities JSONB DEFAULT '{}'
);

CREATE TABLE provider_instruments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id UUID NOT NULL REFERENCES providers(id),
    instrument_id UUID NOT NULL REFERENCES instruments(id),
    provider_token VARCHAR(255) NOT NULL,
    provider_symbol VARCHAR(255),
    active BOOLEAN DEFAULT TRUE,
    UNIQUE(provider_id, instrument_id),
    UNIQUE(provider_id, provider_token)
);

CREATE TABLE watchlists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE watchlist_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    watchlist_id UUID NOT NULL REFERENCES watchlists(id)
        ON DELETE CASCADE,
    instrument_id UUID NOT NULL REFERENCES instruments(id),
    position INTEGER DEFAULT 0,
    UNIQUE(watchlist_id, instrument_id)
);

CREATE TABLE screeners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    market VARCHAR(20) NOT NULL,
    universe JSONB NOT NULL,
    condition_tree JSONB NOT NULL,
    timeframe VARCHAR(20) NOT NULL,
    enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    screener_id UUID REFERENCES screeners(id),
    instrument_id UUID REFERENCES instruments(id),
    condition JSONB NOT NULL,
    cooldown_seconds INTEGER DEFAULT 0,
    enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE alert_executions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    alert_id UUID NOT NULL REFERENCES alerts(id),
    instrument_id UUID NOT NULL REFERENCES instruments(id),
    idempotency_key VARCHAR(255) UNIQUE NOT NULL,
    trigger_price NUMERIC(24, 10),
    triggered_at TIMESTAMPTZ NOT NULL,
    status VARCHAR(30) NOT NULL,
    payload JSONB DEFAULT '{}'
);
```

## 5.3 TimescaleDB market-data schema

``` sql
CREATE TABLE market_candles (
    instrument_id UUID NOT NULL,
    timeframe VARCHAR(10) NOT NULL,

    candle_time TIMESTAMPTZ NOT NULL,

    open NUMERIC(24, 10) NOT NULL,
    high NUMERIC(24, 10) NOT NULL,
    low NUMERIC(24, 10) NOT NULL,
    close NUMERIC(24, 10) NOT NULL,

    volume NUMERIC(28, 8) NOT NULL DEFAULT 0,

    source VARCHAR(50) NOT NULL,
    is_final BOOLEAN DEFAULT FALSE,

    updated_at TIMESTAMPTZ DEFAULT NOW(),

    PRIMARY KEY (
        instrument_id,
        timeframe,
        candle_time
    )
);

SELECT create_hypertable(
    'market_candles',
    'candle_time',
    if_not_exists => TRUE
);

CREATE INDEX idx_candles_instrument_time
ON market_candles (
    instrument_id,
    candle_time DESC
);

CREATE TABLE market_trades (
    instrument_id UUID NOT NULL,
    event_time TIMESTAMPTZ NOT NULL,

    trade_id VARCHAR(255),
    price NUMERIC(24, 10) NOT NULL,
    quantity NUMERIC(28, 8) NOT NULL,

    exchange VARCHAR(30) NOT NULL,
    provider VARCHAR(50) NOT NULL,

    PRIMARY KEY (
        instrument_id,
        event_time,
        trade_id
    )
);

SELECT create_hypertable(
    'market_trades',
    'event_time',
    if_not_exists => TRUE
);

CREATE TABLE market_depth_snapshots (
    instrument_id UUID NOT NULL,
    snapshot_time TIMESTAMPTZ NOT NULL,

    provider VARCHAR(50) NOT NULL,
    book_type VARCHAR(30) NOT NULL,

    bids JSONB NOT NULL,
    asks JSONB NOT NULL,

    sequence_number BIGINT,
    snapshot_version BIGINT NOT NULL,

    PRIMARY KEY (
        instrument_id,
        snapshot_time,
        snapshot_version
    )
);

SELECT create_hypertable(
    'market_depth_snapshots',
    'snapshot_time',
    if_not_exists => TRUE
);
```

Additional tables to add before production:

  Table                    Purpose
  ------------------------ ------------------------------------------
  `provider_connections`   Connection and authentication metadata
  `sync_checkpoints`       Historical synchronization watermarks
  `market_sessions`        Exchange trading sessions
  `corporate_actions`      Splits, dividends and adjustments
  `indicator_snapshots`    Persisted indicator state
  `data_quality_events`    Gaps, stale feeds, invalid events
  `instrument_aliases`     Symbol changes and alternate identifiers

## 5.4 Database design decisions

-   Do not use one table for every timeframe. Initially use one candle
    hypertable with a `timeframe` dimension and indexes.
-   Keep the latest book in Redis.
-   Store periodic depth snapshots.
-   Optionally store selected depth changes for instruments being
    investigated.
-   Apply retention policies.
-   Record provider, source timestamp, whether a candle is
    provider-supplied or internally aggregated, adjustment methodology
    and completion status.
-   Do not silently mix adjusted daily candles and unadjusted intraday
    candles.

------------------------------------------------------------------------

# 6. Redis architecture and key design

Redis maintains the current state of the market.

  Redis key                                Data
  ---------------------------------------- ------------------------
  `market:quote:{instrumentId}`            Latest quote
  `market:depth:{instrumentId}`            Latest order book
  `market:candle:{instrumentId}:{tf}`      Current candle
  `market:indicator:{instrumentId}:{tf}`   Latest indicator state
  `market:status:{exchange}`               Exchange status
  `market:sync:{instrumentId}`             Synchronization state
  `market:provider:{providerId}`           Connection health

Example quote:

``` json
{
  "instrumentId": "UUID",
  "lastPrice": "152.4500",
  "cumulativeVolume": "250000",
  "exchangeTimestamp": 1795000000000,
  "provider": "upstox",
  "version": 105
}
```

Example order book:

``` json
{
  "instrumentId": "UUID",
  "bookType": "AGGREGATED",
  "bids": [
    {
      "price": "152.40",
      "quantity": "1200"
    },
    {
      "price": "152.35",
      "quantity": "2400"
    }
  ],
  "asks": [
    {
      "price": "152.45",
      "quantity": "800"
    },
    {
      "price": "152.50",
      "quantity": "1800"
    }
  ],
  "snapshotVersion": 105
}
```

Use atomic Lua scripts or version-checked transactions for updating
quote and book state.

For high-frequency depth deltas, maintain a dedicated order-book state
machine rather than repeatedly replacing the entire JSON document.

------------------------------------------------------------------------

# 7. API contracts

Separate APIs into four groups:

1.  Instrument and configuration APIs.
2.  Historical market-data APIs.
3.  Screening and analytics APIs.
4.  Real-time WebSocket APIs.

Use REST for commands and historical queries. Use WebSockets for
continuous updates.

## 7.1 Instrument APIs

  Method   Endpoint                          Purpose
  -------- --------------------------------- ------------------------
  GET      `/api/v1/markets`                 List supported markets
  GET      `/api/v1/exchanges`               List exchanges
  GET      `/api/v1/instruments`             Search instruments
  GET      `/api/v1/instruments/:id`         Instrument details
  GET      `/api/v1/instruments/:id/quote`   Latest quote
  GET      `/api/v1/instruments/:id/depth`   Latest market depth

Example:

``` http
GET /api/v1/instruments?market=INDIA&exchange=NSE&search=RELIANCE
```

Response:

``` json
{
  "items": [
    {
      "id": "instrument-uuid",
      "symbol": "RELIANCE",
      "exchange": "NSE",
      "market": "INDIA",
      "currency": "INR"
    }
  ]
}
```

## 7.2 Historical data APIs

  --------------------------------------------------------------------------------
  Method                  Endpoint                         Purpose
  ----------------------- -------------------------------- -----------------------
  GET                     `/api/v1/market/candles`         Fetch OHLCV

  GET                     `/api/v1/market/trades`          Fetch stored trades

  GET                     `/api/v1/market/depth/history`   Fetch retained depth
                                                           snapshots

  GET                     `/api/v1/market/indicators`      Fetch indicator values
  --------------------------------------------------------------------------------

Example:

``` http
GET /api/v1/market/candles
    ?instrumentId=UUID
    &timeframe=5m
    &from=2026-11-18T09:15:00+05:30
    &to=2026-11-18T15:30:00+05:30
```

Response:

``` json
{
  "instrumentId": "UUID",
  "timeframe": "5m",
  "source": "internal-aggregation",
  "candles": [
    {
      "time": "2026-11-18T09:15:00+05:30",
      "open": "100.00",
      "high": "102.00",
      "low": "99.00",
      "close": "101.50",
      "volume": "25000",
      "isFinal": true
    }
  ]
}
```

Use cursor-based pagination for large trade and historical-depth
responses.

## 7.3 Watchlist APIs

  ----------------------------------------------------------------------------------------------------
  Method                  Endpoint                                             Purpose
  ----------------------- ---------------------------------------------------- -----------------------
  GET                     `/api/v1/watchlists`                                 List watchlists

  POST                    `/api/v1/watchlists`                                 Create watchlist

  GET                     `/api/v1/watchlists/:id`                             Get watchlist

  PUT                     `/api/v1/watchlists/:id`                             Update watchlist

  DELETE                  `/api/v1/watchlists/:id`                             Delete watchlist

  POST                    `/api/v1/watchlists/:id/instruments`                 Add instruments

  DELETE                  `/api/v1/watchlists/:id/instruments/:instrumentId`   Remove instrument
  ----------------------------------------------------------------------------------------------------

## 7.4 Screener APIs

  Method   Endpoint                           Purpose
  -------- ---------------------------------- ----------------------
  POST     `/api/v1/screeners`                Create screener
  GET      `/api/v1/screeners`                List screeners
  GET      `/api/v1/screeners/:id`            Fetch screener
  PUT      `/api/v1/screeners/:id`            Update screener
  DELETE   `/api/v1/screeners/:id`            Delete screener
  POST     `/api/v1/screeners/:id/evaluate`   Evaluate once
  GET      `/api/v1/screeners/:id/results`    Fetch latest results

Example request:

``` json
{
  "name": "Volume Breakout",
  "market": "INDIA",
  "universe": {
    "type": "INDEX",
    "value": "NIFTY_500"
  },
  "timeframe": "1m",
  "logic": "AND",
  "conditions": [
    {
      "field": "ltp",
      "operator": "GT",
      "reference": "previous_day_high"
    },
    {
      "field": "relative_volume",
      "operator": "GT",
      "value": 2
    },
    {
      "field": "rsi",
      "operator": "GT",
      "value": 60,
      "period": 14
    }
  ]
}
```

Response:

``` json
{
  "id": "screener-uuid",
  "status": "ACTIVE",
  "createdAt": "2026-11-18T12:00:00Z"
}
```

The evaluation endpoint should return a job ID for large universes
rather than block the HTTP request.

## 7.5 Alert APIs

``` http
POST /api/v1/alerts
GET /api/v1/alerts
GET /api/v1/alerts/:id
PATCH /api/v1/alerts/:id
DELETE /api/v1/alerts/:id

GET /api/v1/alerts/executions
```

Example:

``` json
{
  "instrumentId": "UUID",
  "condition": {
    "field": "ltp",
    "operator": "CROSSES_ABOVE",
    "value": 150
  },
  "cooldownSeconds": 300,
  "enabled": true
}
```

## 7.6 WebSocket API contract

Connection:

``` text
wss://your-domain.com/ws/market
```

Subscribe:

``` json
{
  "type": "SUBSCRIBE",
  "requestId": "req-001",
  "subscriptions": [
    {
      "instrumentId": "uuid-1",
      "channels": ["QUOTE", "DEPTH", "CANDLE"],
      "timeframes": ["1m", "5m"]
    }
  ]
}
```

Server acknowledgement:

``` json
{
  "type": "SUBSCRIPTION_ACK",
  "requestId": "req-001",
  "status": "SUCCESS"
}
```

Incoming quote:

``` json
{
  "type": "QUOTE_UPDATE",
  "instrumentId": "uuid-1",
  "sequence": 105,
  "data": {
    "ltp": "150.50",
    "volume": "250000"
  }
}
```

Incoming depth:

``` json
{
  "type": "DEPTH_UPDATE",
  "instrumentId": "uuid-1",
  "sequence": 106,
  "data": {
    "bids": [],
    "asks": []
  }
}
```

For order books, distinguish:

``` text
DEPTH_SNAPSHOT
DEPTH_DELTA
DEPTH_RESET
```

A delta must only be applied when its expected sequence/version matches
the current book state. If the client detects a sequence gap, it should
request a fresh snapshot.

------------------------------------------------------------------------

# 8. Complete event flows

## 8.1 Market opening and initial synchronization

``` mermaid
sequenceDiagram
    participant Scheduler
    participant Ingestion
    participant Broker
    participant Sync
    participant Historical
    participant Redis
    participant Processor

    Scheduler->>Ingestion: Start market connection
    Ingestion->>Broker: Authenticate
    Ingestion->>Broker: Subscribe instruments
    Broker-->>Ingestion: Initial snapshot
    Ingestion->>Redis: Buffer live state
    Ingestion->>Sync: Synchronization started
    Sync->>Historical: Request historical candles
    Historical-->>Sync: Historical candles
    Sync->>Sync: Build indicator state
    Sync->>Sync: Reconcile buffered events
    Sync->>Redis: Publish synchronized state
    Sync->>Processor: Mark instrument LIVE
```

An instrument should not be marked `LIVE` simply because its WebSocket
connection is open.

It should be marked live only after: - The provider connection is
authenticated. - The subscription is acknowledged or otherwise
confirmed. - An initial snapshot is received. - Historical state has
been reconciled. - No unresolved gap exists within the required recovery
scope.

## 8.2 Continuous market updates

``` mermaid
sequenceDiagram
    participant Broker
    participant Ingestion
    participant BrokerQueue
    participant Redis
    participant Candle
    participant Analytics
    participant Screener
    participant Alert

    Broker->>Ingestion: Market tick
    Ingestion->>Ingestion: Normalize and validate
    Ingestion->>BrokerQueue: Publish event
    BrokerQueue->>Redis: Update quote state
    BrokerQueue->>Candle: Update current candle
    Candle->>Analytics: Candle update
    Analytics->>Screener: Indicator update
    Screener->>Screener: Evaluate conditions
    Screener->>Alert: Trigger transition
```

Consumers should be independently recoverable. A temporary screener
failure must not stop market ingestion.

## 8.3 Market-depth updates

``` text
BROKER DEPTH SNAPSHOT
         |
         v
INITIAL BOOK CONSTRUCTION
         |
         v
STORE BOOK IN REDIS
         |
         v
RECEIVE DEPTH DELTA
         |
         v
CHECK SEQUENCE / POSITION
         |
    +----+----+
    |         |
   VALID     INVALID
    |         |
    v         v
APPLY       REQUEST SNAPSHOT
DELTA       / REBUILD BOOK
    |
    v
PUBLISH UPDATED BOOK
```

Do not calculate bid/ask imbalance from an incomplete book.

Maintain the source, depth count, last-update time and book
synchronization status.

## 8.4 Alert execution

``` mermaid
sequenceDiagram
    participant Feed
    participant Screener
    participant State
    participant Alert
    participant DB
    participant UI

    Feed->>Screener: New market state
    Screener->>State: Read previous condition state
    Screener->>Screener: Evaluate condition
    Screener->>State: Persist transition
    Screener->>Alert: Trigger event
    Alert->>DB: Save idempotent execution
    Alert->>UI: Publish notification
```

Use a transactional outbox pattern if reliable publication of alert
events alongside database persistence is required.

For a personal implementation, this is preferable to relying on a
database write followed by an untracked WebSocket send.

------------------------------------------------------------------------

# 9. Historical and live synchronization engine

This is the subsystem that deserves the most engineering effort.

The platform must maintain consistent state even if: - The computer
restarts. - A broker disconnects for 30 seconds. - The internet
connection fails. - A market opens while the application is offline. -
Historical API requests are rate-limited. - The broker sends duplicate
or delayed events.

## 9.1 Synchronization state machine

Maintain synchronization status independently for every instrument and
provider.

``` typescript
export type SyncStatus =
  | "UNINITIALIZED"
  | "CONNECTING"
  | "SUBSCRIBING"
  | "BUFFERING"
  | "HISTORICAL_SYNC"
  | "RECONCILING"
  | "LIVE"
  | "STALE"
  | "GAP_DETECTED"
  | "RECOVERING"
  | "FAILED";
```

State transitions:

``` text
UNINITIALIZED
      |
      v
CONNECTING
      |
      v
SUBSCRIBING
      |
      v
BUFFERING
      |
      v
HISTORICAL_SYNC
      |
      v
RECONCILING
      |
      v
LIVE
      |
      +----------> STALE
      |              |
      |              v
      |          RECOVERING
      |              |
      +--------------+

Any unrecoverable failure -> FAILED
```

## 9.2 Historical bootstrap algorithm

Suppose the application starts at 11:00 AM and the market opened at 9:15
AM.

Recommended algorithm:

1.  **Connect and subscribe.** Establish the broker connection and
    subscribe to the instrument.
2.  **Buffer incoming events.** Store incoming events in a bounded
    buffer before beginning historical retrieval.
3.  **Establish a synchronization watermark.** Define the event-time
    boundary up to which historical data has been fetched.
4.  **Fetch historical candles.** Fetch all required candles, including
    enough previous-session history to initialize indicators.
5.  **Rebuild indicator state.** Calculate EMA, RSI, ATR, VWAP, moving
    averages and relative-volume baselines.
6.  **Replay buffered live events.** Apply buffered events after the
    historical watermark.
7.  **Detect missing data.** Check missing candle intervals, source
    sequence gaps, timestamp regressions, volume discontinuities and
    incomplete snapshots.
8.  **Reconcile.** Fetch missing candles where supported, correct
    current candle state and rebuild affected indicator state.
9.  **Publish synchronized state.** Only now should the instrument
    become a fully synchronized input to the screener.

## 9.3 Example synchronization service

``` typescript
async function synchronizeInstrument(
  instrumentId: string
): Promise<void> {

  await syncState.set(instrumentId, "BUFFERING");

  // 1. Subscribe to live data.
  await marketProvider.subscribe([
    { instrumentId }
  ]);

  // 2. Establish the historical boundary.
  const watermark = await clock.getExchangeWatermark(
    instrumentId
  );

  // 3. Fetch sufficient historical candles.
  await syncState.set(instrumentId, "HISTORICAL_SYNC");

  const historical = await historicalService.getCandles({
    instrumentId,
    timeframe: "1m",
    endTime: watermark
  });

  // 4. Build initial market and indicator state.
  await candleEngine.restore(historical);

  await indicatorEngine.initialize(
    instrumentId,
    historical
  );

  // 5. Replay events newer than the watermark.
  await syncState.set(instrumentId, "RECONCILING");

  const bufferedEvents = await eventBuffer.getAfter(
    instrumentId,
    watermark
  );

  for (const event of bufferedEvents) {
    await marketProcessor.process(event);
  }

  // 6. Check for missing intervals.
  const gaps = await reconciliationService.detectGaps(
    instrumentId,
    watermark
  );

  if (gaps.length > 0) {
    await reconciliationService.repair(
      instrumentId,
      gaps
    );
  }

  // 7. Publish ready state.
  await syncState.set(instrumentId, "LIVE");
}
```

This is an architectural skeleton, not a complete implementation. In
production: - Make synchronization idempotent. - Use durable buffering
when recovery requirements demand it. - Ensure events cannot be
processed twice in an order that corrupts candle or indicator state.

## 9.4 Tick-recovery limitations

Distinguish between three guarantees:

  -----------------------------------------------------------------------
  Recovery type                       Possible approach
  ----------------------------------- -----------------------------------
  Latest quote recovery               Request a fresh quote snapshot

  Candle recovery                     Fetch historical OHLCV

  Exact missed tick recovery          Requires provider historical
                                      trade/tick data
  -----------------------------------------------------------------------

If a broker does not expose historical trades, missed trades cannot be
reconstructed from candles.

Likewise, if historical order-book snapshots are unavailable, the exact
past order book cannot be reconstructed.

This is a provider limitation, not something Kafka or Redis can solve.

------------------------------------------------------------------------

# 10. Candle engine design

The candle engine should be independent of the provider. It receives
normalized trades or quote updates according to the source's documented
semantics.

## 10.1 Candle state

``` typescript
interface CandleState {
  instrumentId: string;
  timeframe: string;

  startTime: number;
  endTime: number;

  open: string;
  high: string;
  low: string;
  close: string;

  volume: string;

  isFinal: boolean;
  lastProcessedEventTime: number;
}
```

Aggregation rules:

  Field    Rule
  -------- -------------------------------------------------------
  Open     First eligible trade price
  High     Maximum eligible trade price
  Low      Minimum eligible trade price
  Close    Last eligible trade price
  Volume   Sum of unique trade quantities or valid volume deltas

A quote update is not necessarily a trade. If the broker provides only
quote updates, do not assume each update represents a new executed
trade.

If the provider sends cumulative traded volume, update the candle using
volume deltas:

\[ `\Delta `{=tex}V_t = V_t - V\_{t-1} \]

Handle: - Session resets. - Provider changes. - Duplicate events. -
Out-of-order cumulative values. - Corrections to historical data.

Never blindly add the latest cumulative volume to the candle.

## 10.2 Timeframe aggregation

Build one canonical one-minute candle stream and derive higher
timeframes:

``` text
1-minute candles
       |
       +----> 5-minute
       |
       +----> 15-minute
       |
       +----> 30-minute
       |
       +----> 1-hour
       |
       +----> Daily
```

Do not assume a trading session is a continuous 24-hour clock.

-   NSE/BSE use Indian market calendars and IST.
-   US equities use US Eastern Time and daylight-saving transitions.
-   Holidays and early closes must be represented explicitly.

Create an exchange-calendar module. Do not generate candles across
closed-market intervals.

## 10.3 Corporate actions

For historical stock analysis, implement: - Stock splits. - Bonus
issues. - Dividends. - Symbol changes. - Mergers where applicable.

Maintain raw prices separately from adjusted historical prices.
Otherwise, moving averages and backtesting can become misleading after a
split or other corporate action.

------------------------------------------------------------------------

# 11. Indicator computation engine

Separate indicator calculation from screener evaluation.

``` text
Market Events
      |
      v
Candle Engine
      |
      v
Indicator Engine
      |
      +---- SMA
      +---- EMA
      +---- RSI
      +---- MACD
      +---- VWAP
      +---- ATR
      +---- Bollinger Bands
      |
      v
Indicator State Store
      |
      v
Screener Engine
```

## 11.1 Indicator configuration

``` typescript
interface IndicatorDefinition {
  name: string;

  timeframe: string;

  parameters: Record<string, number>;

  input:
    | "OPEN"
    | "HIGH"
    | "LOW"
    | "CLOSE"
    | "VOLUME"
    | "TYPICAL_PRICE";

  calculationMode:
    | "INTRABAR"
    | "CLOSED_CANDLE";
}
```

Example:

``` json
{
  "name": "RSI",
  "timeframe": "5m",
  "parameters": {
    "period": 14
  },
  "input": "CLOSE",
  "calculationMode": "CLOSED_CANDLE"
}
```

## 11.2 Incremental indicator calculation

Do not recompute indicators from hundreds of historical candles for
every incoming event.

Maintain incremental state per instrument and timeframe:

``` text
Instrument 1001
    |
    +---- EMA 20 state
    +---- EMA 50 state
    +---- RSI 14 state
    +---- VWAP state
    +---- ATR 14 state
```

Persist checkpoints periodically and restore from the last completed
candle when restarting.

Test implementations against a trusted reference dataset. RSI
initialization, EMA seeding, candle boundaries and missing-data behavior
can otherwise create differences between your charts and external
charting platforms.

------------------------------------------------------------------------

# 12. Screener engine implementation

Build a small domain-specific language (DSL), not a general-purpose
expression interpreter.

## 12.1 Screener condition tree

``` json
{
  "type": "GROUP",
  "operator": "AND",
  "children": [
    {
      "type": "CONDITION",
      "field": "ltp",
      "operator": "GT",
      "reference": {
        "type": "INDICATOR",
        "name": "previous_day_high"
      }
    },
    {
      "type": "GROUP",
      "operator": "OR",
      "children": [
        {
          "type": "CONDITION",
          "field": "rsi_14",
          "operator": "GT",
          "value": 60
        },
        {
          "type": "CONDITION",
          "field": "relative_volume",
          "operator": "GT",
          "value": 2
        }
      ]
    }
  ]
}
```

Validate: - Supported fields. - Supported operators. - Indicator
parameters. - Timeframe compatibility. - Market-specific field
availability. - Required historical lookback. - Maximum expression
complexity.

## 12.2 Dependency-based evaluation

When a market event arrives, determine what changed.

``` text
Instrument: RELIANCE
Event: VOLUME_UPDATE

Find dependent screeners:
    |
    +---- Screener A: volume > 2x average
    +---- Screener B: relative volume > 1.5
    +---- Screener C: volume breakout

Evaluate only these screeners.
```

Maintain an inverted index:

``` text
instrumentId -> screenerIds
indicatorKey -> screenerIds
```

For a single-user platform, a simple in-memory index with Redis
persistence for configuration is sufficient initially.

------------------------------------------------------------------------

# 13. Data-source costs and operational constraints

Keep the architecture cost-conscious, but do not assume full depth for
both countries will be free.

  ---------------------------------------------------------------------------
  Cost category           India                   US
  ----------------------- ----------------------- ---------------------------
  Broker API access       Provider-dependent      Provider-dependent

  Exchange data           Verify with broker      Verify with broker
  entitlement                                     

  Level II data           Verify depth            Usually requires additional
                          entitlement             market-data
                                                  permissions/subscriptions

  Historical candles      Provider-dependent      Provider-dependent

  Historical ticks        Often limited           Provider-dependent

  Cloud hosting           Your infrastructure     Your infrastructure cost
                          cost                    
  ---------------------------------------------------------------------------

IBKR requires the appropriate market-data subscriptions and permissions
for live market data.

For Indian data, verify broker agreements and exchange-specific terms.
Personal broker access should not be treated as a general commercial
redistribution licence.

Implement a provider cost/capability registry so the platform can show:

``` text
NSE RELIANCE
  Provider: Upstox
  Feed: Full D30
  Status: LIVE
  Depth: 30 levels

NASDAQ AAPL
  Provider: IBKR
  Feed: Market Depth
  Status: LIVE
  Depth: Entitled levels
```

If a provider only supports Level I for a particular instrument, the UI
should say so.

------------------------------------------------------------------------

# 14. Nx monorepo implementation

Use Nx with TypeScript project boundaries and shared domain contracts.

## 14.1 Repository structure

``` text
stock-analysis-platform/
│
├── apps/
│   ├── web/
│   │   ├── src/
│   │   └── project.json
│   │
│   ├── api/
│   │   ├── src/
│   │   └── project.json
│   │
│   ├── market-ingestion/
│   │   ├── src/
│   │   └── project.json
│   │
│   ├── market-processor/
│   │   ├── src/
│   │   └── project.json
│   │
│   ├── candle-engine/
│   │   ├── src/
│   │   └── project.json
│   │
│   ├── analytics-engine/
│   │   ├── src/
│   │   └── project.json
│   │
│   ├── screener-engine/
│   │   ├── src/
│   │   └── project.json
│   │
│   ├── alert-engine/
│   │   ├── src/
│   │   └── project.json
│   │
│   └── websocket-gateway/
│       ├── src/
│       └── project.json
│
├── libs/
│   ├── domain/
│   │   ├── instruments/
│   │   ├── market-data/
│   │   ├── indicators/
│   │   ├── screeners/
│   │   └── alerts/
│   │
│   ├── providers/
│   │   ├── provider-contracts/
│   │   ├── upstox/
│   │   ├── angel-one/
│   │   ├── ibkr/
│   │   └── alpaca/
│   │
│   ├── infrastructure/
│   │   ├── database/
│   │   ├── redis/
│   │   ├── messaging/
│   │   └── logging/
│   │
│   ├── market/
│   │   ├── normalization/
│   │   ├── synchronization/
│   │   ├── candles/
│   │   ├── order-book/
│   │   └── indicators/
│   │
│   └── shared/
│       ├── types/
│       ├── validation/
│       └── utilities/
│
├── infra/
│   ├── docker/
│   ├── postgres/
│   ├── redis/
│   ├── monitoring/
│   └── aws/
│
├── tools/
│   ├── scripts/
│   ├── migrations/
│   └── instrument-import/
│
├── docker-compose.yml
├── nx.json
├── tsconfig.base.json
└── package.json
```

## 14.2 Why this structure?

**Domain libraries** contain business logic independent of
infrastructure: - Indicator calculations. - Candle aggregation rules. -
Screener condition evaluation. - Instrument identity.

**Provider libraries** contain external integration details: - Upstox
Protobuf decoding. - Angel One binary message decoding. - IBKR depth
callbacks. - Alpaca quote/trade decoding.

**Infrastructure libraries** contain implementation details: -
PostgreSQL repositories. - Redis repositories. - Message publishing. -
Logging.

This separation ensures that changing a broker does not require
rewriting the analytics engine.

## 14.3 Nx dependency rules

``` text
web
 |
 v
api-contracts

api
 |
 +---- domain
 +---- infrastructure

market-ingestion
 |
 +---- providers
 +---- market-data contracts

market-processor
 |
 +---- normalization
 +---- domain

candle-engine
 |
 +---- market-data
 +---- candle-domain

analytics-engine
 |
 +---- indicators

screener-engine
 |
 +---- screeners
 +---- indicators

alert-engine
 |
 +---- alerts
```

Enforce these restrictions:

-   Domain must not import NestJS.
-   Domain must not import Redis clients.
-   Domain must not import broker SDKs.
-   Provider adapters must implement domain-owned interfaces.
-   Frontend must not import backend implementation code.
-   Database entities must not leak into public API contracts.

This is a practical application of Clean Architecture and dependency
inversion.

------------------------------------------------------------------------

# 15. Development roadmap with Nx

Organize development into ten implementation milestones.

## M1 --- Project foundation

-   Create Nx workspace.
-   Configure TypeScript.
-   Configure linting and formatting.
-   Create PostgreSQL and Redis infrastructure.
-   Establish shared contracts.

Completion: workspace runs locally.

## M2 --- Instrument registry

-   Markets and exchanges.
-   NSE/BSE instrument importer.
-   NYSE/NASDAQ instrument importer.
-   Provider token mapping.
-   Instrument search API.

Completion: unified instrument master.

## M3 --- Broker adapters

-   Upstox WebSocket.
-   Angel One WebSocket.
-   IBKR integration.
-   Alpaca integration.
-   Authentication and reconnection.
-   Capability detection.

Completion: live quotes and depth.

## M4 --- Market event pipeline

-   Event normalization.
-   Event validation.
-   Redis Streams.
-   Event ordering.
-   Duplicate handling.
-   Latest quote cache.

Completion: normalized live feed.

## M5 --- Synchronization and candles

-   Historical data importer.
-   Synchronization checkpoints.
-   Live event buffering.
-   Gap detection.
-   Candle aggregation.
-   TimescaleDB persistence.

Completion: reliable historical/live continuity.

## M6 --- Analytics

-   Indicator library.
-   Incremental calculations.
-   Indicator state restoration.
-   Indicator APIs.
-   Calculation tests.

Completion: consistent indicator engine.

## M7 --- Screener engine

-   Screener DSL.
-   Condition validation.
-   AND/OR groups.
-   Instrument subscription index.
-   Incremental evaluation.

Completion: live custom screeners.

## M8 --- Alerts

-   Alert configurations.
-   Trigger state machine.
-   Idempotency.
-   Cooldown.
-   In-app notifications.

Completion: reliable notifications.

## M9 --- Frontend

-   Market dashboard.
-   Stock detail page.
-   Candlestick charts.
-   Watchlists.
-   Market depth.
-   Screener builder.
-   Alert management.

Completion: functional trading analysis workspace.

## M10 --- Production readiness

-   Docker deployment.
-   CI/CD.
-   Monitoring.
-   Backups.
-   Recovery testing.
-   Load testing.
-   Security review.

Completion: production-ready personal platform.

## 15.1 Initial Nx commands

``` bash
npx create-nx-workspace@latest stock-analysis-platform \
  --preset=apps \
  --nxCloud=skip
```

Add plugins:

``` bash
npm install @nx/next @nx/nest @nx/node
npm install @nx/js @nx/eslint
```

Install core dependencies:

``` bash
npm install \
  @nestjs/core \
  @nestjs/common \
  @nestjs/platform-express \
  @nestjs/websockets \
  @nestjs/platform-socket.io \
  ioredis \
  bullmq \
  pg \
  drizzle-orm \
  zod \
  decimal.js
```

Development dependencies:

``` bash
npm install -D \
  typescript \
  tsx \
  vitest \
  @types/node \
  eslint \
  prettier
```

For database migrations, use Drizzle Kit.

For Upstox, include its documented Protobuf definitions and a compatible
decoder.

For IBKR, isolate the TWS API integration behind the provider interface.
A separate Node-compatible gateway process or dedicated adapter process
may be needed depending on the SDK and deployment environment.

Do not introduce Kafka or Kubernetes at this stage.

------------------------------------------------------------------------

# 16. Deployment architecture

For a personal application, start with one reasonably sized Linux VM.

``` text
                  AWS
                   |
                EC2 VM
                   |
             Docker Compose
                   |
      +------------+-------------+
      |            |             |
      v            v             v
    Next.js       API        Ingestion
                              Workers
      |            |             |
      +------------+-------------+
                   |
          +--------+--------+
          |                 |
          v                 v
       Redis           PostgreSQL
                           |
                       TimescaleDB
```

Recommended deployment:

  Component    Deployment
  ------------ ----------------------------------
  Frontend     Next.js container
  API          NestJS container
  Ingestion    Separate Node.js containers
  Analytics    Worker container
  Screener     Worker container
  Alerts       Worker container
  Redis        Container
  PostgreSQL   Container with persistent volume
  Monitoring   Prometheus + Grafana

One VM is sufficient to validate the system, but it is not high
availability.

Use: - Encrypted database backups. - Persistent volumes. - Automated
restart policies. - Health checks. - CloudWatch or equivalent
monitoring. - Restricted network access. - A reverse proxy with TLS.

India and US providers operate on different market schedules. The
ingestion service should run continuously or wake based on exchange
calendars, but analytics and subscriptions should be active only when
relevant market sessions require them.

------------------------------------------------------------------------

# 17. Security and reliability requirements

  -----------------------------------------------------------------------
  Area                                Implementation
  ----------------------------------- -----------------------------------
  Broker credentials                  AWS Secrets Manager or encrypted
                                      secret storage

  OAuth tokens                        Encrypted at rest

  Token refresh                       Provider-specific authentication
                                      lifecycle

  API authentication                  JWT or secure session

  Frontend access                     HTTPS/WSS

  Database                            Private network only

  Redis                               Private network only,
                                      authentication enabled

  Input validation                    Zod or class-validator

  SQL injection                       Parameterized queries

  WebSocket security                  Authenticated connection and
                                      subscription validation

  Logs                                Never log access tokens or secrets

  Backups                             Automated, encrypted and tested
  -----------------------------------------------------------------------

Even for personal use: - Do not expose the API to the public internet
unnecessarily. - Keep broker credentials out of the Next.js application
and browser. - Only backend services should have access to broker
credentials.

------------------------------------------------------------------------

# 18. Observability and testing

Recommended tools: - Prometheus --- metrics monitoring. - Grafana ---
observability dashboards. - Structured JSON logging. - OpenTelemetry ---
distributed tracing.

## 18.1 Metrics

  Metric                             Why it matters
  ---------------------------------- ---------------------------
  `market_ticks_received_total`      Feed throughput
  `market_feed_latency_ms`           Data freshness
  `provider_reconnect_total`         Connection reliability
  `market_events_dropped_total`      Data-loss detection
  `candle_processing_latency_ms`     Candle-engine performance
  `screener_evaluation_latency_ms`   Screening performance
  `depth_sequence_gap_total`         Order-book integrity
  `market_sync_duration_seconds`     Recovery performance
  `websocket_clients_connected`      Frontend connection load

## 18.2 Required testing

**Unit tests** - Candle aggregation. - RSI/EMA calculations. - Screener
condition evaluation. - Order-book delta processing. - Duplicate-event
detection.

**Integration tests** - Broker adapter to normalized events. - Redis
event processing. - TimescaleDB persistence. - Historical/live
synchronization.

**Failure tests** - Disconnect the broker. - Restart the ingestion
service. - Introduce duplicate events. - Deliver out-of-order events. -
Drop a depth delta. - Restart Redis. - Restart PostgreSQL. - Disconnect
the browser.

**Financial correctness tests**

For the same historical input dataset, batch and incremental indicator
implementations must produce equivalent results within a defined
numerical tolerance.

Also test that a restarted candle engine reconstructs the same candle
state as an uninterrupted engine.

------------------------------------------------------------------------

# 19. Final architectural decisions

  Component                 Decision                      Priority
  ------------------------- ----------------------------- ----------
  Nx                        Monorepo                      L1
  Next.js                   Frontend                      L1
  NestJS                    API                           L1
  Upstox                    Indian primary candidate      L1
  Angel One                 Indian alternative            L1
  IBKR                      US primary depth candidate    L1
  Alpaca                    US Level I alternative        L2
  Redis                     Live market state             L1
  Redis Streams             Event distribution            L1
  PostgreSQL                Application data              L1
  TimescaleDB               Market history                L1
  Custom indicator engine   Financial calculations        L1
  Custom screener DSL       Rule evaluation               L1
  WebSockets                Frontend live updates         L1
  Kafka                     High-scale event processing   L2
  ClickHouse                Large-scale analytics         L3
  Kubernetes                Large-scale orchestration     L3

The most important design decision: keep market-data ingestion,
normalization, synchronization and analytics independent of the broker.

If Upstox is replaced with another provider, the candle engine,
indicator engine, screener engine and frontend should continue working
without modification.

------------------------------------------------------------------------

# 20. First implementation milestone

Do not start with the screener UI or technical indicators.

Build this vertical slice first:

## Live market-data foundation

-   [ ] Create Nx workspace and shared TypeScript contracts.
-   [ ] Create PostgreSQL + TimescaleDB and Redis using Docker Compose.
-   [ ] Create unified instrument registry for India and US.
-   [ ] Implement Upstox WebSocket adapter.
-   [ ] Implement IBKR market-data adapter.
-   [ ] Normalize LTP, OHLC, volume and market depth.
-   [ ] Store latest quotes and order books in Redis.
-   [ ] Implement reconnect and subscription restoration.
-   [ ] Implement historical candle bootstrap.
-   [ ] Build a live dashboard showing quote and depth updates.
-   [ ] Test disconnect, recovery and data reconciliation.

The next concrete deliverable should be the Nx project foundation and
the Market Data Ingestion module, including complete TypeScript
interfaces, provider adapter contracts, PostgreSQL migrations, Redis key
structures, WebSocket lifecycle and synchronization implementation. That
is the foundation everything else will depend on.

------------------------------------------------------------------------

# 21. Important engineering caveats

1.  Broker APIs do not necessarily provide all market data, all depth
    levels, historical ticks or historical order-book events.
2.  Exact missed-tick recovery is impossible unless the provider exposes
    the corresponding historical trade data.
3.  A quote update is not necessarily a trade and should not
    automatically be used to calculate traded volume.
4.  A provider failover must rebuild and reconcile state rather than mix
    incompatible provider streams.
5.  Use exchange calendars and timezone-aware timestamps for India and
    US markets.
6.  Keep raw and corporate-action-adjusted historical prices distinct.
7.  Do not claim the platform has complete order-book data unless the
    provider and entitlement actually supply it.
8.  Personal broker API access does not automatically grant commercial
    redistribution rights.
9.  Start with a modular monolith and independently running workers.
    Introduce Kafka, Kubernetes or ClickHouse only when measured
    requirements justify them.
