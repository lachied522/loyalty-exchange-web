"use client";
import { useMemo, useState } from "react";

import { Card, CardContent } from "@/components/ui/card";

import { type DashboardState, useDashboardContext } from "../context/DashboardContext";

import { columns } from "./recent-transactions-table/columns";
import RecentTransactionsTable from "./recent-transactions-table/table";

export default function RecentTransactions() {
    const { selectedStoreID, customerDataMap  } = useDashboardContext() as DashboardState;
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const formattedData = useMemo(() => {
        if (!(selectedStoreID in customerDataMap)) return [];

        const _formattedData = [];
        
        for (const record of customerDataMap[selectedStoreID]) {
            const name = record.users?.name || 'n/a';

            for (const transaction of record.users!.transactions) {
                _formattedData.push({
                    name,
                    date: transaction.date,
                    points: transaction.points,
                    amount: transaction.amount,
                });
            }
        }

        return _formattedData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [customerDataMap, selectedStoreID]);

    return (
        <Card>
            <CardContent className='flex flex-col gap-4 p-6'>
                <div className='w-full flex flex-row items-center justify-between'>
                    <div className='text-xl font-semibold'>Recent Customer Transactions</div>
                </div>

                <RecentTransactionsTable columns={columns} data={formattedData} />
            </CardContent>
        </Card>
    )
}