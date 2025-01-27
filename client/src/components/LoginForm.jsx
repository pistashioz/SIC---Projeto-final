'use client'

import React from "react";
import { useMutation } from "@apollo/client";
import { LOGIN_USER } from "../graphql/queries";
import { useRouter } from 'next/router'
const LoginForm = () => {
    const router = useRouter()
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [login, {loading, error}] = useMutation(LOGIN_USER, {
        onCompleted: (data) => {
            localStorage.setItem('token', data.login.token)
            alert('logged in successfully')
            router.push('/events')
        }
    })

    const handleSubmit = (e) => {
        e.preventDefault();
        login({
            variables: {
                username,
                password
            }
        })
    }
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username:</label>
                    <input 
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>
            {error && <p>Error: {error.message}</p>}
        </div>
    )
}

export default LoginForm
