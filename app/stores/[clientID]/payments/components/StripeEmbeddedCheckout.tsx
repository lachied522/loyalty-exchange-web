"use client";
import { useEffect, useState } from 'react';
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout
} from '@stripe/react-stripe-js';

import getStripe from '@/utils/stripe/client';

import { type ClientIDState, useClientIDContext } from '../../context/ClientIDContext';

import { createCheckoutSession } from '../../actions/checkout-session';

export default function StripeEmbeddedCheckout() {
    const { clientData } = useClientIDContext() as ClientIDState;
    const [clientSecret, setClientSecret] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = false;
        getClientSecret();

        async function getClientSecret() {
            if (isMounted) return;
            
            const { client_secret } = await createCheckoutSession(clientData);

            setClientSecret(client_secret);

            isMounted = true;
        }
    }, [setClientSecret, clientData]);

    return (
        <div className='min-w-[100vw] sm:p-12 p-6 bg-white'>
            <EmbeddedCheckoutProvider
                stripe={getStripe()}
                options={{ clientSecret }}
            >
                <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
        </div>
  )
}