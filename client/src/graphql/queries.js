import { gql } from '@apollo/client'

export const GET_TIPS = gql`
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

export const LOGIN_USER = gql`
    mutation Login($username: String!, $password: String!) {
        login(username: $username, password: $password) {
            id
            username
            name
            email
            token
        }
    }
`;

export const GET_AUTHENTICATED_USER = gql`
    query getUserDetails($token: String!) {
        getUserDetails(token: $token) {
            id
            username
            name
            email
            createdAt
            updatedAt
            token
            favoriteTips {
            id
            title
            info
            image
            cloudinary_id
            description
            author
            createdAt
            updatedAt
            }
            events {
            id
            eventType
            eventDate
            description
            state
            userId
            repeat
            repeatTime
            location
            }
        }
    }
`   
export const ADD_EVENT = gql`
    mutation AddEvent($eventInput: EventInput!) {
        addEvent(eventInput: $eventInput) {
            id
            eventType
            eventDate
            description
            state
            userId
            repeat
            repeatTime
            location
        }
    }
`

export const GET_EVENT = gql`
    query GetEvent($getEventId: ID!) {
        getEvent(id: $getEventId) {
            id
            eventType
            eventDate
            description
            state
            userId
            repeat
            repeatTime
            location
        }
    }
`

export const UPDATE_EVENT = gql`
    mutation EditEvent($editEventId: ID, $eventInput: EventInput) {
        editEvent(id: $editEventId, eventInput: $eventInput)
    }
`
