'use client'
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import useUserInfo from '@/hooks/useUserInfo';
import WeekView from '@/components/weekView';
import { addWeeks, subWeeks, startOfWeek, format } from 'date-fns';
import NewEvent from '@/components/NewEvent'

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

export default function Home() {
    const [token, setToken] = useState(null);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        setToken(storedToken);
    }, []);

    const { user } = useUserInfo(token);
    const today = new Date();
    const initialStartOfWeek = startOfWeek(today, { weekStartsOn: 1 }); 
    const [currentWeekStart, setCurrentWeekStart] = useState(initialStartOfWeek);
    const [weekDates, setWeekDates] = useState([]);
    const [eventsByDay, setEventsByDay] = useState({});
    const [open, setOpen] = useState(false)

    useEffect(() => {
        let dates = [];
        let currentDate = currentWeekStart;
        for (let i = 0; i < 7; i++) {
            dates.push(new Date(currentDate));
            currentDate = getNextDay(currentDate);
        }
        setWeekDates(dates);
    }, [currentWeekStart]);

    const handleClose = () => {
        setOpen(false);
    }

    const handleOpen = () => {
        setOpen(true)
    }

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
        console.log("User events on load:", user.events);
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
    const formatMonthYear = (date) => format(date, 'MMMM yyyy');
    return (
        <div>
            <section className="relative bg-stone-50 py-24 h-screen">
                <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 overflow-x-auto">
                    <div className="flex flex-col md:flex-row max-md:gap-3 items-center justify-between mb-5">
                        <div className="flex items-center gap-4">
                            <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={24}
                            height={24}
                            viewBox="0 0 24 24"
                            fill="none"
                            >
                            <path
                                d="M17 4.50001L17 5.15001L17 4.50001ZM6.99999 4.50002L6.99999 3.85002L6.99999 4.50002ZM8.05078 14.65C8.40977 14.65 8.70078 14.359 8.70078 14C8.70078 13.641 8.40977 13.35 8.05078 13.35V14.65ZM8.00078 13.35C7.6418 13.35 7.35078 13.641 7.35078 14C7.35078 14.359 7.6418 14.65 8.00078 14.65V13.35ZM8.05078 17.65C8.40977 17.65 8.70078 17.359 8.70078 17C8.70078 16.641 8.40977 16.35 8.05078 16.35V17.65ZM8.00078 16.35C7.6418 16.35 7.35078 16.641 7.35078 17C7.35078 17.359 7.6418 17.65 8.00078 17.65V16.35ZM12.0508 14.65C12.4098 14.65 12.7008 14.359 12.7008 14C12.7008 13.641 12.4098 13.35 12.0508 13.35V14.65ZM12.0008 13.35C11.6418 13.35 11.3508 13.641 11.3508 14C11.3508 14.359 11.6418 14.65 12.0008 14.65V13.35ZM12.0508 17.65C12.4098 17.65 12.7008 17.359 12.7008 17C12.7008 16.641 12.4098 16.35 12.0508 16.35V17.65ZM12.0008 16.35C11.6418 16.35 11.3508 16.641 11.3508 17C11.3508 17.359 11.6418 17.65 12.0008 17.65V16.35ZM16.0508 14.65C16.4098 14.65 16.7008 14.359 16.7008 14C16.7008 13.641 16.4098 13.35 16.0508 13.35V14.65ZM16.0008 13.35C15.6418 13.35 15.3508 13.641 15.3508 14C15.3508 14.359 15.6418 14.65 16.0008 14.65V13.35ZM16.0508 17.65C16.4098 17.65 16.7008 17.359 16.7008 17C16.7008 16.641 16.4098 16.35 16.0508 16.35V17.65ZM16.0008 16.35C15.6418 16.35 15.3508 16.641 15.3508 17C15.3508 17.359 15.6418 17.65 16.0008 17.65V16.35ZM8.65 3C8.65 2.64101 8.35898 2.35 8 2.35C7.64102 2.35 7.35 2.64101 7.35 3H8.65ZM7.35 6C7.35 6.35899 7.64102 6.65 8 6.65C8.35898 6.65 8.65 6.35899 8.65 6H7.35ZM16.65 3C16.65 2.64101 16.359 2.35 16 2.35C15.641 2.35 15.35 2.64101 15.35 3H16.65ZM15.35 6C15.35 6.35899 15.641 6.65 16 6.65C16.359 6.65 16.65 6.35899 16.65 6H15.35ZM6.99999 5.15002L17 5.15001L17 3.85001L6.99999 3.85002L6.99999 5.15002ZM20.35 8.50001V17H21.65V8.50001H20.35ZM17 20.35H7V21.65H17V20.35ZM3.65 17V8.50002H2.35V17H3.65ZM7 20.35C6.03882 20.35 5.38332 20.3486 4.89207 20.2826C4.41952 20.2191 4.1974 20.1066 4.04541 19.9546L3.12617 20.8739C3.55996 21.3077 4.10214 21.4881 4.71885 21.571C5.31685 21.6514 6.07557 21.65 7 21.65V20.35ZM2.35 17C2.35 17.9245 2.34862 18.6832 2.42902 19.2812C2.51193 19.8979 2.69237 20.4401 3.12617 20.8739L4.04541 19.9546C3.89341 19.8026 3.78096 19.5805 3.71743 19.108C3.65138 18.6167 3.65 17.9612 3.65 17H2.35ZM20.35 17C20.35 17.9612 20.3486 18.6167 20.2826 19.108C20.219 19.5805 20.1066 19.8026 19.9546 19.9546L20.8738 20.8739C21.3076 20.4401 21.4881 19.8979 21.571 19.2812C21.6514 18.6832 21.65 17.9245 21.65 17H20.35ZM17 21.65C17.9244 21.65 18.6831 21.6514 19.2812 21.571C19.8979 21.4881 20.44 21.3077 20.8738 20.8739L19.9546 19.9546C19.8026 20.1066 19.5805 20.2191 19.1079 20.2826C18.6167 20.3486 17.9612 20.35 17 20.35V21.65ZM17 5.15001C17.9612 5.15 18.6167 5.15138 19.1079 5.21743C19.5805 5.28096 19.8026 5.39341 19.9546 5.54541L20.8738 4.62617C20.44 4.19238 19.8979 4.01194 19.2812 3.92902C18.6831 3.84862 17.9244 3.85001 17 3.85001L17 5.15001ZM21.65 8.50001C21.65 7.57557 21.6514 6.81686 21.571 6.21885C21.4881 5.60214 21.3076 5.05996 20.8738 4.62617L19.9546 5.54541C20.1066 5.6974 20.219 5.91952 20.2826 6.39207C20.3486 6.88332 20.35 7.53882 20.35 8.50001H21.65ZM6.99999 3.85002C6.07556 3.85002 5.31685 3.84865 4.71884 3.92905C4.10214 4.01196 3.55996 4.1924 3.12617 4.62619L4.04541 5.54543C4.1974 5.39344 4.41952 5.28099 4.89207 5.21745C5.38331 5.15141 6.03881 5.15002 6.99999 5.15002L6.99999 3.85002ZM3.65 8.50002C3.65 7.53884 3.65138 6.88334 3.71743 6.39209C3.78096 5.91954 3.89341 5.69743 4.04541 5.54543L3.12617 4.62619C2.69237 5.05999 2.51193 5.60217 2.42902 6.21887C2.34862 6.81688 2.35 7.57559 2.35 8.50002H3.65ZM3 10.65H21V9.35H3V10.65ZM8.05078 13.35H8.00078V14.65H8.05078V13.35ZM8.05078 16.35H8.00078V17.65H8.05078V16.35ZM12.0508 13.35H12.0008V14.65H12.0508V13.35ZM12.0508 16.35H12.0008V17.65H12.0508V16.35ZM16.0508 13.35H16.0008V14.65H16.0508V13.35ZM16.0508 16.35H16.0008V17.65H16.0508V16.35ZM7.35 3V6H8.65V3H7.35ZM15.35 3V6H16.65V3H15.35Z"
                                fill="#111827"
                            />
                            </svg>
                            <h6 className="text-xl leading-8 font-semibold text-gray-900">
                            {formatMonthYear(today)}
                            </h6>
                        </div>
                        <div className="flex items-center gap-px rounded-lg bg-gray-100 p-1">
                            <button onClick={goToPreviousWeek} className="rounded-lg py-2.5 px-5 text-sm font-medium text-gray-500 transition-all duration-300 hover:bg-white hover:text-indigo-600">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                            </svg>
                            </button>
                            <button onClick={goToNextWeek} className="rounded-lg py-2.5 px-5 text-sm font-medium text-gray-500 transition-all duration-300 hover:bg-white hover:text-indigo-600">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                            </svg>
                            </button>
                        </div>
                        <button onClick={handleOpen} className="py-2.5 pr-7 pl-5 bg-indigo-600 rounded-xl flex items-center gap-2 text-base font-semibold text-white transition-all duration-300 hover:bg-indigo-700">
                            <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={20}
                            height={20}
                            viewBox="0 0 20 20"
                            fill="none"
                            >
                            <path
                                d="M10 5V15M15 10H5"
                                stroke="white"
                                strokeWidth="1.6"
                                strokeLinecap="round"
                            />
                            </svg>
                            New Event
                        </button>
                    </div> 
                </div>
                <WeekView weekDates={weekDates} eventsByDay={memoizedEventsByDay} token={token}/>
            </section>
            <NewEvent isOpen={open} onClose={handleClose} />
        </div>
    );
};
