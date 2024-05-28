
import Logo from "@/logo";

import CreateStoreForm from "./components/create-store-form";

export default async function Page() {

    return (
        
        <main className='min-h-[100vh] flex items-center justify-center bg-white p-2 md:p-12'>
            <div className='h-full flex flex-col items-center gap-12 mb-12'>
                <Logo withText />
                <h1 className='md:text-4xl text-3xl font-semibold'>Tell us about your store.</h1>
                
                <CreateStoreForm />
            </div>
        </main>
    )
}