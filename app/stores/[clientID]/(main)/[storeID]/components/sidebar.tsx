"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

import { Home, Cog, Store, Plus } from 'lucide-react';

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/components/lib";

import { createBillingPortalSession } from "../actions/payments";

import { type StoreIDState, useStoreIDContext } from "../context/StoreIDContext";
import { type ClientIDState, useClientIDContext } from "../../../context/ClientIDContext";

import CreateStoreDialog from "./create-store-dialog";

export default function Sidebar() {
    const { clientData } = useClientIDContext() as ClientIDState;
    const { isMobile, isSidebarOpenOnMobile, setIsSidebarOpenOnMobile } = useStoreIDContext() as StoreIDState;
    const [isLoadingPayments, setIsLoadingPayments] = useState<boolean>(false);
    const sidebarRef = useRef<HTMLDivElement | null>(null);
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
        const closeSidebarOnOutsideClick = (event: MouseEvent) => {
            // on mobile, close sidebar when user clicks outside
            if (
                isMobile &&
                isSidebarOpenOnMobile &&
                sidebarRef.current &&
                !sidebarRef.current.contains(event.target as Node)
            ) {
                setIsSidebarOpenOnMobile(false);
            }
        };

        if (isMobile) {
            document.addEventListener('click', closeSidebarOnOutsideClick);
        } else {
            // remove event listener if not on mobile
            document.removeEventListener('click', closeSidebarOnOutsideClick);
        }

        return () => {
            // clean up the event listener when the component unmounts
            document.removeEventListener('click', closeSidebarOnOutsideClick);
          };
    }, [isMobile, isSidebarOpenOnMobile, setIsSidebarOpenOnMobile]);


    return (
        <>
            {isSidebarOpenOnMobile && (
                <div className='z-[999] bg-slate-700 justify-center items-center fixed inset-0 opacity-50'/>
            )}
            <div className={cn('w-[160px]', isMobile && 'hidden')} />
            <aside
                ref={sidebarRef}
                className={cn(
                    'z-[9999] h-screen w-[160px] flex flex-col items-start px-6 py-12 fixed translate-x-0 transition-all ease-in-out duration-300',
                    isMobile && 'bg-white w-[240px]',
                    isMobile && !isSidebarOpenOnMobile && 'translate-x-[-100%]',
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