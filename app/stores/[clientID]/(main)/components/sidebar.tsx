"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";

import { Home, Cog, Receipt, Store } from 'lucide-react';

import { cn } from "@/components/lib";

import { type ClientState, useClientContext } from "../../context/ClientContext";

import Logo from '@/logo';


export default function Sidebar() {
    const { clientData } = useClientContext() as ClientState;
    const pathname = usePathname();

    return (
        <aside className='z-10 h-screen w-32 flex flex-col items-center py-5 bg-white shadow-md fixed'>
            <Logo withText={false} />
            <nav className='flex flex-col gap-12 px-5 py-6 cursor-pointer'>
                <Link
                    href={`/stores/${clientData.id}/dashboard`}
                    className={cn(
                        'grid grid-cols-[25px,1fr] items-center justify-start gap-1.5',
                        pathname.endsWith('/dashboard') && 'text-yellow-400'
                    )}
                >
                    <Home />
                    <div className='font-semibold text-xs'>Dashboard</div>
                </Link>

                <Link
                    href={`/stores/${clientData.id}/customise`}
                    className={cn(
                        'grid grid-cols-[25px,1fr] items-center justify-start gap-1.5',
                        pathname.endsWith('/customise') && 'text-yellow-400'
                    )}
                >
                    <Store />
                    <div className='font-semibold text-xs'>Stores</div>
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
        </aside>
    )
}