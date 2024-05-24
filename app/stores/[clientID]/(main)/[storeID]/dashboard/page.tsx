import { Separator } from "@/components/ui/separator";

import TotalRevenue from "./components/total-revenue";
import TopCustomers from "./components/top-customers";
import RecentTransactions from "./components/recent-transactions";
import RecentRedemptions from "./components/recent-redemptions";

export default function DashboardPage() {

    return (
        <div className='grid xl:grid-cols-2 grid-cols-1 xl:gap-6 gap-3 items-start p-6'>                
            <div className='col-span-2'>
                <TotalRevenue />
            </div>

            <div className='xl:col-span-1 col-span-2 xl:mr-3'>
                <TopCustomers />
            </div>

            <div className='xl:col-span-1 col-span-2 xl:ml-3'>
                <Separator className='my-12 xl:hidden' />
                <RecentRedemptions />
            </div>
            
            <div className='col-span-2'>
                <Separator className='my-12' />
                <RecentTransactions />
            </div>
        </div>
    )
}