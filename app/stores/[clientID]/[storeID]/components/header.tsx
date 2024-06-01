"use client";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import Logo from "@/logo";

import { type ScreenState, useScreenContext } from "../context/ScreenContext";

import Account from "./account";

export default function Header() {
    const { isMobile, setIsSidebarOpenOnMobile } = useScreenContext() as ScreenState;


    const onMenuClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        setIsSidebarOpenOnMobile(true);
    }

    return (
        <div className='flex flex-row items-center justify-between gap-2 pt-2'>
            {isMobile && (
                <Button
                    variant='ghost'
                    onClick={onMenuClick}
                >
                    <Menu size={32} />
                </Button>
            )}
            <div className='w-full flex flex-col md:flex-row items-end md:items-center justify-between'>
                <Logo withText />
                <Account />
            </div>
        </div>
    )
}