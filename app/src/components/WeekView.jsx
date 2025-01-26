import React from 'react';
import { format } from 'date-fns';

const WeekView = ({ weekDates, eventsByDay }) => {
    const renderEvent = (event) => (
        <div key={event.id} style={{ marginBottom: '10px' }}>
            <h4>{format(new Date(Number(event.eventDate)), 'HH:mm')}</h4>
            <p>{event.eventType} - {event.state}</p>
            <p>{event.description}</p>
            <p>Location: {event.location}</p>
        </div>
    );

    const renderDay = (date) => {
        const dayKey = format(date, 'MM/dd/yyyy');
        const eventsForDay = eventsByDay[dayKey] || [];
        return (
            <div key={dayKey} style={{ margin: '10px', width: '200px' }}>
                <h3>{format(date, 'EEEE, MMMM d')}</h3>
                {eventsForDay.length > 0 ? (
                    eventsForDay.map(event => renderEvent(event))
                ) : (
                    <p>No events for this day. Add one!</p>
                )}
            </div>
        );
    };

    return (
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {weekDates.map(date => renderDay(date))}
        </div>
    );
};

export default WeekView;
