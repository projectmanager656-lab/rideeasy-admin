import { createContext, useCallback, useState } from 'react';
import { apiClient, withCaptainAuth } from '../services/http';

export const CaptainDataContext = createContext();

const CaptainContext = ({ children }) => {
    const [ captain, setCaptain ] = useState(null);
    const [ isLoading, setIsLoading ] = useState(false);
    const [ error, setError ] = useState(null);

    const updateCaptain = useCallback((captainData) => {
        setCaptain(captainData || null);
    }, []);

    const clearCaptain = useCallback(() => {
        setCaptain(null);
    }, []);

    const setCaptainStatus = useCallback(async (status) => {
        const response = await apiClient.post('/captains/status', { status }, withCaptainAuth());
        const nextStatus = response.data?.status || status;
        setCaptain((current) => current ? { ...current, status: nextStatus, isOnline: nextStatus === 'active' } : current);
        return nextStatus;
    }, []);

    const value = {
        captain,
        setCaptain,
        isLoading,
        setIsLoading,
        error,
        setError,
        updateCaptain,
        clearCaptain,
        isOnline: captain?.status === 'active',
        setCaptainStatus,
    };

    return (
        <CaptainDataContext.Provider value={value}>
            {children}
        </CaptainDataContext.Provider>
    );
};

export default CaptainContext;
