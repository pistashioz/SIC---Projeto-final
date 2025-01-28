'use client'

import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import SidebarModal from './eventInfo';
import { useSubscription } from '@apollo/client';
import { EVENT_DELETED_SUBSCRIPTION } from '../graphql/subscriptions';

export default function WeekView({ weekDates, eventsByDay, token }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [eventsByDayState, setEventsByDayState] = useState(eventsByDay);

  // Subscription to listen to deleted events
  const { data: subscriptionData, loading: subscriptionLoading } = useSubscription(EVENT_DELETED_SUBSCRIPTION);

  // Effect to update the events when an event is deleted
  useEffect(() => {
    if (subscriptionData && subscriptionData.eventDeleted) {
      const deletedEventId = subscriptionData.eventDeleted;
      setEventsByDayState(prevEventsByDay => {
        // Create a copy of eventsByDay
        const updatedEventsByDay = { ...prevEventsByDay };
        
        // Loop through all days and remove the deleted event
        Object.keys(updatedEventsByDay).forEach(dayKey => {
          updatedEventsByDay[dayKey] = updatedEventsByDay[dayKey].filter(event => event.id !== deletedEventId);
        });

        return updatedEventsByDay;
      });
    }
  }, [subscriptionData]);

  const openSidebar = (eventId) => {
    setSelectedEventId(eventId);
    setIsSidebarOpen(true);
  };
  
  const closeSidebar = () => {
    setIsSidebarOpen(false);
    setSelectedEventId(null); 
  };

  const eventTypeStyles = {
    STI_TEST: { bg: 'bg-red-50', border: 'border-red-600', text: 'text-red-600' },
    CONTRACEPTIVE_REFILL: { bg: 'bg-blue-50', border: 'border-blue-600', text: 'text-blue-600' },
    COUNSELING_SESSION: { bg: 'bg-green-50', border: 'border-green-600', text: 'text-green-600' },
    WORKSHOP: { bg: 'bg-purple-50', border: 'border-purple-600', text: 'text-purple-600' },
    OTHER: { bg: 'bg-gray-50', border: 'border-gray-600', text: 'text-gray-600' },
  };

  const renderEvent = (event) => (
    <div onClick={() => openSidebar(event.id)} key={event.id} className={`rounded p-1.5 ${eventTypeStyles[event.eventType]?.bg || 'bg-yellow-50'} ${eventTypeStyles[event.eventType]?.border || 'border-yellow-600'} border-l-2 mb-2`}>
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
    const eventsForDay = eventsByDayState[dayKey] || [];

    const sortedEvents = eventsForDay.sort((a, b) => new Date(Number(a.eventDate)) - new Date(Number(b.eventDate)));

    return (
      <div key={dayKey} style={{ margin: '10px', width: '190px' }}>
        <div className='p-3.5 flex items-center justify-center text-sm font-medium text-gray-900'>{format(date, 'EEEE, MMMM d')}</div>
        {sortedEvents.length > 0 ? (
          sortedEvents.map(event => renderEvent(event))
        ) : (
          <p className='flex items-center justify-center text-sm font-small text-gray-400'>No events for this day</p>
        )}
      </div>
    );
  };

  if (subscriptionLoading) return <p>Loading...</p>;

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      {weekDates.map(date => renderDay(date))}
      <SidebarModal id={selectedEventId} isOpen={isSidebarOpen} closeSidebar={closeSidebar} token={token} />
    </div>
  );
}
