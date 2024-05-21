import Header from "./components/header";
import Sidebar from "./components/sidebar";

export default function ClientIDMainLayout({ children } : { children: React.ReactNode }) {

    return (
        <main className='min-h-screen flex items-start bg-neutral-100'>
            <Sidebar />
            <div className='flex-1 ml-32'>
                <Header />
                <div className='container'>
                    {children}
                </div>
            </div>
        </main>
    )
}