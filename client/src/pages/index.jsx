'use client'

import React from "react";
import Link from "next/link";
export default function Dashboard() {
    return (
        <div className="index">
            <h1>Homepage</h1>
            <Link href="/login">
                login
            </Link>
        </div>
    )
}
