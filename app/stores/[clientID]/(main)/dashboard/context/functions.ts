"use client";

import { createClient } from "@/utils/supabase/client";

export async function fetchCustomersByStoreID(storeID: string) {
    const supabase = createClient();

    const { data, error } = await supabase
    .from("points")
    .select("*, users(id, name, transactions(*), redeemed(*, rewards(*)))")
    .eq("store_id", storeID)
    .eq("users.transactions.store_id", storeID)
    .eq("users.redeemed.rewards.store_id", storeID);

    if (error) {
        console.log(error);
        return [];
    }

    return data;
}