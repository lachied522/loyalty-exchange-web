import DashboardContextProvider from "./context/DashboardContext";

export default function DashboardLayout({ children } :  { children: React.ReactNode }) {

    return (
        <DashboardContextProvider>
            {children}
        </DashboardContextProvider>
    )
}