'use client'

import React, { useState } from "react";
import { ADD_EVENT } from "../graphql/queries";
import { useMutation } from "@apollo/client";

const NewEvent = ({isOpen, onClose}) => {
    const [eventInput, setEventInput] = useState({
        eventType: '',
        eventDate: '',
        description: '',
        state: '',
        repeat: '',
        location: '',
    })


    const [addEvent] = useMutation(ADD_EVENT);

        if (!isOpen) return null;



    const handleChange = (event) => {
        const { name, value } = event.target;
        
        setEventInput((prevInput) => ({ ...prevInput, [name]: value }));
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Please login first');
            }
            await addEvent({
                variables: { eventInput },
                context: {
                    headers: {
                        Authorization: `Bearer ${token}`, 
                    },
                },
            });
            alert('event added successfully')
            onClose()

            setEventInput({
                eventType: '',
                eventDate: '',
                description: '',
                state: '',
                repeat: '',
                location: '',
            })
        } catch (error) {
            console.error(error)
            alert('failed to add event')
        }
    }
    return (
            <div 
                className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center w-full h-full bg-opacity-50 bg-black"
            >
                <div className="relative w-full max-w-lg p-6 bg-white rounded-lg shadow-lg">
                    <div className="flex items-center justify-between pb-4 border-b border-gray-300">
                        <h3 className="text-xl font-semibold text-gray-900">Create New Event</h3>
                        <button
                            onClick={onClose}
                            type="button"
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 14 14"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M1 1l6 6m0 0l6 6M7 7l6-6M7 7l-6 6"
                                />
                            </svg>
                        </button>
                    </div>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label htmlFor="eventType" className="block text-sm font-medium text-gray-700">Event Type</label>
                                <select
                                    id="eventType"
                                    name="eventType"
                                    value={eventInput.eventType}
                                    onChange={handleChange}
                                    className="mt-1 block w-full p-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">Select Event Type</option>
                                    <option value="STI_TEST">STI Test</option>
                                    <option value="CONTRACEPTIVE_REFILL">Contraceptive Refill</option>
                                    <option value="COUNSELING_SESSION">Counseling Session</option>
                                    <option value="WORKSHOP">Workshop</option>
                                    <option value="OTHER">Other</option>
                                </select>
                            </div>
                            <div className="col-span-2 sm:col-span-1">
                                <label htmlFor="eventDate" className="block text-sm font-medium text-gray-700">Event Date</label>
                                <input
                                    type="datetime-local"
                                    id="eventDate"
                                    name="eventDate"
                                    value={eventInput.eventDate}
                                    onChange={handleChange}
                                    className="mt-1 block w-full p-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div className="col-span-2 sm:col-span-1">
                                <label htmlFor="state" className="block text-sm font-medium text-gray-700">State</label>
                                <select
                                    id="state"
                                    name="state"
                                    value={eventInput.state}
                                    onChange={handleChange}
                                    className="mt-1 block w-full p-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">Select State</option>
                                    <option value="COMPLETED">Completed</option>
                                    <option value="PENDING">Pending</option>
                                    <option value="POSTPONE">Postpone</option>
                                </select>
                            </div>
                            <div className="col-span-2 sm:col-span-1">
                                <label htmlFor="repeat" className="block text-sm font-medium text-gray-700">Repeat</label>
                                <select
                                    id="repeat"
                                    name="repeat"
                                    value={eventInput.repeat}
                                    onChange={handleChange}
                                    className="mt-1 block w-full p-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">Select Repeat Option</option>
                                    <option value="DAILY">Daily</option>
                                    <option value="WEEKLY">Weekly</option>
                                    <option value="MONTHLY">Monthly</option>
                                    <option value="NEVER">Never</option>
                                </select>
                            </div>
                            <div className="col-span-2 sm:col-span-1">
                                <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                                <input
                                    type="text"
                                    id="location"
                                    name="location"
                                    value={eventInput.location}
                                    onChange={handleChange}
                                    className="mt-1 block w-full p-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div className="col-span-2">
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={eventInput.description}
                                    onChange={handleChange}
                                    rows={4}
                                    className="mt-1 block w-full p-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Write event description here"
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="w-full mt-4 bg-blue-700 hover:bg-blue-800 text-white font-medium py-2.5 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-300"
                        >
                            Add New Event
                        </button>
                    </form>
                </div>
            </div>
        );
    }
export default NewEvent;    