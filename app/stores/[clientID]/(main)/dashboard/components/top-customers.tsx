"use client";
import { useMemo, useState } from "react";

import { Card, CardContent } from "@/components/ui/card";

import { type DashboardState, useDashboardContext } from "../context/DashboardContext";

import { columns } from "./top-customers-table/columns";
import CustomersTable from "./top-customers-table/table";

export default function TopCustomers() {
    const { selectedStoreID, customerDataMap } = useDashboardContext() as DashboardState;
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const formattedData = useMemo(() => {
        if (!(selectedStoreID in customerDataMap)) return [];

        const _formattedData = [];
        
        for (const record of customerDataMap[selectedStoreID]) {
            let dollarsSpent = 0;
            let lastPurchase = record.users!.transactions[0].date;

            for (const transaction of record.users!.transactions) {
                dollarsSpent += transaction.amount;

                if (new Date(lastPurchase).getTime() < new Date(transaction.date).getTime()) {
                    lastPurchase = transaction.date;
                }
            }

            _formattedData.push({
                name: record.users?.name || 'n/a',
                points: record.balance,
                dollarsSpent,
                lastPurchase,
            })
        }

        return _formattedData.sort((a, b) => b.dollarsSpent - a.dollarsSpent);
    }, [customerDataMap, selectedStoreID]);

    return (
        <Card>
            <CardContent className='flex flex-col items-stretch gap-4 p-6'>
                <div className='w-full flex flex-row items-center'>
                    <div className='text-xl font-semibold'>Your Top Customers</div>
                </div>

                <CustomersTable columns={columns} data={formattedData ?? []} />
            </CardContent>
        </Card>
    )
}