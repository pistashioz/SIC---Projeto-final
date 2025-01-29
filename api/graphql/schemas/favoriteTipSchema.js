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
        removeFavoriteTip(tipId: ID!): Boolean!
    }

    type Subscription {
        favoriteTipAdded: FavoriteTip!
        favoriteTipRemoved: ID!
    }


`

export default favoriteTipSchema