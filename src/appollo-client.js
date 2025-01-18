import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
    uri: 'http://localhost:8000/graphql/', // Remplace l'URL par celle de ton endpoint GraphQL
    cache: new InMemoryCache(),
});

export default client;