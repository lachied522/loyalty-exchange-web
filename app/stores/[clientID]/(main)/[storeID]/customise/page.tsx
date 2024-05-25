import { Separator } from "@/components/ui/separator";

import StoreLogo from "./components/store-logo";
import StoreImage from "./components/store-image";
import StoreRewards from "./components/store-rewards";
import StoreLocation from "./components/store-location";
import StoreName from "./components/store-name";

export default function CustomisePage() {

    return (
        <div className='grid grid-cols-1 lg:grid-cols-2 items-start xl:gap-6 gap-3 md:p-6 p-2'>
            <div className='xl:col-span-1 col-span-2 xl:ml-3'>
                <StoreName />
                <Separator className='my-3 lg:my-6 xl:hidden' />
            </div>
            <div className='xl:col-span-1 col-span-2 xl:ml-3'>
                <StoreLocation />
            </div>

            <div className='col-span-2'>
                <Separator className='my-3 lg:my-6' />
            </div>

            <div className='xl:col-span-1 col-span-2 xl:mr-3'>
                <StoreLogo />
                <Separator className='my-3 lg:my-6 xl:hidden' />
            </div>

            <div className='xl:col-span-1 col-span-2 xl:mr-3'>
                <StoreImage />
            </div>
            
            <div className='col-span-2'>
                <Separator className='my-3 lg:my-6' />
                <StoreRewards />
            </div>
        </div>
    )
}