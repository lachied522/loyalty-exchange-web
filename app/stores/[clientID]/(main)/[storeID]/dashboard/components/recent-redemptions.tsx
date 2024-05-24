"use client";
import { useMemo } from "react";

import { type DashboardState, useDashboardContext } from "../context/DashboardContext";

import { columns } from "./columns/redemptions";
import DataTable from "./data-table";

export default function RecentRedemptions() {
    const { customerData, isLoading } = useDashboardContext() as DashboardState;

    const formattedData = useMemo(() => {
        if (!customerData) return [];

        const _formattedData = [];
        
        for (const record of customerData) {
            const name = record.users?.name || 'n/a';

            for (const redemption of record.users!.redeemed) {
                _formattedData.push({
                    name,
                    date: redemption.redeemed_at,
                    title: redemption.rewards?.title || ''
                });
            }
        }

        return _formattedData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [customerData]);

    return (
        <div className='flex flex-col gap-4'>
            <div className='w-full flex flex-row items-center justify-between'>
                <div className='text-xl font-semibold'>Recent Reward Redemptions</div>
            </div>

            <DataTable columns={columns} data={formattedData} />
        </div>
    )
}