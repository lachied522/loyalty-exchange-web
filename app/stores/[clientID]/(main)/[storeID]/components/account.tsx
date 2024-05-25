"use client";
import { useRouter } from "next/navigation";

import { LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";

import { createClient } from "@/utils/supabase/client";

import { type ClientIDState, useClientIDContext } from "../../../context/ClientIDContext";

export default function Account() {
    const { clientData } = useClientIDContext() as ClientIDState;
    const router = useRouter();

    const onLogOut = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
    
        router.replace('/');
    }

    return (
        <div className='flex lg:flex-row flex-col lg:items-center items-end lg:gap-3.5'>
            <div className='text-sm pr-5 lg:pr-0'>
                Logged in as <span className='font-medium'>{clientData.name}</span>
            </div>
            <Button
                onClick={onLogOut}
                variant='ghost'
                className='flex flex-row items-center gap-1 font-medium text-red-400'
            >
                Logout <LogOut size={16}/>
            </Button>
        </div>
    )
}