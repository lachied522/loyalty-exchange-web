"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

import { Home, Cog, Receipt, Store, Plus } from 'lucide-react';

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/components/lib";

import { createBillingPortalSession } from "../actions/payments";

import { type StoreIDState, useStoreIDContext } from "../context/StoreIDContext";
import { type ClientIDState, useClientIDContext } from "../../../context/ClientIDContext";

import CreateStoreDialog from "./create-store-dialog";

export default function Sidebar() {
    const { clientData } = useClientIDContext() as ClientIDState;
    const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 1024);
    const [isOpenOnMobile, setIsOpenOnMobile] = useState<boolean>(false);
    const [isLoadingPayments, setIsLoadingPayments] = useState<boolean>(false);
    const pathname = usePathname();

    const onPaymentsButtonClick = async () => {
        if (isLoadingPayments) return; // prevent multiple requests
        setIsLoadingPayments(true);
        // create billing portal session and open in new tab
        const res = await createBillingPortalSession(clientData, pathname);

        if (!(res && res.url)) {
            // TO DO
            return;
        }

        window.open(res.url, '_blank');
        setIsLoadingPayments(false);
    }

    useEffect(() => {
        // add event listener for obtaining screen width
        const handleResize = () => {
            setIsMobile(window.innerWidth < 1024);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize)
        };
    }, []);

    return (
        <>
            {isOpenOnMobile && (
                <div className='z-[999] bg-slate-700 justify-center items-center fixed inset-0 opacity-50'/>
            )}
            <div className={cn('w-[160px]', isMobile && 'hidden')} />
            <aside
                className={cn(
                    'z-10 h-screen w-[160px] flex flex-col items-start px-6 py-12 fixed',
                    isMobile && 'hidden'
                )}
            >
                <h4 className='text-lg font-semibold'>My Stores</h4>

                <nav className='h-full flex flex-col py-6'>
                    {clientData.stores.map((store) => (
                        <div className='flex flex-col gap-2' key={`nav-item-${store.id}`}>
                            <div className='text-sm font-medium mb-2'>{store.name}</div>
                            <Link href={`/stores/${clientData.id}/${store.id}/dashboard`}>
                                <Button
                                    variant='ghost'
                                    className={cn(
                                        'w-[120px] grid grid-cols-[25px,1fr] items-center justify-start hover:text-yellow-400 hover:bg-white',
                                        pathname.includes(store.id) && pathname.endsWith('/dashboard') && 'bg-white text-yellow-400'
                                    )}
                                >
                                    <Home size={18} />
                                    <div className='font-semibold text-xs text-left'>Dashboard</div>
                                </Button>
                            </Link>
                
                            <Link href={`/stores/${clientData.id}/${store.id}/customise`}>
                                <Button
                                    variant='ghost'
                                    className={cn(
                                        'w-[120px] grid grid-cols-[25px,1fr] items-center justify-start hover:text-yellow-400 hover:bg-white',
                                        pathname.includes(store.id) && pathname.endsWith('/customise') && 'bg-white text-yellow-400'
                                    )}
                                >
                                    <Store size={18} />
                                    <div className='font-semibold text-xs text-left'>Customise</div>
                                </Button>
                            </Link>
                            <Separator className='my-3.5' />
                        </div>
                    ))}
                    
                    <CreateStoreDialog>
                        <Button
                            variant='ghost'
                            className='w-[120px] grid grid-cols-[25px,1fr] items-center justify-start font-medium hover:text-yellow-400 hover:bg-white'
                        >
                            <Plus size={16} />
                            Create New
                        </Button>
                    </CreateStoreDialog>
                    
                    <div className='h-full flex flex-col justify-end'>
                        <Button
                            variant='ghost'
                            className={cn(
                                'w-full grid grid-cols-[25px,1fr] items-center justify-start hover:text-yellow-400 hover:bg-white',
                                pathname.endsWith('/payments') && 'text-yellow-400'
                            )}
                            onClick={onPaymentsButtonClick}
                        >
                            <Cog size={18} />
                            <div className='font-semibold text-xs text-left'>Payments</div>
                        </Button>
                    </div>
                </nav>
            </aside>
        </>
    )
}