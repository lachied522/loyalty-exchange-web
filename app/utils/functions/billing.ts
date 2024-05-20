import { createClient } from "@/utils/supabase/server";

import { fetchClientByStoreID } from "@/utils/crud/clients";
import { createCustomerReferralEventFromTransaction } from "@/utils/stripe/events";

import type { Tables } from "@/types/supabase";

export async function createClientChargeForCustomerTransaction(
    transaction: Omit<Tables<'transactions'>, 'id'>
) {
    try {
        if (transaction.amount < 0) {
            // if amount is negative, transaction likely relates to a refund
            console.log('Cannot charge for negative transaction amount');
            return;
        }
        
        const supabase = createClient();
        // get client owner of store
        const clientData = await fetchClientByStoreID(transaction.store_id, supabase);
    
        if (!(clientData && clientData.stripe_customer_id)) {
            console.log('Client not found or client does not have Stripe customer id');
            return;
        }
        
        await createCustomerReferralEventFromTransaction(transaction, clientData.stripe_customer_id);

        console.log(
            'New customer transaction: ',
            { amount: transaction.amount, user: transaction.user_id }
        );
        
    } catch (error) {
        console.log('Error creating client charge: ', error);
    }
}