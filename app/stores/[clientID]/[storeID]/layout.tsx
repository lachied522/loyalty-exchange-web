import { Card, CardContent } from "@/components/ui/card";

import StoreIDContextProvider from "./context/StoreIDContext";
import Sidebar from "./components/sidebar";
import Header from "./components/header";
import ScreenContextProvider from "./context/ScreenContext";

interface StoreIDLayoutProps {
    children: React.ReactNode
    params: { storeID: string }
}

export default function StoreIDLayout({
    children,
    params
}: StoreIDLayoutProps) {
    
    return (
        <ScreenContextProvider>
            <StoreIDContextProvider storeID={params.storeID}>
                <main className='min-h-screen flex flex-row bg-neutral-50'>
                    <Sidebar />
                    <div className='flex-1 xl:px-16 px-5 xl:py-8 py-3'>
                        <Header />
                        <Card className='mt-6'>
                            <CardContent className='p-2'>
                                {children}
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </StoreIDContextProvider>
        </ScreenContextProvider>
    )
}