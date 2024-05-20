import Logo from "@/logo";

import StripeEmbeddedCheckout from "./components/StripeEmbeddedCheckout";
import PaymentPage from "./components/payment-page";

export default async function StorePaymentsPage() {

    return (
        <div className='h-full flex items-center justify-center p-12'>
            <div className='h-full flex flex-col items-center gap-12'>
                <h1 className='md:text-4xl text-3xl font-semibold'>Please enter your payment details below</h1>
                
                <PaymentPage />
            </div>
        </div>
    )
}