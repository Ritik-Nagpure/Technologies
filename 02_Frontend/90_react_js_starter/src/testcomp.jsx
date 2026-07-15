import React, { useMemo, useState } from "react";

const MOCK_HOTELS = [
  {
    id: 1,
    name: "Grand Plaza Hotel",
    location: "New York",
    pricepernight: 250,
  },
  {
    id: 2,
    name: "Oceanview Resort",
    location: "Miami",
    pricepernight: 180,
  },
  {
    id: 3,
    name: "Mountain Retreat",
    location: "Denver",
    pricepernight: 150,
  },
  {
    id: 4,
    name: "City Center Inn",
    location: "Chicago",
    pricepernight: 120,
  },
  {
    id: 5,
    name: "The Riverside Boutique",
    location: "London",
    pricepernight: 300,
  },
  {
    id: 6,
    name: "Desert Mirage Spa",
    location: "Dubai",
    pricepernight: 450,
  },
  {
    id: 7,
    name: "Historic Heritage Hotel",
    location: "Rome",
    pricepernight: 220,
  },
  {
    id: 8,
    name: "Sakura Blossom Inn",
    location: "Tokyo",
    pricepernight: 190,
  },
  {
    id: 9,
    name: "Tropical Paradise Villas",
    location: "Bali",
    pricepernight: 110,
  },
  {
    id: 10,
    name: "Northern Lights Lodge",
    location: "Reykjavik",
    pricepernight: 350,
  },
];

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);

const Test = () => {
  const [locationQuery, setLocationQuery] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [selected, setSelected] = useState([]);

  const filteredHotels = useMemo(() => {
    const query = locationQuery.trim().toLowerCase();
    const priceLimit = Number(minPrice) || 0;

    return MOCK_HOTELS.filter((hotel) => {
      const matchesLocation =
        query.length === 0 || hotel.location.toLowerCase().includes(query);
      const matchesPrice = priceLimit === 0 || hotel.pricepernight >= priceLimit;

      return matchesLocation && matchesPrice;
    });
  }, [locationQuery, minPrice]);

  const selectedIds = useMemo(
    () => new Set(selected.map((hotel) => hotel.id)),
    [selected]
  );

  const totalPrice = useMemo(
    () => selected.reduce((acc, hotel) => acc + hotel.pricepernight, 0),
    [selected]
  );

  const highestPrice = useMemo(
    () => Math.max(...MOCK_HOTELS.map((hotel) => hotel.pricepernight)),
    []
  );

  const addSelected = (hotelId) => {
    const hotel = MOCK_HOTELS.find((item) => item.id === hotelId);

    if (!hotel || selectedIds.has(hotelId)) {
      return;
    }

    setSelected((current) => [...current, hotel]);
  };

  const removeSelected = (hotelId) => {
    setSelected((current) => current.filter((hotel) => hotel.id !== hotelId));
  };

  const clearFilters = () => {
    setLocationQuery("");
    setMinPrice("");
  };

  return (
    <section className="min-h-screen bg-slate-50 px-4 py-8 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto grid w-full max-w-7xl gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <header className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_260px] lg:items-end">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
                  Hotel finder
                </p>
                <h1 className="mt-3 max-w-3xl text-3xl font-black leading-tight text-slate-950 sm:text-5xl">
                  Find stays that match your city and budget.
                </h1>
                <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
                  Search by location, filter by minimum nightly price, and build
                  a clean shortlist of hotels without adding duplicates.
                </p>
              </div>

              <div className="rounded-xl bg-slate-950 p-5 text-white">
                <p className="text-sm text-slate-300">Current shortlist total</p>
                <p className="mt-2 text-4xl font-black">
                  {formatCurrency(totalPrice)}
                </p>
                <p className="mt-2 text-sm text-slate-400">
                  {selected.length} hotel{selected.length === 1 ? "" : "s"}{" "}
                  selected
                </p>
              </div>
            </div>
          </header>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_220px_auto]">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">
                  Location
                </span>
                <input
                  type="text"
                  value={locationQuery}
                  placeholder="Try Miami, Tokyo, London..."
                  onChange={(event) => setLocationQuery(event.target.value)}
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-slate-950 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">
                  Minimum price
                </span>
                <input
                  type="number"
                  min="0"
                  max={highestPrice}
                  value={minPrice}
                  placeholder="0"
                  onChange={(event) => setMinPrice(event.target.value)}
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-slate-950 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                />
              </label>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={clearFilters}
                  className="h-12 w-full rounded-xl border border-slate-200 px-5 text-sm font-bold text-slate-700 transition hover:border-slate-300 hover:bg-slate-100 md:w-auto"
                >
                  Clear
                </button>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2 text-sm text-slate-600">
              <span className="rounded-full bg-emerald-50 px-3 py-1 font-semibold text-emerald-700">
                {filteredHotels.length} result
                {filteredHotels.length === 1 ? "" : "s"}
              </span>
              <span className="rounded-full bg-blue-50 px-3 py-1 font-semibold text-blue-700">
                Up to {formatCurrency(highestPrice)} per night
              </span>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {filteredHotels.map((hotel) => {
              const isSelected = selectedIds.has(hotel.id);

              return (
                <article
                  key={hotel.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-black text-slate-950">
                        {hotel.name}
                      </h2>
                      <p className="mt-1 text-sm font-semibold text-slate-500">
                        {hotel.location}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-sm font-black text-slate-800">
                      {formatCurrency(hotel.pricepernight)}
                    </span>
                  </div>

                  <div className="mt-5 flex items-center justify-between gap-3">
                    <p className="text-sm text-slate-500">Per night</p>
                    <button
                      type="button"
                      onClick={() => addSelected(hotel.id)}
                      disabled={isSelected}
                      className={`h-10 rounded-xl px-4 text-sm font-bold transition ${
                        isSelected
                          ? "cursor-not-allowed bg-emerald-50 text-emerald-700"
                          : "bg-slate-950 text-white hover:bg-emerald-700"
                      }`}
                    >
                      {isSelected ? "Selected" : "Add hotel"}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>

          {filteredHotels.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
              <h2 className="text-xl font-black text-slate-950">
                No hotels found
              </h2>
              <p className="mt-2 text-slate-600">
                Try another location or lower the minimum price.
              </p>
              <button
                type="button"
                onClick={clearFilters}
                className="mt-5 h-11 rounded-xl bg-slate-950 px-5 text-sm font-bold text-white transition hover:bg-emerald-700"
              >
                Reset search
              </button>
            </div>
          )}
        </div>

        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
                Shortlist
              </p>
              <h2 className="mt-1 text-2xl font-black text-slate-950">
                Your selected stays
              </h2>
            </div>
            {selected.length > 0 && (
              <button
                type="button"
                onClick={() => setSelected([])}
                className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-100"
              >
                Clear all
              </button>
            )}
          </div>

          <div className="mt-5 space-y-3">
            {selected.map((hotel) => (
              <div
                key={hotel.id}
                className="rounded-xl border border-slate-200 bg-slate-50 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-black text-slate-950">{hotel.name}</h3>
                    <p className="mt-1 text-sm text-slate-500">
                      {hotel.location}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeSelected(hotel.id)}
                    className="rounded-lg px-2 py-1 text-sm font-black text-slate-400 transition hover:bg-white hover:text-red-600"
                    aria-label={`Remove ${hotel.name}`}
                  >
                    x
                  </button>
                </div>
                <p className="mt-3 text-sm font-black text-slate-800">
                  {formatCurrency(hotel.pricepernight)} / night
                </p>
              </div>
            ))}
          </div>

          {selected.length === 0 && (
            <div className="mt-5 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5 text-center">
              <p className="font-bold text-slate-700">No hotels selected yet</p>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Add hotels from the results to compare your total.
              </p>
            </div>
          )}

          <div className="mt-5 rounded-xl bg-slate-950 p-4 text-white">
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-slate-300">Total per night</span>
              <strong className="text-2xl">{formatCurrency(totalPrice)}</strong>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
};

export default Test;
