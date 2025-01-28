import { gql } from 'graphql-tag';
const favoriteTipSchema = gql`
    type FavoriteTip {
        id: ID!
        userId: ID!
        tipId: ID!
    }

    input FavoriteTipInput {
        userId: ID!
        tipId: ID!
    }

    type Query {
        getFavoriteTips(userId: ID!): [FavoriteTip]
    }
    type Mutation {
        addFavoriteTip(input: FavoriteTipInput!): FavoriteTip!
        removeFavoriteTip(id: ID!): Boolean!
    }


`

export default favoriteTipSchema