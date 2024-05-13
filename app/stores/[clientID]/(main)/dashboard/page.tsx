import RecentTransactions from "./components/recent-transactions";
import TopCustomers from "./components/top-customers";
import StoreSelector from "./components/store-selector";

export default function ClientIDDashboard() {

    return (
        <div className='flex flex-col items-stretch justify-center'>
            <div className='grid grid-cols-1 lg:grid-cols-2 lg:gap-6 gap-3 lg:p-24 p-12'>
                <div className='col-span-1 lg:col-span-2 flex flex-row justify-end'>
                    <StoreSelector />
                </div>
                
                <TopCustomers />
                <RecentTransactions />
            </div>
        </div>
    )
}