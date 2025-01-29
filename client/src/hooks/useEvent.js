'use client'

import { useState, useEffect } from 'react'
import { useQuery } from '@apollo/client'
import { GET_EVENT } from '@/graphql/queries'

const useEvent = (id) => {
    const [event, setEvent] = useState([])
    const [loading, setLoading] = useState(true)
    const { data, error, loading: queryLoading } = useQuery(GET_EVENT, {
        variables: { getEventId: id }
    })
    useEffect(() => {
        if (error) {
            console.error(error)
        }
        if (data && data.getEvent) {
            setEvent(data.getEvent)
        }
        setLoading(queryLoading)
    }, [data, queryLoading, error])

    return { event, loading, error }
}

export default useEvent 