import express from 'express';
import http from 'http';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { makeExecutableSchema } from '@graphql-tools/schema';
import mongoose from 'mongoose';
import { useServer } from 'graphql-ws/use/ws';
import { WebSocketServer } from 'ws';
import { gql } from 'graphql-tag';
import { applyMiddleware } from 'graphql-middleware';

import userSchema from './graphql/schemas/userSchema.js';
import tipSchema from './graphql/schemas/tipSchema.js';
import favoriteTipSchema from './graphql/schemas/favoriteTipSchema.js';
import eventSchema from './graphql/schemas/eventSchema.js';
import userResolvers from './graphql/resolvers/userResolvers.js';
import tipResolvers from './graphql/resolvers/tipResolvers.js';
import favoritetipResolvers from './graphql/resolvers/favoriteTipResolvers.js';
import eventResolvers from './graphql/resolvers/eventResolvers.js';
import pubsub from './utils/pubsub.js';


import config from './config/db.config.js';

const typeDefs = gql`
  ${userSchema}
  ${tipSchema}
  ${favoriteTipSchema}
  ${eventSchema}
`;

const resolvers = [
    userResolvers,
    tipResolvers,
    favoritetipResolvers,
    eventResolvers,
];

const schema = makeExecutableSchema({ typeDefs, resolvers });

const schemaWithMiddleware = applyMiddleware(schema);

const app = express();
const httpServer = http.createServer(app);

app.use(express.json());

const server = new ApolloServer({
    schema: schemaWithMiddleware,
    plugins: [
        ApolloServerPluginDrainHttpServer({ httpServer }),
    ],
    introspection: process.env.NODE_ENV !== 'production', 
    context: ({ req }) => {
      return {
        req,
        pubsub 
      };
    },
});

const connectToDatabase = async () => {
    try {
        await mongoose.connect(config.URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
};

const startServer = async () => {
    await server.start();
    app.use('/graphql', expressMiddleware(server));

  
    const wsServer = new WebSocketServer({
        server: httpServer,
        path: '/graphql',
    });
    useServer({ schema }, wsServer);

    const PORT = process.env.PORT || 4000;
    httpServer.listen(PORT, () => {
        console.log(`Server ready at http://localhost:${PORT}/graphql`);
    });
};

connectToDatabase().then(startServer);
