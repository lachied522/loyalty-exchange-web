"use client";
import { createContext, useContext, useState, useEffect } from "react";

export type ScreenState = {
    isMobile: boolean
    isSidebarOpenOnMobile: boolean
    setIsMobile: React.Dispatch<React.SetStateAction<boolean>>
    setIsSidebarOpenOnMobile: React.Dispatch<React.SetStateAction<boolean>>
}

const ScreenContext = createContext<any>(null);

export const useScreenContext = () => {
    return useContext(ScreenContext);
};

export default function ScreenContextProvider({
    children,
} : {
    children: React.ReactNode
}) {
    const [isSidebarOpenOnMobile, setIsSidebarOpenOnMobile] = useState<boolean>(false);
    const [isMobile, setIsMobile] = useState<boolean>(false);

    useEffect(() => {
        // add event listener for obtaining screen width
        const handleResize = () => {
            setIsMobile(window.innerWidth < 1024);
            setIsSidebarOpenOnMobile(false);
        };

        handleResize();

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize)
        };
    }, []);
    
    return (
        <ScreenContext.Provider
            value={{
                isMobile,
                isSidebarOpenOnMobile,
                setIsMobile,
                setIsSidebarOpenOnMobile,
            }}
        >
            {children}
        </ScreenContext.Provider>
    )
}