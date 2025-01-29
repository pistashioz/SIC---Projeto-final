'use client';

import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useSubscription} from "@apollo/client";
import { GET_TIPS, ADD_FAVORITE_TIP, GET_FAVORITE_TIPS, REMOVE_FAVORITE_TIP, ADD_FAVORITE_TIP_SUBSCRIPTION, REMOVE_FAVORITE_TIP_SUBSCRIPTION} from "../graphql/queries";
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
    const { data: favData, refetch } = useQuery(GET_FAVORITE_TIPS, {
        variables: { userId: user.id },
        context: {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
    });   

    useSubscription(ADD_FAVORITE_TIP_SUBSCRIPTION, {
        variables: { userId: user.id },
        onData: ({data}) => {
            console.log('data add favorite tip:', data);
            refetch()
        }
    })

    useSubscription(REMOVE_FAVORITE_TIP_SUBSCRIPTION, {
        variables: { userId: user.id },
        onData: ({data}) => {
            console.log('data remove favorite tip:', data);
            refetch()
        }
    })

    const likeFavorite = async (tipId, event) => {
        event.preventDefault();
        if (!token) {
            alert('Please login first');
            return;
        }
        try {
            await addFavoriteTip({
                variables: { input: { userId: user.id, tipId: tipId } },
                context: { headers: { Authorization: `Bearer ${token}` } }
            });
            console.log('liked tip:', tipId);
        } catch (error) {
            console.error("Error adding favorite:", error);
        }
    };
    
    const dislikeFavorite = async (tipId, event) => {
        event.preventDefault();
        try {
            await removeFavoriteTip({
                variables: { tipId: tipId },
                context: { headers: { Authorization: `Bearer ${token}` } }
            });
        } catch (error) {
            console.error("Error removing favorite:", error);
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
    ? data.getTips.filter((tip) =>
        favData?.getFavoriteTips?.some(fav => fav.tipId === tip.id)
      )
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
                        <div className="flex gap-2">
                        <button onClick={(event) => dislikeFavorite(tip.id, event)} className="p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors duration-200">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M7.498 15.25H4.372c-1.026 0-1.945-.694-2.054-1.715a12.137 12.137 0 0 1-.068-1.285c0-2.848.992-5.464 2.649-7.521C5.287 4.247 5.886 4 6.504 4h4.016a4.5 4.5 0 0 1 1.423.23l3.114 1.04a4.5 4.5 0 0 0 1.423.23h1.294M7.498 15.25c.618 0 .991.724.725 1.282A7.471 7.471 0 0 0 7.5 19.75 2.25 2.25 0 0 0 9.75 22a.75.75 0 0 0 .75-.75v-.633c0-.573.11-1.14.322-1.672.304-.76.93-1.33 1.653-1.715a9.04 9.04 0 0 0 2.86-2.4c.498-.634 1.226-1.08 2.032-1.08h.384m-10.253 1.5H9.7m8.075-9.75c.01.05.027.1.05.148.593 1.2.925 2.55.925 3.977 0 1.487-.36 2.89-.999 4.125m.023-8.25c-.076-.365.183-.75.575-.75h.908c.889 0 1.713.518 1.972 1.368.339 1.11.521 2.287.521 3.507 0 1.553-.295 3.036-.831 4.398-.306.774-1.086 1.227-1.918 1.227h-1.053c-.472 0-.745-.556-.5-.96a8.95 8.95 0 0 0 .303-.54" />
                            </svg>
                        </button>
                        
                        <button onClick={(event) => likeFavorite(tip.id, event)} className="p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors duration-200">
                            <svg xmlns="http://www.w3.org/2000/svg"  fill={favData?.getFavoriteTips?.some(fav => fav.tipId === tip.id) ? "blue" : "none"} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z" />
                            </svg>
                        </button>
                        </div>
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
