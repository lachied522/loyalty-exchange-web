"use client";
import { useMemo } from "react";

import { formatCurrency } from "@/utils/functions/formatting";

import { type DashboardState, useDashboardContext } from "../context/DashboardContext";
import { type StoreIDState, useStoreIDContext } from "../../context/StoreIDContext";

import RevenueChart from "./revenue-chart";

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
        <div className='flex flex-col p-2'>
            <div className='flex flex-row items-center justify-between gap-6 px-12 mb-6'>
                <div className='flex flex-col items-start gap-2'>
                    <div className='text-xl font-semibold'>Your Revenue</div>
                </div>

                <div className='flex flex-row items-center gap-2'>
                    <span>Total</span>
                    <span className='text-xl font-semibold'>{formatCurrency(total)}</span>
                </div>
            </div>

            <RevenueChart />
        </div>
    )
}