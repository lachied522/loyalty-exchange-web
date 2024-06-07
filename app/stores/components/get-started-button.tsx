"use client";
import { useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function GetStartedButton() {
    const [email, setEmail] = useState<string>('');

    return (
        <div className='flex flex-row items-center gap-2 bg-yellow-200/50 border-2 border-yellow-400 rounded-xl'>
            <Input
                type='email'
                placeholder='Your email'
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                className='sm:w-[240px] h-[48px] font-medium placeholder:text-neutral-800 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0'
            />

            <Link href={`/stores/signup?email=${email}`}>
                <Button size='lg' className='h-[48px] text-lg font-semibold rounded-l-none'>
                    Start Now
                </Button>
            </Link>
        </div>
    )
}