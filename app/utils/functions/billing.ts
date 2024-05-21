import { createClient } from "@/utils/supabase/server";

import { fetchClientByStoreID } from "@/utils/crud/clients";
import { createCustomerReferralEventFromTotalSpend } from "@/utils/stripe/events";

import type { Tables } from "@/types/supabase";

export async function handleClientChargesForNewTransactions(
    transactions: Omit<Tables<'transactions'>, 'id'>[]
) {
    // stripe cannot handle more than one concurrent request per customer
    // customer spending must be grouped by client
    // TO DO: group by client instead of store
    const storeMap: { [key: string]: number } = {};
    for (const transaction of transactions) {
        // only count positive amounts
        // if amount is negative it likely relates to a refund
        if (transaction.amount > 0) {
            storeMap[transaction.store_id] = (storeMap[transaction.store_id] || 0) + transaction.amount;
        };
    }

    const supabase = createClient();

    for (const storeID in storeMap) {
        try {
            // get client owner of store
            const clientData = await fetchClientByStoreID(storeID, supabase);
        
            if (!(clientData && clientData.stripe_customer_id)) {
                console.log('Client not found or client does not have Stripe customer id');
                return;
            }
            
            await createCustomerReferralEventFromTotalSpend(
                storeMap[storeID],
                clientData
            );
    
            console.log(
                'New customer transaction: ',
                { amount: storeMap[storeID], user: transactions[0].user_id }
            );
        } catch (error) {
            console.error('Error creating client charge: ', error);
        }
    }
}