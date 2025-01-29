'use client';

import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function LandingPage() {
  const [fade, setFade] = useState(false);

  useEffect(() => {
    setFade(true);
  }, []);

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen text-center p-6 bg-gradient-to-r from-white via-pink-400 to-yellow-500 animate-gradient-background`}
    >
      <h1 className={`text-6xl font-bold text-gray-900 ${fade ? 'animate-fadeIn' : ''}`}>
        Carely
      </h1>
      <p className={`text-lg text-gray-700 mt-2 ${fade ? 'animate-fadeInDelay' : ''}`}>
        Your journey starts here. Sign in to explore more.
      </p>
      <Link
        href="/login"
        className="mt-6 px-6 py-3 bg-blue-600 text-white text-lg rounded-lg shadow-md hover:bg-blue-700 transition transform hover:scale-105 hover:shadow-lg"
      >
        Login
      </Link>
    </div>
  );
}
