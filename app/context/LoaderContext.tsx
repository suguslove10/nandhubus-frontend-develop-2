"use client";
import React, { createContext, useContext, useState, ReactNode } from 'react';
import loaderGif from "../../public/assests/nnn.gif"; 

// Define the LoaderContext type
interface LoaderContextType {
  isLoading: boolean;
  errorMessage: string | null;
  showLoader: () => void;
  hideLoader: () => void;
  setErrorMessage: (message: string | null) => void;
}

// Create the context
const LoaderContext = createContext<LoaderContextType | undefined>(undefined);

// Loader Provider component
interface LoaderProviderProps {
  children: ReactNode;
}

const Loader: React.FC = () => {
  return (
    <div className="fixed inset-0 backdrop-blur-md flex justify-center items-center z-50 bg-black/70">
      <img
        src={loaderGif.src}
        alt="Loading..."
        className="w-80 h-80 animate-bounce-in-top animate-heart highlight-logo"
      />
    </div>
  );
};

export const LoaderProvider: React.FC<LoaderProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const showLoader = () => setIsLoading(true);
  const hideLoader = () => setIsLoading(false);

  return (
    <LoaderContext.Provider value={{ 
      isLoading, 
      errorMessage,
      showLoader, 
      hideLoader,
      setErrorMessage
    }}>
      {children}
      {isLoading && <Loader />}
    </LoaderContext.Provider>
  );
};

// Hook to use the LoaderContext
export const useLoader = (): LoaderContextType => {
  const context = useContext(LoaderContext);
  if (!context) {
    throw new Error('useLoader must be used within a LoaderProvider');
  }
  return context;
};