import Event from '../../models/Event.model.js';
import authMiddleware from '../../utils/authMiddleware.js';
import pubsub from '../../utils/pubsub.js';
import  SUBSCRIPTION_EVENTS  from '../subscriptions/constants.js';

const addEvent = async (_, { eventInput }, context) => {
    const { eventType, eventDate, description, state, repeat, repeatTime } = eventInput;

    const user = authMiddleware(context);
    console.log('user:', user)
    console.log('event date:', eventDate)
    const parsedDate = new Date(eventDate);
    console.log('parser date:', parsedDate)
    if (isNaN(parsedDate.getTime())) {
        throw new Error("Invalid eventDate value");
    }

    const [hours, minutes] = repeatTime.split(":").map((v) => parseInt(v, 10));
    if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
        throw new Error("Invalid repeatTime value");
    }

    parsedDate.setHours(hours);
    parsedDate.setMinutes(minutes);
    parsedDate.setSeconds(0);

    const newEvent = new Event({
        eventType,
        eventDate: parsedDate.toISOString(),
        description,
        state,
        repeat,
        repeatTime,
        userId: user.id,
    });

    const event = new Event(newEvent);
    await event.save();

    pubsub.publish(SUBSCRIPTION_EVENTS.EVENT_CREATED, { eventCreated: event })
    return event;
};



const deleteEvent = async (_, { id }, context) => {
    authMiddleware(context)
    const deletedEvent = await Event.findByIdAndDelete(id);
    if (!deletedEvent) {
        throw new Error("Event not found");
    }
    pubsub.publish(SUBSCRIPTION_EVENTS.EVENT_DELETED, { eventDeleted: id });
    return true
}

const editEvent = async (_, { id, eventInput }, context) => {
    const user = authMiddleware(context);

    const { eventType, eventDate, description, state, repeat, repeatTime } = eventInput;

    const parsedDate = new Date(Number(eventDate));
    if (isNaN(parsedDate.getTime())) {
        throw new Error("Invalid eventDate value");
    }

    const [hours, minutes] = repeatTime.split(":").map((v) => parseInt(v, 10));
    if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
        throw new Error("Invalid repeatTime value");
    }

    parsedDate.setHours(hours);
    parsedDate.setMinutes(minutes);
    parsedDate.setSeconds(0);

    const updatedFields = {
        eventType,
        eventDate: parsedDate.toISOString(),
        description,
        state,
        repeat,
        repeatTime,
        userId: user.id,
    };

    const updatedEvent = await Event.findByIdAndUpdate(id, updatedFields, { new: true });

    if (!updatedEvent) {
        throw new Error("Event not found");
    }

    pubsub.publish(SUBSCRIPTION_EVENTS.EVENT_UPDATED, { eventUpdated: updatedEvent });

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

        getEvents: async (_, { amount }) => {
            try {
                return await Event.find().sort({createdAt: -1})
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
            subscribe: () => pubsub.asyncIterator(SUBSCRIPTION_EVENTS.EVENT_CREATED),
        },
        eventUpdated: {
            subscribe: () => pubsub.asyncIterator(SUBSCRIPTION_EVENTS.EVENT_UPDATED),
        },
        eventDeleted: {
            subscribe: () => pubsub.asyncIterator(SUBSCRIPTION_EVENTS.EVENT_DELETED),
        },
    }
}

export default eventResolvers;