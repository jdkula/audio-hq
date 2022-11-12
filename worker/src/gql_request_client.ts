import { GraphQLClient } from 'graphql-request';

export function createGraphqlRequestClient(): GraphQLClient {
    return new GraphQLClient(process.env.NEXT_PUBLIC_HASURA_URL_WS as string, {
        headers: {
            'X-Hasura-Admin-Secret': process.env.HASURA_GRAPHQL_ADMIN_SECRET as string,
            'X-Hasura-Role': 'worker',
        },
    });
}
