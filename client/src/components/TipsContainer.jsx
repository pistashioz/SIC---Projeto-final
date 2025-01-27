'use client'

import React from "react";
import { useQuery } from "@apollo/client";
import { GET_TIPS } from "../graphql/queries";

function TipsContainer() {
    const { loading, error, data } = useQuery(GET_TIPS, {
        variables: { amount: 10 }
    })

    if (loading) {
        return <p>loading tips</p>
    }
    if (error) {
        return <p>error fetching tips</p>
    }

    if (!data || !data.getTips || data.getTips.length === 0) {
        return <p>No tips found.</p>;
      }
    

    return (
        <div>
            <h1>tips</h1>
            {data.getTips.map((tip) => (
                
                <div key={tip.id}>
                    <h2>{tip.title}</h2>
                    <p><strong>Info:</strong> {tip.info}</p>
                    <p><strong>Author:</strong> {tip.author}</p>
                    <p><strong>Description:</strong> {tip.description}</p>
                    <p>
                        <small>
                            Created At: {new Date(parseInt(tip.createdAt, 10)).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </small>
                    </p>

                </div>
            ))}
        </div>
    )
}

export default TipsContainer