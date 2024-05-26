import Logo from "@/logo";

import PaymentPage from "./components/payment-page";

export default async function StorePaymentsPage() {

    return (
        <div className='h-full flex items-center justify-center p-12'>
            <div className='h-full flex flex-col items-center gap-12'>
                <Logo withText />
                <h1 className='md:text-4xl text-3xl font-semibold text-center'>Please enter your payment details below</h1>
                
                <p className='max-w-[480px] text-lg font-medium text-center'>Our referral fee is charged as a percentage of total customer spending though our app, billed monthly.</p>
                
                <PaymentPage />
            </div>
        </div>
    )
}