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
        <div className='flex flex-row items-center gap-1'>
            <div className='text-sm'>
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