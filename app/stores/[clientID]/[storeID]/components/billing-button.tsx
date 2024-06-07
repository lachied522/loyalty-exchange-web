"use client";
import { useState } from "react";

import { CircleAlert, Cog } from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

import { createBillingPortalSession } from "../../actions/billing-portal";

import type { ClientData } from "@/types/helpers";

interface BillingButtonProps {
    clientData: ClientData,
    pathname: string
}

export default function BillingButton({ clientData, pathname }: BillingButtonProps) {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const onPaymentsButtonClick = async () => {
        if (isLoading) return; // prevent multiple requests
        setIsLoading(true);

        if (clientData.stripe_customer_id) {
            // create billing portal session and open in new tab
            const res = await createBillingPortalSession(clientData, pathname);
            
            if (!(res && res.url)) {
                // TO DO
                return;
            }
    
            window.open(res.url, '_blank');
            setIsLoading(false);
        } else {
            // client has not been set up in Stripe, open 'payments' route in new tab
            window.open(`/stores/${clientData.id}/payments`, '_blank');
        }
    }

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div className='relative'>
                        {!clientData.stripe_customer_id && (
                            <div className='absolute top-0 right-0 text-red-400'>
                                <CircleAlert size={18} strokeWidth={3} />
                            </div>
                        )}

                        <Button
                            variant='ghost'
                            className='w-full grid grid-cols-[25px,1fr] items-center justify-start hover:text-yellow-400 hover:bg-white'
                            onClick={onPaymentsButtonClick}
                        >
                            <Cog size={20} />
                            <div className='font-semibold text-xs text-left'>Billing</div>
                        </Button>
                    </div>
                </TooltipTrigger>

                {!clientData.stripe_customer_id && (
                    <TooltipContent className='max-w-[360px]'>
                        Click here to enter your payment details.
                        <br />
                        Customers will not be able to earn points at your store until then.
                    </TooltipContent>
                )}
            </Tooltip>
        </TooltipProvider>
    )
}