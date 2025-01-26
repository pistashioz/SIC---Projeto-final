import React, { useState, useEffect, useCallback, useMemo } from 'react';
import useUserInfo from '../hooks/useUserInfo';
import WeekView from '../components/WeekView';
import { addWeeks, subWeeks, startOfWeek, format } from 'date-fns';
import NewEvent from '../components/NewEvent'
const formatDate = (date) => {
    if (date instanceof Date && !isNaN(date)) {
        const formattedDate = format(date, 'MM/dd/yyyy');
        return formattedDate;
    }
    return '';
};

const getNextDay = (currentDate) => {
    const nextDay = new Date(currentDate);
    nextDay.setDate(nextDay.getDate() + 1);
    return nextDay;
};

const Home = () => {

    const token = localStorage.getItem('token');
    const { user } = useUserInfo(token);
    const today = new Date();
    const initialStartOfWeek = startOfWeek(today, { weekStartsOn: 1 }); 

    const [currentWeekStart, setCurrentWeekStart] = useState(initialStartOfWeek);
    const [weekDates, setWeekDates] = useState([]);
    const [eventsByDay, setEventsByDay] = useState({});

    const [open, setOpen] = useState(false)

    const handleClose = () => {
        setOpen(false);
    }

    const handleOpen = () => {
        setOpen(true)
    }
    useEffect(() => {
        let dates = [];
        let currentDate = currentWeekStart;
        for (let i = 0; i < 7; i++) {
            dates.push(new Date(currentDate));
            currentDate = getNextDay(currentDate);
        }
        setWeekDates(dates);
    }, [currentWeekStart]);

    const groupEventsByDay = useCallback(() => {
        const groupedEvents = {};

        weekDates.forEach(date => {
            const formattedDate = formatDate(date);  
            groupedEvents[formattedDate] = [];  
        });

        user.events.forEach(event => {
            const eventDate = new Date(Number(event.eventDate));

            const eventDateUTC = new Date(Date.UTC(
                eventDate.getUTCFullYear(),
                eventDate.getUTCMonth(),
                eventDate.getUTCDate()
            ));

            const eventDateString = formatDate(eventDateUTC); 

            if (groupedEvents[eventDateString]) {
                groupedEvents[eventDateString].push(event);
            }
        });

        Object.keys(groupedEvents).forEach(date => {
            groupedEvents[date].sort((a, b) => new Date(Number(a.eventDate)) - new Date(Number(b.eventDate)));
        });

        setEventsByDay(groupedEvents);
    }, [weekDates, user.events]);

    useEffect(() => {
        if (user.events && weekDates.length > 0) {
            groupEventsByDay();
        }
    }, [user.events, weekDates, groupEventsByDay]);

    const goToNextWeek = useCallback(() => {
        setCurrentWeekStart(addWeeks(currentWeekStart, 1));
    }, [currentWeekStart]);

    const goToPreviousWeek = useCallback(() => {
        setCurrentWeekStart(subWeeks(currentWeekStart, 1));
    }, [currentWeekStart]);

    const memoizedEventsByDay = useMemo(() => eventsByDay, [eventsByDay]);

    return (
        <div>
            <h1>Welcome {user.username}</h1>
            <div>
                <button type="button" onClick={handleOpen}>Add Event</button>
                <NewEvent isOpen={open} onClose={handleClose} />
            </div>
            <h3>Events for this week</h3>
            <div>
                <button onClick={goToPreviousWeek}>Previous Week</button>
                <button onClick={goToNextWeek}>Next Week</button>
            </div>
            <WeekView weekDates={weekDates} eventsByDay={memoizedEventsByDay} />
        </div>
    );
};

export default Home;
