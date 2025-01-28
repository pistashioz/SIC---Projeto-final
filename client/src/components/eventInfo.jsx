import { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import {  UPDATE_EVENT, DELETE_EVENT } from "@/graphql/queries";
import useEvent from "@/hooks/useEvent";

const Sidebar = ({ isOpen, closeSidebar, id , token}) => {
    const { event, loading, error } = useEvent(id);

    const [editEvent] = useMutation(UPDATE_EVENT); 
    const [deleteEvent] = useMutation(DELETE_EVENT);
    const [formData, setFormData] = useState({
        eventType: "",
        eventDate: "",
        description: "",
        state: "",
        repeat: "",
        location: ""
    });

    useEffect(() => {
        if (event) {
            setFormData({
                eventType: event.eventType || "",
                eventDate: event.eventDate || "",
                description: event.description || "",
                state: event.state || "",
                repeat: event.repeat || "",
                location: event.location || ""
            });
        }
    }, [event]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleDelete = async () => {
        try {
            const response = await deleteEvent({
                variables: {
                    deleteEventId: id
                },
                context: {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            })
            closeSidebar();
        }
        catch (err) {
            console.error("Error deleting event:", err);
        }
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await editEvent({
                variables: {
                    editEventId: id,
                    eventInput: formData
                },
                context: {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            });
            closeSidebar();
        } catch (err) {
            console.error("Error updating event:", err);
            alert("Failed to update event.");
        }
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div
            className={`fixed top-0 right-0 w-1/4 h-full bg-white text-gray-900 transition-transform ${
                isOpen ? "translate-x-0" : "translate-x-full"
            }`}
        >
            <div className="flex justify-end p-4">
                <button onClick={closeSidebar} className="text-2xl">
                    &times;
                </button>
            </div>
            <form className="p-4 space-y-4" onSubmit={handleSubmit}>
                <h2 className="text-2xl">Event</h2>
                <div>
                    <label htmlFor="eventType" className="block text-sm font-medium text-gray-700">
                        Event Type
                    </label>
                    <select
                        id="eventType"
                        name="eventType"
                        value={formData.eventType}
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
                <div>
                    <label htmlFor="eventDate" className="block text-sm font-medium text-gray-700">
                        Event Date
                    </label>
                    <input
                        type="datetime-local"
                        id="eventDate"
                        name="eventDate"
                        value={formData.eventDate}
                        onChange={handleChange}
                        className="mt-1 block w-full p-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Description
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={4}
                        className="mt-1 block w-full p-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Write event description here"
                    />
                </div>
                <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                        State
                    </label>
                    <select
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        className="mt-1 block w-full p-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">Select State</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="PENDING">Pending</option>
                        <option value="POSTPONE">Postpone</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                        Location
                    </label>
                    <input
                        type="text"
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="mt-1 block w-full p-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full mt-4 bg-blue-700 hover:bg-blue-800 text-white font-medium py-2.5 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-300"
                >
                    Save Changes
                </button>
            </form>
            <button onClick={handleDelete}
                    className="w-full mt-4 bg-black hover:bg-black-800 text-white font-medium py-2.5 rounded-lg focus:outline-none focus:ring-4 focus:ring-black-300"
                >
                    Delete Event
                </button>
        </div>
    );
};

export default Sidebar;
