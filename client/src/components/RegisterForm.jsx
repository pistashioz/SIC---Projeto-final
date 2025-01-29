'use client'

import React, { useState } from "react";
import { CREATE_ACCOUNT } from "@/graphql/queries";
import { useMutation } from "@apollo/client";
import { useRouter } from "next/router";

export default function RegisterForm() {
    const router = useRouter();
    const [signUpInput, setSignUpInput] = useState({
        email: '',
        username: '',
        password: '',
        name: '',
    });

    const [createAccount] = useMutation(CREATE_ACCOUNT, {
        onCompleted: () => router.push('/login')

    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSignUpInput((prevInput) => ({ ...prevInput, [name]: value }));
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        createAccount({ variables: { signUpInput } });
    };

    const handleClick = (e) => {
        e.preventDefault();
        router.push('/login');
    };

    return (
        <section className="bg-white min-h-screen flex items-center justify-center p-6">
            <div className="w-full max-w-md bg-gray-100 shadow-lg rounded-xl p-8">
                <h1 className="text-2xl font-semibold text-gray-800 text-center">Create an account</h1>
                <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Your name</label>
                        <input type="text" id="name" name="name" value={signUpInput.name} onChange={handleChange}
                            className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="John Doe" required />
                    </div>
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">Your username</label>
                        <input type="text" id="username" name="username" value={signUpInput.username} onChange={handleChange}
                            className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="johndoe" required />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Your email</label>
                        <input type="email" id="email" name="email" value={signUpInput.email} onChange={handleChange}
                            className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="example@gmail.com" required />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input type="password" id="password" name="password" value={signUpInput.password} onChange={handleChange}
                            className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="••••••••" required />
                    </div>
                    <div className="flex items-center">
                        <input type="checkbox" id="terms" name="terms" className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" required />
                        <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                            I accept the <a href="#" className="text-blue-500 hover:underline">Terms and Conditions</a>
                        </label>
                    </div>
                    <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-all">
                        Create an account
                    </button>
                    <p className="text-center text-sm text-gray-600">Already have an account? <button onClick={handleClick} className="text-blue-500 hover:underline">Login here</button></p>
                </form>
            </div>
        </section>
    );
}
