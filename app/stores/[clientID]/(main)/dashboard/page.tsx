import RecentTransactions from "./components/recent-transactions";
import TopCustomers from "./components/top-customers";
import StoreSelector from "./components/store-selector";

export default function ClientIDDashboard() {

    return (
        <div className='flex flex-col items-stretch justify-center'>
            <div className='grid grid-cols-1 xl:grid-cols-2 xl:gap-6 gap-3 xl:p-24 p-12 items-start'>
                <div className='col-span-1 xl:col-span-2 flex flex-row justify-end'>
                    <StoreSelector />
                </div>
                
                <TopCustomers />
                <RecentTransactions />
            </div>
        </div>
    )
}