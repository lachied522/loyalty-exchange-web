"use client";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

import { type ClientState, useClientContext } from '../../context/ClientContext';

import { handleCheckoutSuccess } from "../actions/sessions";

import StripeEmbeddedCheckout from "./StripeEmbeddedCheckout";

export default function PaymentPage() {
    const { clientData } = useClientContext() as ClientState;
    const searchParams = useSearchParams();

    // once user has completed checkout session id will be added to search params
    const checkoutSessionID = searchParams.get('session_id');

    useEffect(() => {
        if (checkoutSessionID) {
            handleCheckoutSuccess(clientData, checkoutSessionID);
        }
    }, [checkoutSessionID]);

    return (
        <>
            {checkoutSessionID ? (
            <div className='w-full max-w-[960px] min-w-[360px] sm:p-12 p-6 border border-neutral-100'>
                <div className='flex flex-col items-center'>
                    <h4 className='text-lg font-medium'>Thank You</h4>
                    <p>You may close this window.</p>
                </div>
            </div>
            ) : (
            <StripeEmbeddedCheckout />
            )}
        </>
    )
}