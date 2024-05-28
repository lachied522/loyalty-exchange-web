"use client";
import { useMemo } from "react";

import { type DashboardState, useDashboardContext } from "../context/DashboardContext";

import { columns } from "./columns/transactions";
import DataTable from "./data-table";

export default function RecentTransactions() {
    const { customerData, isLoading } = useDashboardContext() as DashboardState;

    const formattedData = useMemo(() => {
        if (!customerData) return [];

        const _formattedData = [];
        for (const record of customerData) {
            const name = record.users?.name || 'n/a';

            for (const transaction of record.users!.transactions) {
                _formattedData.push({
                    id: record.user_id,
                    name,
                    date: transaction.date,
                    points: transaction.points,
                    amount: transaction.amount,
                });
            }
        }

        return _formattedData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [customerData]);

    return (
        <div className='flex flex-col gap-4'>
            <div className='w-full flex flex-row items-center justify-between'>
                <div className='text-xl font-semibold'>Recent Customer Transactions</div>
            </div>

            <DataTable columns={columns} data={formattedData} />
        </div>
    )
}