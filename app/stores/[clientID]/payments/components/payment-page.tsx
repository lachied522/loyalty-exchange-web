"use client";
import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

import { type ClientIDState, useClientIDContext } from '../../context/ClientIDContext';

import { handleCheckoutSuccess } from "../actions/sessions";

import StripeEmbeddedCheckout from "./StripeEmbeddedCheckout";

export default function PaymentPage() {
    const { clientData } = useClientIDContext() as ClientIDState;
    const searchParams = useSearchParams();
    const router = useRouter();
    
    useEffect(() => {
        // once user has completed checkout session id will be added to search params
        const _checkoutSessionID = searchParams.get('session_id');
        if (_checkoutSessionID) {
            handleCheckoutSuccessAndRedirectUser(_checkoutSessionID);
        }

        async function handleCheckoutSuccessAndRedirectUser(checkoutSessionID: string) {
            await handleCheckoutSuccess(clientData, checkoutSessionID);
            router.replace(`/stores/${clientData.id}`);
        }
    }, [searchParams, router, clientData]);

    return (
        <>
            {searchParams.get('session_id') ? (
            <div className='w-full max-w-[960px] min-w-[360px] sm:p-12 p-6 border border-neutral-100'>
                <div className='flex flex-col items-center'>
                    <h4 className='text-lg font-medium'>Thank You</h4>
                    <p>Please wait while we redirect you...</p>
                </div>
            </div>
            ) : (
            <StripeEmbeddedCheckout />
            )}
        </>
    )
}