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
        repeatTime: '',
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
            await addEvent({variables: {eventInput}})
            alert('event added successfully')

            setEventInput({
                eventType: '',
                eventDate: '',
                description: '',
                state: '',
                repeat: '',
                repeatTime: '',
                location: '',
            })
        } catch (error) {
            console.error(error)
            alert('failed to add event')
        }
    }
    return (
        <div
        style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        }}      
        >
            <div
            style={{
                background: "white",
                height: 300,
                width: 300,
                margin: "auto",
                padding: "2%",
                border: "2px solid #000",
                borderRadius: "10px",
                boxShadow: "2px solid black",
            }}
            >
                <button onClick={onClose}>Close</button>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="eventType">Event Type</label>
                        <select
                        id="eventType"
                        name="eventType"
                        value={eventInput.eventType}
                        onChange={handleChange}
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
                        <label htmlFor="eventDate">Event Date</label>
                        <input
                        type="datetime-local"
                        id="eventDate"
                        name="eventDate"
                        value={eventInput.eventDate}
                        onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label htmlFor="description">Description</label>
                        <textarea
                        id="description"
                        name="description"
                        value={eventInput.description}
                        onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label htmlFor="state">State</label>
                        <select
                        id="state"
                        name="state"
                        value={eventInput.state}
                        onChange={handleChange}
                        >
                        <option value="">Select State</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="PENDING">Pending</option>
                        <option value="POSTPONE">Postpone</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="repeat">Repeat</label>
                        <select
                        id="repeat"
                        name="repeat"
                        value={eventInput.repeat}
                        onChange={handleChange}
                        >
                        <option value="">Select Repeat Option</option>
                        <option value="DAILY">Daily</option>
                        <option value="WEEKLY">Weekly</option>
                        <option value="MONTHLY">Monthly</option>
                        <option value="NEVER">Never</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="repeatTime">Repeat Time</label>
                        <input
                        type="time"
                        id="repeatTime"
                        name="repeatTime"
                        value={eventInput.repeatTime}
                        onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label htmlFor="location">Location</label>
                        <input
                        type="text"
                        id="location"
                        name="location"
                        value={eventInput.location}
                        onChange={handleChange}
                        />
                    </div>

                    <button type="submit">Submit Event</button>
                    </form>
            </div>
        </div>
    )
}

export default NewEvent
