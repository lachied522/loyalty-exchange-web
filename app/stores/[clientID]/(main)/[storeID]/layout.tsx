import { Card, CardContent } from "@/components/ui/card";

import Logo from '@/logo';

import Sidebar from "./components/sidebar";
import StoreIDContextProvider from "./context/StoreIDContext";

interface StoreIDLayoutProps {
    children: React.ReactNode
    params: { storeID: string }
}

export default function StoreIDLayout({
    children,
    params
}: StoreIDLayoutProps) {

    return (
        <StoreIDContextProvider storeID={params.storeID}>
            <main className='min-h-screen flex flex-row bg-neutral-50'>
                <Sidebar />
                <div className='flex-1 xl:p-9 p-5'>
                    {/* <Header /> */}
                    <Logo withText />
                    <Card className='mt-6'>
                        <CardContent className='p-2'>
                            {children}
                        </CardContent>
                    </Card>
                </div>
            </main>
        </StoreIDContextProvider>
    )
}