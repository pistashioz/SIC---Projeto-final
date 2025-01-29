'use client'

import React from "react";
import { useMutation } from "@apollo/client";
import { LOGIN_USER } from "@/graphql/queries";
import { useRouter } from 'next/router'

const LoginForm = () => {
    const router = useRouter()
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [login, {loading, error}] = useMutation(LOGIN_USER, {
        onCompleted: (data) => {
            localStorage.setItem('token', data.login.token)
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
    const handleClick = (e) => {
        e.preventDefault()
        router.push('/register')
      }
     

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-50 to-white">
            <section className="w-full sm:max-w-md bg-white rounded-xl shadow-lg p-8">
                <h1 className="text-2xl font-semibold text-center text-primary-700 mb-8">
                    Sign in to your account
                </h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-primary-700">
                            Your username
                        </label>
                        <input
                            name="username"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                            placeholder="name@company.com"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-primary-700">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <div className="flex justify-between items-center">
                        <div className="flex items-center">
                            <input
                                id="remember"
                                type="checkbox"
                                className="w-4 h-4 border-gray-300 rounded focus:ring-primary-500"
                                required
                            />
                            <label htmlFor="remember" className="ml-2 text-sm text-primary-600">
                                Remember me
                            </label>
                        </div>
                        <a href="#" className="text-sm font-medium text-primary-600 hover:underline">
                            Forgot password?
                        </a>
                    </div>
                    <button
                        type="submit" 
                        disabled={loading}
                        className="w-full py-3 bg-blue-600 hover:bg-primary-700 focus:outline-none text-white font-medium rounded-lg focus:ring-4 focus:ring-primary-500"
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                    <p className="text-sm font-light text-center text-gray-500">
                        Don’t have an account yet? 
                        <a onClick={handleClick} className="font-medium text-primary-600 hover:underline">
                            Sign up
                        </a>
                    </p>
                </form>
            </section>
        </div>
    )
}

export default LoginForm
