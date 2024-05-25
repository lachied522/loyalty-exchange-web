
import Logo from "@/logo";

import CreateStoreForm from "./components/create-store-form";

export default async function Page({ params }: { params: { clientID: string } }) {

    return (
        
        <main className='h-[100vh] flex items-center justify-center bg-yellow-100 p-12'>
            <div className='h-full flex flex-col items-center gap-12'>
                <Logo withText />
                <h1 className='md:text-4xl text-3xl font-semibold'>Tell us about your store.</h1>
                
                <CreateStoreForm clientID={params.clientID} />
            </div>
        </main>
    )
}