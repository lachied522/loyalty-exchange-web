"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

import { Home, Cog, Receipt, Store } from 'lucide-react';

import { Button } from "@/components/ui/button";
import { cn } from "@/components/lib";

import { type StoreIDState, useStoreIDContext } from "../context/StoreIDContext";
import { type ClientIDState, useClientIDContext } from "../../../context/ClientIDContext";

import CreateStoreDialog from "./create-store-dialog";

export default function Sidebar() {
    const { clientData } = useClientIDContext() as ClientIDState;
    const { storeID, storeData } = useStoreIDContext() as StoreIDState;
    const [isOpenOnMobile, setIsOpenOnMobile] = useState<boolean>(true);
    const [storeSelectorIsOpen, setStoreSelectorIsOpen] = useState<boolean>(false);
    const [width, setWidth] = useState<number>(250);
    const storeSelectorRef = useRef<HTMLDivElement | null>(null);
    const pathname = usePathname();

    useEffect(() => {
        // add event listener for closing store selector on outside click
        const handleClick = (event: MouseEvent) => {
            if (storeSelectorRef.current && !storeSelectorRef.current.contains(event.target as Node)) {
                // Perform your action here, e.g., closing the sidebar
                setStoreSelectorIsOpen(false);
                setWidth(250);
            }
        }

        document.addEventListener('mousedown', handleClick);
        // add event listener for obtaining screen width
        const handleResize = () => {
            setWidth(window.innerWidth > 768? 250: 250);
        };

        handleResize();

        window.addEventListener('resize', handleResize);

        return () => {
            document.removeEventListener('mousedown', handleClick);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const toggleStoreSelector = () => {
        if (storeSelectorIsOpen) {
            setWidth(250);
            setStoreSelectorIsOpen(false);
        } else {
            setWidth(500);
            setStoreSelectorIsOpen(true);
        }
    }

    const router = useRouter();

    const onStoreNavClick = (storeID: string) => {
        const slug = pathname.split('/').reverse()[0];
        router.replace(`/stores/${clientData.id}/${storeID}/${slug}`);
    }

    return (
        <>
            <div style={{ width }} />

            <aside className='z-10 h-screen flex flex-row fixed'>
                {storeSelectorIsOpen && (
                <div ref={storeSelectorRef} className='flex flex-col items-start px-4 py-5 bg-white'>
                    <h4 className='text-lg font-semibold'>My Stores</h4>
                    
                    <nav className='flex flex-col gap-6 px-5 py-6'>
                        {clientData.stores.map((store) => (
                        <Button
                            key={`store-nav-${store.id}`}
                            variant='ghost'
                            onClick={() => onStoreNavClick(store.id)}
                        >
                            {store.name}
                        </Button>
                        ))}
                    </nav>

                    <CreateStoreDialog />
                </div>
                )}

                <div className='flex flex-col items-start px-4 py-5'>
                    <Button
                        size='lg'
                        variant='ghost'
                        className='font-semibold bg-white hover:text-yellow-400 hover:bg-white'
                        onClick={toggleStoreSelector}
                    >
                        {storeData.name}
                    </Button>

                    <nav className='flex flex-col gap-6 py-6'>
                        <Link href={`/stores/${clientData.id}/${storeID}/dashboard`}>
                            <Button
                                variant='ghost'
                                className={cn(
                                    'w-full grid grid-cols-[25px,1fr] items-center justify-start hover:text-yellow-400 hover:bg-white',
                                    pathname.endsWith('/dashboard') && 'bg-white'
                                )}
                            >
                                <Home size={18} />
                                <div className='font-semibold text-xs'>Dashboard</div>
                            </Button>
                        </Link>

                        <Link href={`/stores/${clientData.id}/${storeID}/customise`}>
                            <Button
                                variant='ghost'
                                className={cn(
                                    'w-full grid grid-cols-[25px,1fr] items-center justify-start hover:text-yellow-400 hover:bg-white',
                                    pathname.endsWith('/customise') && 'bg-white'
                                )}
                            >
                                <Store size={18} />
                                <div className='font-semibold text-xs'>Stores</div>
                            </Button>
                        </Link>

                        {/* <Link
                            href={`/stores/${clientData.id}/payments`}
                            className={cn(
                                'grid grid-cols-[25px,1fr] items-center justify-start gap-1.5',
                                pathname.endsWith('/payments') && 'text-yellow-400'
                            )}
                        >
                            <Cog />
                            <div className='font-semibold text-xs'>Settings</div>
                        </Link> */}
                    </nav>
                </div>
            </aside>
        </>
    )
}