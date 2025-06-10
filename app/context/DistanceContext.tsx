'use client';
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { toast } from 'react-toastify';
import { distanceResponse } from '../types/distancecalculationresponse';
import { distanceCalculation } from '../services/data.service';

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface DistanceContextType {
  daysFromAPI: distanceResponse | null;
  extraDaysCount: number;
  setExtraDaysCount: React.Dispatch<React.SetStateAction<number>>;
  callDistanceAPI: (
    origin: string,
    destination: string,
    sourceCoords: Coordinates,
    destinationCoords: Coordinates
  ) => Promise<void>;
  setIsError: React.Dispatch<React.SetStateAction<string>>;
  isError: string;
  isDistanceLoading: boolean;
}

const DistanceContext = createContext<DistanceContextType | undefined>(undefined);

export const DistanceProvider = ({ children }: { children: ReactNode }) => {
  const [daysFromAPI, setDaysFromAPI] = useState<distanceResponse | null>(null);
  const [extraDaysCount, setExtraDaysCount] = useState(0);
  const [isError, setIsError] = useState<string>("");
  const [isDistanceLoading, setIsDistanceLoading] = useState(false);

  // Load distance data from sessionStorage on initial render
  useEffect(() => {
    const storedDistance = sessionStorage.getItem('distance_api_response');
    if (storedDistance) {
      setDaysFromAPI(JSON.parse(storedDistance));
    }
  }, []);

  const callDistanceAPI = async (
    origin: string,
    destination: string,
    sourceCoords: Coordinates,
    destinationCoords: Coordinates
  ) => {
    setIsDistanceLoading(true);
    setIsError('');
    try {
      const payload = {
        source: origin,
        sourceLatitude: sourceCoords.latitude,
        sourceLongitude: sourceCoords.longitude,
        destination,
        destinationLatitude: destinationCoords.latitude,
        destinationLongitude: destinationCoords.longitude,
      };

      const response = await distanceCalculation(payload);

      if (response) {
        setDaysFromAPI(response);
        setIsDistanceLoading(false);
        setIsError(''); 
        sessionStorage.setItem('distance_api_response', JSON.stringify(response)); // Persist
      }
    } catch (error:any) {
      setIsError('Failed to calculate distance.');
     
      
      toast.error('Failed to calculate distance.');
    }
  };

  return (
    <DistanceContext.Provider value={{ daysFromAPI, callDistanceAPI, setExtraDaysCount, extraDaysCount, setIsError, isError,isDistanceLoading }}>
      {children}
    </DistanceContext.Provider>
  );
};

export const useDistance = () => {
  const context = useContext(DistanceContext);
  if (!context) {
    throw new Error('useDistance must be used within a DistanceProvider');
  }
  return context;
};
