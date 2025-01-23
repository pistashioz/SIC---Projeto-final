import { gql } from 'graphql-tag';
const tipSchema = gql`
    type Tip {
        id: ID!
        title: String!
        info: String!
        image: String!
        cloudinary_id: String
        description: String!
        author: String!
        createdAt: String!
        updatedAt: String!
    }

    input TipInput {
        title: String!
        info: String!
        image: String!
        description: String!
        author: String!
    }


    type Query {
        getTip(id: ID!): Tip
        getTips(amount: Int): [Tip]
    }

    type Mutation {
        createTip(input: TipInput!): Tip!
        editTip(id: ID, tipInput: TipInput): Boolean
        deleteTip(id: ID!): Boolean
    } 
   
`;

export default tipSchema