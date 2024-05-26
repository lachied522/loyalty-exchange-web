import { Suspense } from 'react';

import { Button } from "@/components/ui/button";
import { Input } from '@/components/ui/input';

import Logo from "@/logo";
import ClientSignupPage from "./components/client-signup-page";

function FormPlaceholder() {
    return (
        <div className='w-[360px] flex flex-col items-stretch gap-2'>
            <Input />
            <Input type="password" />
            <Input type="password" />
            <Button type="submit" disabled className='font-bold'>
                Submit
            </Button>
        </div>
    )
}

export default async function Page() {

    return (
        <main className='h-[100vh] flex items-center justify-center bg-yellow-100 p-12'>
            <div className='h-full flex flex-col items-center gap-12'>
                <Logo withText />

                <div className='flex flex-col items-center gap-1'>
                    <h1 className='md:text-4xl text-3xl font-semibold'>Store Signup</h1>
                    <h4 className='text-lg font-medium'>Welcome!</h4>
                </div>

                <Suspense fallback={<FormPlaceholder />}>
                    <ClientSignupPage />
                </Suspense>
            </div>
        </main>
    )
}