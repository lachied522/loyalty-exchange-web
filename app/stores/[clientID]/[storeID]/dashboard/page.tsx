import { Separator } from "@/components/ui/separator";

import Revenue from "./components/revenue";
import TopCustomers from "./components/top-customers";
import RecentTransactions from "./components/recent-transactions";
import RecentRedemptions from "./components/recent-redemptions";

export default function DashboardPage() {

    return (
        <div className='grid xl:grid-cols-2 grid-cols-1 items-start xl:gap-6 gap-3 md:p-6 p-2'>                
            <div className='col-span-2'>
                <Revenue />                
                <Separator className='my-3 lg:my-6' />
            </div>

            <div className='xl:col-span-1 col-span-2 xl:mr-3'>
                <TopCustomers />
            </div>

            <div className='xl:col-span-1 col-span-2 xl:ml-3'>
                <Separator className='my-3 lg:my-6 xl:hidden' />
                <RecentRedemptions />
            </div>
            
            <div className='col-span-2'>
                <Separator className='my-3 lg:my-6' />
                <RecentTransactions />
            </div>
        </div>
    )
}