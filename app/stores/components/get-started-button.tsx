"use client";
import { useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function GetStartedButton() {
    const [email, setEmail] = useState<string>('');

    return (
        <div className='flex flex-col sm:flex-row items-end sm:items-center gap-2'>
            <Input
                type='email'
                placeholder='Your email'
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                className='w-[240px] h-[48px]'
            />

            <Link href={`/stores/signup?email=${email}`}>
                <Button size='lg' className='text-lg font-semibold'>
                    Start Now
                </Button>
            </Link>
        </div>
    )
}