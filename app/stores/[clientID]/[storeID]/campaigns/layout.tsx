import CampaignsContextProvider from "./context/CampaignsContext";

export default function CampaignsLayout({ children } :  { children: React.ReactNode }) {

    return (
        <CampaignsContextProvider>
            {children}
        </CampaignsContextProvider>
    )
}