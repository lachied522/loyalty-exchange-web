import { Suspense } from 'react';

import { Button } from "@/components/ui/button";
import { Input } from '@/components/ui/input';

import Logo from "@/logo";
import StoreLoginForm from "./components/store-login-form";

function FormPlaceholder() {
    return (
        <div className='w-[360px] flex flex-col items-stretch gap-2'>
            <Input />
            <Input type="password" />
            <Button type="submit" disabled className='font-bold'>
                Login
            </Button>
        </div>
    )
}

export default function StoreLoginPage() {
    // form should be wrapped in suspense boundary to improve speed of initial render
    
    return (
        <main className='h-[100vh] flex items-center justify-center bg-yellow-100 p-12'>
            <div className='h-full flex flex-col items-center gap-12'>
                <Logo withText />
                <h1 className='md:text-4xl text-3xl font-semibold'>Store Login</h1>
                <Suspense fallback={<FormPlaceholder />}>
                    <StoreLoginForm />
                </Suspense>
            </div>
        </main>
    )
}