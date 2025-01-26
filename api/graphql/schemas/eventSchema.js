import { gql } from 'graphql-tag';
const eventSchema = gql`

    enum StateOption {
        COMPLETED
        PENDING
        POSTPONE
    }

    enum EventType {
        STI_TEST
        CONTRACEPTIVE_REFILL
        COUNSELING_SESSION
        WORKSHOP
        OTHER  
    }

    enum RepeatOption {
        DAILY
        WEEKLY
        MONTHLY
        NEVER
    }


    type Event {
        id: ID!
        eventType: EventType!
        eventDate: String!
        description: String
        state: StateOption!
        userId: ID!
        repeat: RepeatOption!
        repeatTime: String!
        location: String
    }

    input EventInput {
        eventType: EventType!
        eventDate: String
        description: String
        state: StateOption
        repeat: RepeatOption!
        repeatTime: String!
        location: String
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
        eventCreated: Event!
        eventUpdated: Event!
        eventDeleted: ID!
    }

`;

export default eventSchema;