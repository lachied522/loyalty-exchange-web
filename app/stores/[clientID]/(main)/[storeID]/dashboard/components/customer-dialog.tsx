"use state";
import { useMemo } from "react";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { formatAmount, formatDate } from "@/utils/functions/formatting";

import { type DashboardState, useDashboardContext } from "../context/DashboardContext";

interface CustomerDialogProps {
    id?: any // row data passed from data table component has no information on 'id'
    children: React.ReactNode
}

export default function CustomerDialog({ id, children }: CustomerDialogProps) {
    const { customerData } = useDashboardContext() as DashboardState;

    const customer = useMemo(() => {
        if (!customerData) return;
        const _customer = customerData.find((obj) => obj.user_id === id);

        return _customer? {
            balance: _customer.balance,
            name: _customer.users!.name,
            transactions: (
                _customer.users!.transactions
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, 5)
            ),
            redeemed: (
                _customer.users!.redeemed
                .sort((a, b) => new Date(b.redeemed_at).getTime() - new Date(a.redeemed_at).getTime())
                .slice(0, 3)
            )
        }: undefined
    }, [customerData, id]);

    return (
        <>
            {customer? (
            <Dialog>
                <DialogTrigger
                    className='cursor-pointer'
                    asChild
                >
                    {children}
                </DialogTrigger>
                <DialogContent className='md:min-w-[760px]'>
                    <DialogHeader>
                        <DialogTitle>
                            Your Customer: {customer.name}
                        </DialogTitle>
                    </DialogHeader>

                    <div className='flex flex-col'>
                        <span className='font-medium text-lg'>Current Points Balance</span>
                        {customer.balance.toLocaleString()}
                    </div>

                    <div>Recent Transactions</div>
                    <div className="rounded-md border overflow-hidden mx-2">
                        <Table>
                            <TableHeader>
                                <TableRow className='bg-neutral-100 hover:bg-neutral-100'>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Points Earned</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {customer.transactions.map((obj) => (
                                <TableRow>
                                    <TableCell>{formatDate(obj.date)}</TableCell>
                                    <TableCell className='text-green-400'>
                                        {formatAmount(obj.amount)}
                                    </TableCell>
                                    <TableCell>{obj.points}</TableCell>
                                </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    <div>Recent Redemptions</div>
                    <div className="rounded-md border overflow-hidden mx-2">
                        <Table>
                            <TableHeader>
                                <TableRow className='bg-neutral-100 hover:bg-neutral-100'>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Reward</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {customer.redeemed.map((obj) => (
                                <TableRow>
                                    <TableCell>{formatDate(obj.redeemed_at)}</TableCell>
                                    <TableCell className='text-green-400'>{obj.rewards?.title}</TableCell>
                                </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>                    
                </DialogContent>
            </Dialog>
            ) : (
            <>{children}</>
            )}
        </>
    )
}