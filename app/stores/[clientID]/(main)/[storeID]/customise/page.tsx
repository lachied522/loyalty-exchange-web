import StoreSelector from "./components/store-selector";
import StoreLogo from "./components/store-logo";
import StoreImage from "./components/store-image";
import StoreRewards from "./components/store-rewards";
import StoreLocation from "./components/store-location";
import StoreName from "./components/store-name";

export default function CustomisePage() {

    return (
        <div className='flex flex-col items-stretch justify-center'>
            <div className='grid grid-cols-1 lg:grid-cols-2 xl:gap-6 gap-3 lg:p-24 p-12 items-start'>
                <div className='col-span-1 lg:col-span-2 flex flex-row justify-end'>
                    <StoreSelector />
                </div>
                <StoreName />
                <StoreLocation />
                <StoreLogo />
                <StoreImage />
                
                <div className='lg:col-span-2'>
                    <StoreRewards />
                </div>
            </div>
        </div>
    )
}