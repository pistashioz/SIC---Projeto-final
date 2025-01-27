'use client'

import React from 'react';
import { format } from 'date-fns';


export default function weekView({ weekDates, eventsByDay })  {

  const eventTypeStyles = {
    STI_TEST: { bg: 'bg-red-50', border: 'border-red-600', text: 'text-red-600' },
    CONTRACEPTIVE_REFILL: { bg: 'bg-blue-50', border: 'border-blue-600', text: 'text-blue-600' },
    COUNSELING_SESSION: { bg: 'bg-green-50', border: 'border-green-600', text: 'text-green-600' },
    WORKSHOP: { bg: 'bg-purple-50', border: 'border-purple-600', text: 'text-purple-600' },
    OTHER: { bg: 'bg-gray-50', border: 'border-gray-600', text: 'text-gray-600' },
  };

    const renderEvent = (event) => (
        <div key={event.id} className={`rounded p-1.5 ${eventTypeStyles[event.eventType]?.bg || 'bg-yellow-50'} ${eventTypeStyles[event.eventType]?.border || 'border-yellow-600'} border-l-2 mb-2`}>
          <p className="text-xs font-normal text-gray-900 mb-px">
            {event.eventType}
          </p>
          <p className={`text-xs font-semibold ${eventTypeStyles[event.eventType]?.text || 'text-yellow-600'}`}>
            {format(new Date(Number(event.eventDate)), 'HH:mm')}
          </p>
      </div>
    );

    const renderDay = (date) => {
        const dayKey = format(date, 'MM/dd/yyyy');
        const eventsForDay = eventsByDay[dayKey] || [];
        return (
            <div key={dayKey} style={{ margin: '10px', width: '190px' }}>
                <div className='p-3.5 flex items-center justify-center text-sm font-medium  text-gray-900'>{format(date, 'EEEE, MMMM d')}</div>
                {eventsForDay.length > 0 ? (
                    eventsForDay.map(event => renderEvent(event))
                ) : (
                    <p className='flex items-center justify-center text-sm font-small  text-gray-400'>No events for this day</p>
                )}
            </div>
        );
    }
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {weekDates.map(date => renderDay(date))}
      </div>
  );
}
