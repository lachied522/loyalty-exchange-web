import StoreSelector from "./components/store-selector";
import StoreLogo from "./components/store-logo";
import StoreImage from "./components/store-image";
import StoreRewards from "./components/store-rewards";

export default function ClientIDDashboard() {

    return (
        <div className='flex flex-col items-stretch justify-center'>
            <div className='grid grid-cols-1 xl:grid-cols-2 xl:gap-6 gap-3 xl:p-24 p-12'>
                <div className='col-span-1 xl:col-span-2 flex flex-row justify-end'>
                    <StoreSelector />
                </div>
                <StoreLogo />
                <StoreImage />
                
                <div className='xl:col-span-2'>
                    <StoreRewards />
                </div>
            </div>
        </div>
    )
}