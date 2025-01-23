import { gql } from 'graphql-tag';
const userSchema = gql`
    type User {
        id: ID!
        username: String!
        name: String!
        email: String!
        createdAt: String!
        updatedAt: String!
        token: String
        favoriteTips: [Tip]
        events: [Event]
    }

    input SignUpInput  {
        username: String!
        name: String!
        email: String!
        password: String!
    }

    input UserInput {
        username: String!
        name: String!
        email: String!
        password: String!
    }

    type LogoutResponse {
    success: Boolean!
    message: String!
    }


    type Mutation {
        signUp(signUpInput : SignUpInput!): User!
        login(username: String!, password: String!): User!
        updateUserProfile(id: ID, userInput: UserInput): Boolean
        logout: LogoutResponse!
    }

    type Query {
        getUser(id: ID!): User
        getUsers(amount: Int): [User]
    }
`;
export default userSchema