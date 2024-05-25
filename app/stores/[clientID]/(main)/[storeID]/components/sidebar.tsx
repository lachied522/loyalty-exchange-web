"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

import { Home, Cog, Receipt, Store, Plus } from 'lucide-react';

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/components/lib";

import { type StoreIDState, useStoreIDContext } from "../context/StoreIDContext";
import { type ClientIDState, useClientIDContext } from "../../../context/ClientIDContext";

import CreateStoreDialog from "./create-store-dialog";

export default function Sidebar() {
    const { clientData } = useClientIDContext() as ClientIDState;
    const { storeID, storeData } = useStoreIDContext() as StoreIDState;
    const [isOpenOnMobile, setIsOpenOnMobile] = useState<boolean>(true);
    const pathname = usePathname();

    return (
        <>
            <div className='w-[160px]' />
            <aside className='z-10 h-screen w-[160px] flex flex-col items-start px-6 py-12 fixed'>
                <h4 className='text-lg font-semibold'>My Stores</h4>

                <nav className='h-full flex flex-col py-6'>
                    {clientData.stores.map((store) => (
                        <div className='flex flex-col gap-2'>
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
                        <Button variant='ghost' className='flex items-center justify-start font-medium gap-2'>
                            <Plus size={16} />
                            Create New
                        </Button>
                    </CreateStoreDialog>
                    
                    <div className='h-full flex flex-col justify-end'>
                        <Link href={`/stores/${clientData.id}/payments`}>
                            <Button
                                variant='ghost'
                                className={cn(
                                    'w-full grid grid-cols-[25px,1fr] items-center justify-start hover:text-yellow-400 hover:bg-white',
                                    pathname.endsWith('/payments') && 'text-yellow-400'
                                )}
                            >
                                <Cog size={18} />
                                <div className='font-semibold text-xs text-left'>Settings</div>
                            </Button>
                        </Link>
                    </div>
                </nav>
            </aside>
        </>
    )
}