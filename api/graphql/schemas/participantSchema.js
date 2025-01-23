import { gql } from 'graphql-tag';
const participantSchema = gql `

    enum ContractStatus {
        PENDING
        SIGNED
        REJECTED
        ACCEPTED
    }

    type Signature {
        userId: ID!
        dateSigned: String!
    }

    type Participant {
        id: ID!
        userId: ID!
        contract: Contract
        status: ContractStatus!
        username: String
    }


    type Contract {
        id: ID!
        proposer: User!
        participants: [Participant!]!
        proposerSignature: Signature
        status: ContractStatus!
        createdAt: String!
        updatedAt: String!
    }

    input TimePeriodInput {
        startTime: String!
        durationHours: Int!
    }


    input ContractInput {
        participants: [ID!]!
        timePeriod: TimePeriodInput
        activities: [String!]!
        contraception: String
        ratchetClause: String
        accidentalViolation: String
        failureToPerform: String
        earlyTermination: String
    }

    input SignContractInput {
        signature: String!
        dateSigned: String!
    }

    type Mutation {
        createParticipant(userId: ID!, contractId: ID!): Participant!
        removeParticipant(contractId: ID!, participantId: ID!): Boolean!
        signContract(contractId: ID!, participantId: ID!, signature: SignContractInput!): Contract!
        rejectContract(contractId: ID!, participantId: ID!): Boolean!
        acceptContract(contractId: ID!, participantId: ID!): Boolean!
    }

    type Query {
        getContract(id: ID!): Contract!
        getParticipants(contractId: ID!): [Participant!]!
    }
`;

export default participantSchema