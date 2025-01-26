import { gql } from '@apollo/client'

export const GET_TIPS = gql `
    query GetTips($amount: Int) {
        getTips(amount: $amount) {
            id
            title
            info
            image
            description
            author
            createdAt
        }
    }
`;

export const LOGIN_USER = gql `
    mutation Login($username: String!, $password: String!) {
        login(username: $username, password: $password) {
            id
            username
            name
            email
            token
        }
    }
`