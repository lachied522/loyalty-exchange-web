"use client";
import { useMemo } from "react";

import { type DashboardState, useDashboardContext } from "../context/DashboardContext";

import { columns } from "./columns/customers";
import DataTable from "./data-table";

export default function TopCustomers() {
    const { customerData, isLoading } = useDashboardContext() as DashboardState;

    const formattedData = useMemo(() => {
        if (!customerData) return [];

        const _formattedData = [];
        for (const record of customerData) {
            let dollarsSpent = 0;
            let lastPurchase = record.users!.transactions[0].date;

            for (const transaction of record.users!.transactions) {
                dollarsSpent += transaction.amount;

                if (new Date(lastPurchase).getTime() < new Date(transaction.date).getTime()) {
                    lastPurchase = transaction.date;
                }
            }

            _formattedData.push({
                id: record.users!.id,
                name: record.users!.name || 'n/a',
                points: record.balance,
                dollarsSpent,
                lastPurchase,
            })
        }

        return _formattedData.sort((a, b) => b.dollarsSpent - a.dollarsSpent);
    }, [customerData]);

    return (
        <div className='flex flex-col items-stretch gap-4'>
            <div className='w-full flex flex-row items-center'>
                <div className='text-xl font-semibold'>Your Top Customers</div>
            </div>

            <DataTable columns={columns} data={formattedData ?? []} />
        </div>
    )
}