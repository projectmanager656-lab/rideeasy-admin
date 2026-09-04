import React, { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiClient } from '../services/http'
import { getCaptainToken } from '../utils/authTokens'
import { CaptainDataContext } from '../context/CaptainContext'

export const CaptainLogout = () => {
    const token = getCaptainToken()
    const navigate = useNavigate()
    const { clearCaptain } = useContext(CaptainDataContext)

    useEffect(() => {
        if (!token) {
            clearCaptain()
            navigate('/captain-login', { replace: true })
            return
        }
        let cancelled = false
        apiClient.get('/captains/logout', {
            headers: { Authorization: token ? `Bearer ${token}` : undefined },
        })
            .catch(() => { /* still clear local session */ })
            .finally(() => {
                if (cancelled) return
                localStorage.removeItem('captainToken')
                localStorage.removeItem('captain-token')
                localStorage.removeItem('token')
                clearCaptain()
                navigate('/captain-login', { replace: true })
            })
        return () => {
            cancelled = true
        }
    }, [ token, navigate, clearCaptain ])

    return (
        <div className="driver-page flex min-h-screen items-center justify-center p-6 text-sm text-zinc-400">Signing out…</div>
    )
}

export default CaptainLogout
