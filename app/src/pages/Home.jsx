import React from "react";
import useUserInfo from "../hooks/useUserInfo";
import Events from '../components/Events'
const Home = () => {
    const token = localStorage.getItem('token')
    const { user } = useUserInfo(token)
    return (
        <div>
            <h1>Welcome {user.username}</h1>
            <h3>Upcoming Events</h3>
            <Events events={user.events}/>
        </div>
    )
}
export default Home