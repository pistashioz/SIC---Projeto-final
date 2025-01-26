import React from "react";

const Events = ({events}) => {
    if (!events || events.length === 0) {
        return <div>No events found. Create One!</div>;
    }

    return (
        <ul>
            {events.map((event, index) => (
                <li key={index}>
                    <h3>{event.eventType} - {event.state}</h3>
                    <p>Date: {new Date(parseInt(event.eventDate, 10)).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    <p>Description: {event.description}</p>
                    <p>Location: {event.location}</p>
                    <p>Repeat: {event.repeat}</p>
                </li>
            ))}
        </ul>
    )
}

export default Events