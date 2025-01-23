import { gql } from 'graphql-tag';
const eventSchema = gql`

    enum StateOption {
        COMPLETED
        PENDING
        POSTPONE
    }

    enum RepeatOption {
        DAILY
        WEEKLY
        MONTHLY
        NONE
    }


    type Event {
        id: ID!
        eventType: String!
        eventDate: String!
        description: String
        state: StateOption!
        userId: ID!
        repeat: RepeatOption!
        repeatTime: String!
    }

    input EventInput {
        eventType: String
        eventDate: String
        description: String
        state: StateOption
        repeat: RepeatOption!
        repeatTime: String!
    }

    type Query {
        getEvent(id: ID!): Event
        getEvents(amount: Int): [Event]
    }

    type Mutation {
        addEvent(eventInput: EventInput) : Event!
        editEvent(id: ID, eventInput: EventInput): Boolean!
        deleteEvent(id: ID!): Boolean
    }

    type Subscription {
        eventCreated: Event
        eventUpdated: Event
        eventDeleted: ID
    }

`;

export default eventSchema;