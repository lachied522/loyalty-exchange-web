import CustomiseContextProvider from "./context/CustomiseContext"

export default function CustomiseLayout({ children } : { children: React.ReactNode }) {

    return (
        <CustomiseContextProvider>
            {children}
        </CustomiseContextProvider>
    )
}