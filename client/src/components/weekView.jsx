'use client';

import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import SidebarModal from '@/components/eventInfo';
import { EVENT_CREATED_SUBSCRIPTION } from '@/graphql/queries';
import { useSubscription } from '@apollo/client';

export default function weekView({ weekDates, eventsByDay, token }) {
  const { data: createdData } = useSubscription(EVENT_CREATED_SUBSCRIPTION);
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [localEventsByDay, setLocalEventsByDay] = useState(eventsByDay);

  useEffect(() => {
    console.log('Local Events Updated:', localEventsByDay);
  }, [localEventsByDay]);


  useEffect(() => {
    if (createdData?.eventCreated) {
      console.log('New Event:', createdData.eventCreated);
      const newEvent = createdData.eventCreated;
      const dayKey = format(new Date(Number(newEvent.eventDate)), 'MM/dd/yyyy');

      setLocalEventsByDay((prev) => {
        const updatedEvents = {
          ...prev,
          [dayKey]: [...(prev[dayKey] || []), newEvent],
        };
        console.log('Updated Events:', updatedEvents);
        return updatedEvents;
      });
    }
  }, [createdData]);

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
    <div
      onClick={() => openSidebar(event.id)}
      key={event.id}
      className={`rounded p-1.5 ${
        eventTypeStyles[event.eventType]?.bg || 'bg-yellow-50'
      } ${eventTypeStyles[event.eventType]?.border || 'border-yellow-600'} border-l-2 mb-2`}
    >
      <p className="text-xs font-normal text-gray-900 mb-px">{event.eventType}</p>
      <p
        className={`text-xs font-semibold ${
          eventTypeStyles[event.eventType]?.text || 'text-yellow-600'
        }`}
      >
        {format(new Date(Number(event.eventDate)), 'HH:mm')}
      </p>
    </div>
  );

  const renderDay = (date) => {
    const dayKey = format(date, 'MM/dd/yyyy');
    const eventsForDay = localEventsByDay[dayKey] || [];

    const sortedEvents = [...eventsForDay].sort(
      (a, b) => new Date(Number(a.eventDate)) - new Date(Number(b.eventDate))
    );

    return (
      <div key={dayKey} style={{ margin: '10px', width: '190px' }}>
        <div className="p-3.5 flex items-center justify-center text-sm font-medium  text-gray-900">
          {format(date, 'EEEE, MMMM d')}
        </div>
        {sortedEvents.length > 0 ? (
          sortedEvents.map((event) => renderEvent(event))
        ) : (
          <p className="flex items-center justify-center text-sm font-small  text-gray-400">
            No events for this day
          </p>
        )}
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      {weekDates.map((date) => renderDay(date))}
      <SidebarModal
        id={selectedEventId}
        isOpen={isSidebarOpen}
        closeSidebar={closeSidebar}
        token={token}
      />
    </div>
  );
}
