import Event from '../../models/Event.model.js';
import authMiddleware from '../../utils/authMiddleware.js';
import { PubSub } from 'graphql-subscriptions';

const pubsub = new PubSub();

const addEvent = async (_, { eventInput }, context) => {
    const { eventType, eventDate, description, state, repeat, location } = eventInput;
    const user = authMiddleware(context);
    const parsedDate = new Date(eventDate);

    if (isNaN(parsedDate.getTime())) {
        throw new Error("Invalid eventDate value");
    }

    const newEvent = new Event({
        eventType,
        eventDate: parsedDate.toISOString(),
        description,
        state,
        repeat,
        userId: user.id,
        location
    });

    const event = new Event(newEvent);
    await event.save();
    pubsub.publish('EVENT_CREATED', { eventCreated: event }) 
    return event;
};



const deleteEvent = async (_, { id }, context) => {
    authMiddleware(context)
    const deletedEvent = await Event.findByIdAndDelete(id);
    if (!deletedEvent) {
        throw new Error("Event not found");
    }
    pubsub.publish('EVENT_DELETED', { eventDeleted: id });
    return true
}

const editEvent = async (_, { id, eventInput }, context) => {
    const user = authMiddleware(context);

    const { eventType, eventDate, description, state, repeat, location } = eventInput;

    const parsedDate = new Date(eventDate);
    if (isNaN(parsedDate.getTime())) {
        throw new Error("Invalid eventDate value");
    }

    const updatedFields = {
        eventType,
        eventDate: parsedDate.toISOString(),
        description,
        state,
        repeat,
        userId: user.id,
        location
    };

    const updatedEvent = await Event.findByIdAndUpdate(id, updatedFields, { new: true });

    if (!updatedEvent) {
        throw new Error("Event not found");
    }

    pubsub.publish('EVENT_UPDATED', { eventUpdated: updatedEvent });

    return true
}


const eventResolvers = {
    Query: {
        getEvent: async (_, { id }) => {
            try {
                const event = await Event.findById(id)
                if (!event) {
                    throw new Error('Event not found')
                }
                return event
            } catch (error) {
                throw new Error('Error getting event')
            }
        },

        getEvents: async (_, { amount }, context) => {
            try {
                const user = authMiddleware(context)
                const events = await Event.find({ userId: user.id }).sort({ createdAt: -1 })
                return events
            } catch (error) {
                throw new Error('Error getting events')
            }
        }
    },
    Mutation: {
        addEvent,
        deleteEvent,
        editEvent
    },
    Subscription: {
        eventCreated: {
            subscribe: () => pubsub.asyncIterableIterator('EVENT_CREATED')
        },
        eventUpdated: {
            subscribe: () => pubsub.asyncIterableIterator('EVENT_UPDATED'),
        },
        eventDeleted: {
            subscribe: () => pubsub.asyncIterableIterator('EVENT_DELETED'),
        },
    }
}

export default eventResolvers;