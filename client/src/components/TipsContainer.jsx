'use client';

import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_TIPS, ADD_FAVORITE_TIP, GET_FAVORITE_TIPS, REMOVE_FAVORITE_TIP } from "../graphql/queries";
import useUserInfo from "../hooks/useUserInfo";

function TipsContainer() {
    const [token, setToken] = useState(null);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        setToken(storedToken);
    }, []);
    const [showFavorites, setShowFavorites] = useState(false);
    const { user } = useUserInfo(token);
    const [input, setInput] = useState({
        userId: user.id,
        tipId: '',
    })
    
    const [addFavoriteTip] = useMutation(ADD_FAVORITE_TIP);
    const [removeFavoriteTip] = useMutation(REMOVE_FAVORITE_TIP);
    const { loading: favLoading, error: favError, data: favData } = useQuery(GET_FAVORITE_TIPS, {
        variables: { userId: user.id },
        context: {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
    });   

    const handleSubmit = async (tipId, event) => {
        event.preventDefault();
        if (!token) {
            alert('Please login first');
            return;
        }
    
        const newInput = {
            userId: user.id,
            tipId: tipId,
        };
    
        try {
            const favoriteTip = favData.getFavoriteTips.find(fav => fav.tipId === tipId);
    
            if (favoriteTip) {
                await removeFavoriteTip({
                    variables: { removeFavoriteTipId: favoriteTip.id },
                    context: {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    },
                });
            } else {
                await addFavoriteTip({
                    variables: { input: newInput },
                    context: {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    },
                });
            }
        } catch (error) {
            console.error(error);
            alert('Failed to update favorite status');
        }
    };
    const { loading, error, data } = useQuery(GET_TIPS, {
        variables: { amount: 10 }
    });

    if (loading) {
        return <p className="text-center text-gray-500">Loading tips...</p>;
    }
    if (error) {
        return <p className="text-center text-red-500">Error fetching tips</p>;
    }

    if (!data || !data.getTips || data.getTips.length === 0) {
        return <p className="text-center text-gray-500">No tips found.</p>;
    }

    const filteredTips = showFavorites
        ? data.getTips.filter((tip) => tip.isFavorite)
        : data.getTips;

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-bold">Tips</h1>
                <div className="space-x-4">
                    <button
                        className={`font-semibold text-sm ${
                            !showFavorites
                                ? "text-blue-500 underline"
                                : "text-gray-700"
                        }`}
                        onClick={() => setShowFavorites(false)}
                    >
                        All Tips
                    </button>
                    <button
                        className={`font-semibold text-sm ${
                            showFavorites
                                ? "text-blue-500 underline"
                                : "text-gray-700"
                        }`}
                        onClick={() => setShowFavorites(true)}
                    >
                        Favorite Tips
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTips.map((tip) => (
                    <div key={tip.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="relative">
                            <img
                                src={tip.image}
                                alt="Tip image"
                                className="w-full h-48 object-cover"
                            />
                            <button  onClick={(event) => handleSubmit(tip.id, event)} className="absolute top-2 right-2 p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors duration-200">
                                <svg
                                    className={`w-5 h-5 ${
                                        user.favoriteTips && user.favoriteTips.some(fav => fav.id === tip.id)  
                                            ? "text-red-500"
                                            : "text-gray-500"
                                    }`}
                                    viewBox="0 0 24 24"
                                    fill=
                                    {user.favoriteTips && user.favoriteTips.some(fav => fav.id === tip.id)
                                        ? "red"
                                        : "none"
                                    }
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M15.7 4C18.87 4 21 6.98 21 9.76C21 15.39 12.16 20 12 20C11.84 20 3 15.39 3 9.76C3 6.98 5.13 4 8.3 4C10.12 4 11.31 4.91 12 5.71C12.69 4.91 13.88 4 15.7 4Z"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </button>
                        </div>
                        <div className="p-4">
                            <h2 className="text-lg font-semibold text-gray-800 mb-2">
                                {tip.title}
                            </h2>
                            <p className="text-sm text-gray-600 mb-4">
                                {tip.description}
                            </p>
                            <div className="flex justify-between items-center text-sm text-gray-600">
                                <span>Created At: {new Date(parseInt(tip.createdAt, 10)).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                            </div>
                            <div className="mt-4">
                                <button className="text-sm underline text-blue-500 hover:text-blue-700 transition-colors duration-200">
                                    Read More
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default TipsContainer;
