import { Suspense } from "react";

import { Input } from "@/components/ui/input";
import Logo from "@/logo";

import ResetPasswordPage from "./components/reset-password-page";

const FormPlaceholder = () => {
    return (
        <div className='sm:w-[360px] w-[240px] flex flex-col items-stretch gap-6'>
            <div>Email Address</div>
            <Input />
            <div>We will send you an email to change your password.</div>
        </div>
    )
}

export default function Page() {
    return (
        <main className='h-[100vh] flex items-center justify-center bg-yellow-100 p-12'>
            <div className='h-full flex flex-col items-center gap-6'>
                <Logo withText />

                <h3 className='text-center text-xl font-semibold'>Reset My Password</h3>
                
                <Suspense fallback={<FormPlaceholder />}>
                    <ResetPasswordPage />
                </Suspense>
            </div>
        </main>
    )
}