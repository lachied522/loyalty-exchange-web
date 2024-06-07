"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

import { Home, Store, Smartphone, Gift } from 'lucide-react';

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/components/lib";

import { type ClientIDState, useClientIDContext } from "../../context/ClientIDContext";
import { type ScreenState, useScreenContext } from "../context/ScreenContext";
import BillingButton from "./billing-button";

export default function Sidebar() {
    const { clientData } = useClientIDContext() as ClientIDState;
    const { isMobile, isSidebarOpenOnMobile, setIsSidebarOpenOnMobile } = useScreenContext() as ScreenState;
    const [isLoadingPayments, setIsLoadingPayments] = useState<boolean>(false);
    const sidebarRef = useRef<HTMLDivElement | null>(null);
    const pathname = usePathname();

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
            <div className={cn('w-[180px]', isMobile && 'hidden')} />
            <aside
                ref={sidebarRef}
                className={cn(
                    'z-[9999] h-screen w-[180px] flex flex-col items-start pl-6 py-6 fixed translate-x-0 transition-all ease-in-out duration-300',
                    isMobile && 'bg-white',
                    isMobile && !isSidebarOpenOnMobile && 'translate-x-[-100%]',
                )}
            >
                <nav className='h-full flex flex-col'>
                    {clientData.stores.map((store, index) => (
                        <div key={`nav-item-${store.id}`} className='flex flex-col gap-2'>
                            {index > 0 && <Separator className='my-3.5' />}

                            <h4 className='text-lg font-semibold mb-2'>{store.name}</h4>

                            <Link href={`/stores/${clientData.id}/${store.id}/dashboard`}>
                                <Button
                                    variant='ghost'
                                    className={cn(
                                        'w-[120px] grid grid-cols-[25px,1fr] items-center justify-start hover:text-yellow-400 hover:bg-white px-3 gap-1',
                                        pathname.includes(store.id) && pathname.endsWith('/dashboard') && 'bg-white text-yellow-400'
                                    )}
                                >
                                    <Home size={20} />
                                    <div className='font-semibold text-xs text-left'>Dashboard</div>
                                </Button>
                            </Link>
                
                            <Link href={`/stores/${clientData.id}/${store.id}/customise`}>
                                <Button
                                    variant='ghost'
                                    className={cn(
                                        'w-[120px] grid grid-cols-[25px_1fr] items-center justify-start hover:text-yellow-400 hover:bg-white px-3 gap-1',
                                        pathname.includes(store.id) && pathname.endsWith('/customise') && 'bg-white text-yellow-400'
                                    )}
                                >
                                    <Store size={20} />
                                    <div className='font-semibold text-xs text-left'>Store</div>
                                </Button>
                            </Link>

                            <Link href={`/stores/${clientData.id}/${store.id}/rewards`}>
                                <Button
                                    variant='ghost'
                                    className={cn(
                                        'w-[120px] grid grid-cols-[25px,1fr] items-center justify-start hover:text-yellow-400 hover:bg-white px-3 gap-1',
                                        pathname.includes(store.id) && pathname.endsWith('/rewards') && 'bg-white text-yellow-400'
                                    )}
                                >
                                    <Gift size={20} />
                                    <div className='font-semibold text-xs text-left'>Rewards</div>
                                </Button>
                            </Link>

                            <Link href={`/stores/${clientData.id}/${store.id}/campaigns`}>
                                <Button
                                    variant='ghost'
                                    className={cn(
                                        'w-[120px] grid grid-cols-[25px,1fr] items-center justify-start hover:text-yellow-400 hover:bg-white px-3 gap-1',
                                        pathname.includes(store.id) && pathname.endsWith('/campaigns') && 'bg-white text-yellow-400'
                                    )}
                                >
                                    <Smartphone size={20} />
                                    <div className='font-semibold text-xs text-left'>Campaigns</div>
                                </Button>
                            </Link>
                        </div>
                    ))}
                    
                    {/* <Link href={`/stores/${clientData.id}/create-store`}>
                        <Button
                            variant='ghost'
                            className='w-[120px] grid grid-cols-[16px,1fr] items-center justify-start font-medium hover:text-yellow-400 hover:bg-white p-2 gap-1'
                        >
                            <Plus size={16} />
                            Create New
                        </Button>
                    </Link>
                     */}
                    <div className='h-full flex flex-col justify-end'>
                        <BillingButton clientData={clientData} pathname={pathname} />
                    </div>
                </nav>
            </aside>
        </>
    )
}