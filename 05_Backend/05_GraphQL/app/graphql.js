import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import cors from 'cors';

// 1. Mock Data Source
const mockHistory = [
    { id: "1", prompt: "Explain API", response: "An API lets apps talk to each other.", model: "gemini-2.5-flash" },
    { id: "2", prompt: "What is React?", response: "A JavaScript library for building UIs.", model: "gemini-2.5-flash" }
];

// 2. Schema Definition
const typeDefs = `#graphql
  type ChatSession {
    id: ID!
    prompt: String!
    response: String!
    model: String!
  }

  type Query {
    getHistory: [ChatSession!]!
  }

  type Mutation {
    askGemini(prompt: String!): ChatSession!
  }
`;

// 3. Resolvers utilizing Mock Data
const resolvers = {
    Query: {
        getHistory: () => mockHistory,
    },
    Mutation: {
        askGemini: (_, { prompt }) => {
            // Simulating a fast AI generation cycle
            const mockAiResponse = {
                id: String(mockHistory.length + 1),
                prompt: prompt,
                response: `[Mock AI Response to: "${prompt}"] This is simulated text.`,
                model: "gemini-2.5-flash"
            };
            mockHistory.push(mockAiResponse);
            return mockAiResponse;
        }
    }
};

// 4. Start Apollo Server
const server = new ApolloServer({ typeDefs, resolvers });