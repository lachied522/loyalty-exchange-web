import Logo from "@/logo";

export default function PasswordReset() {
    
    return (
        <main className='h-[100vh] flex items-center justify-center bg-yellow-100 p-12'>
            <div className='h-full flex flex-col items-center gap-12'>
                <Logo withText />
                <div className='w-[360px] flex flex-col items-center gap-6'>
                    <h3 className='text-center text-xl font-semibold'>Your password has been reset</h3>
                    <p>You may close this tab.</p>
                </div>
            </div>
        </main>
    )
}