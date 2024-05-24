"use client";
import { useMemo } from "react";

import { type DashboardState, useDashboardContext } from "../context/DashboardContext";
import { type StoreIDState, useStoreIDContext } from "../../context/StoreIDContext";

import { formatCurrency } from "@/utils/functions/formatting";

export default function TotalRevenue() {
    const { storeData } = useStoreIDContext() as StoreIDState;
    const { customerData } = useDashboardContext() as DashboardState;

    const total = useMemo(() => {
        if (!customerData) return 0;

        let _total = 0;
        for (const record of customerData) {
            _total += record.users?.transactions.reduce((acc, obj) => acc + obj.amount, 0) || 0
        }
        return _total;
    }, [customerData]);

    return (
        <div className='flex items-start'>
            <div className='flex flex-row items-center border border-neutral-200 px-5 py-3 gap-6 rounded-md'>
                <div className='flex flex-col items-start gap-2'>
                    <div className='text-xl font-semibold'>Total Revenue</div>
                    <div>Since {new Date(storeData.created_at).toLocaleDateString()}</div>
                </div>

                <div className='text-xl font-semibold'>
                    {formatCurrency(total)}
                </div>
            </div>
        </div>
    )
}