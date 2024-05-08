import Logo from "@/logo";

import StoreSignup from "./components/store-signup";

export default function StorePage() {


    return (
        <main className=''>
            <div className='bg-yellow-100'>
                <div className='w-full flex flex-row justify-between py-4 px-6'>
                    <Logo withText={true} />
                </div>

                <div className='min-h-[440px] flex flex-col items-center sm:p-24 p-12'>
                    <div className='flex flex-col gap-6'>
                        <h1 className='sm:text-4xl text-3xl font-semibold mb-6'>Loyalty Exchange is launching soon</h1>
                        <p className='max-w-[640px] font-medium text-wrap'>
                            We are making effective loyalty rewards programs accessible to small businesses. 
                            Simply become a member of our network and get access to a completely custom loyalty rewards program.
                            We do all the heavy lifting, so you can sit back and watch customers fly through your doors.
                        </p>
                        <p className='max-w-[640px] font-medium'>Submit your details below and we will be in touch.</p>
                    </div>
                </div>
            </div>

            <div className='flex flex-col items-center gap-12 sm:p-24 p-12'>
                <h1 className='sm:text-4xl text-3xl font-semibold'>Join our store network</h1>
                <StoreSignup />
            </div>

        </main>
    )
}