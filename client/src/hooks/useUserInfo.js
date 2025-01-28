'use client'

import { useState, useEffect } from 'react' 
import { useQuery } from '@apollo/client'
import { GET_AUTHENTICATED_USER } from '../graphql/queries'

const useUserInfo = (token) => {
        const [user, setUser] = useState([])
        const [loading, setLoading] = useState(true)
        const { data, error, loading: queryLoading } = useQuery(GET_AUTHENTICATED_USER, {
            skip: !token,
            variables: { token },
            context: {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        })
        useEffect(() => {
            if (error) {
                console.error(error)
            }
            if (data && data.getUserDetails) {
                setUser(data.getUserDetails)
            }
            else {
                setUser([])
            }
            setLoading(queryLoading)
        }, [data, queryLoading, error])

        return { user, loading, error }
}
export default useUserInfo
