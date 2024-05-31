"use client";
import { useEffect, useMemo, useState } from 'react';

import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import { formatCurrency } from '@/utils/functions/formatting';

import { type DashboardState, useDashboardContext } from "../context/DashboardContext";

function createEmptyDateMap() {
    // want labels for last 12 months to appear on XAxis
    // create empty data for this effect
    const date = new Date();
    date.setDate(1); // set to first of month

    const dateMap: { [key: string]: { amount: number, count: number } } = {};
    for (let i = 0; i < 12; i++) {
        dateMap[date.getTime()] = { amount: 0, count: 0};
        date.setMonth(date.getMonth() - 1);
    }
    
    return dateMap;
}

const getXAxisDomain = () => {
    // want domain to be last 12 months
    const now = new Date();
    const domainStart = new Date();
    domainStart.setFullYear(now.getFullYear() - 1);

    return [
        domainStart.getTime(),
        now.getTime()
    ]
}

function formatXAxis(timestamp: string) {
    const date = new Date(Number(timestamp));
    const options: Intl.DateTimeFormatOptions = { month: 'short', year: '2-digit' };
    return  new Intl.DateTimeFormat('en-US', options).format(date);
}

export default function RevenueChart() {
    const { customerData } = useDashboardContext() as DashboardState;
    const [height, setHeight] = useState<number>();

    useEffect(() => {
        const handleResize = () => {
            setHeight(window.innerWidth > 1024? 540: 320);
        };

        handleResize();

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize)
        };
    }, []);

    const data = useMemo(() => {
        if (!customerData) return [];

        // map date to amount spent by customers (amount) and number of rewards redeemed (count)
        const dateMap = createEmptyDateMap();
        for (const record of customerData) {
            for (const transaction of record.users!.transactions) {
                const timestamp = new Date(transaction.date).setHours(0, 0, 0, 0); // round to nearest day                
                if (dateMap[timestamp]) {
                    dateMap[timestamp].amount += transaction.amount;
                } else {
                    dateMap[timestamp] = { amount: transaction.amount, count: 0 };
                }
            }
            for (const reward of record.users!.redeemed) {
                const timestamp = new Date(reward.redeemed_at).setHours(0, 0, 0, 0);
                if (dateMap[timestamp]) {
                    dateMap[timestamp].count += 1;
                } else {
                    dateMap[timestamp] = { amount: 0, count: 1 };
                }
            }
        }

        return Object.entries(dateMap)
        .map(([timestamp, { amount, count }]) => ({ timestamp, amount, count }))
        .sort((a, b) => Number(b.timestamp) - Number(a.timestamp));
    }, [customerData]);

    return (
        <>
            {data.length ? (
            <ResponsiveContainer height={height} width='100%'>
                <ComposedChart
                    data={data}
                    margin={{
                        top: 0,
                        right: 20,
                        left: 20,
                        bottom: 12,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        type="number"
                        scale="time"
                        dataKey="timestamp"
                        domain={getXAxisDomain()}
                        tickFormatter={(timestamp: string) => formatXAxis(timestamp)}
                        tickCount={11}
                        minTickGap={31}
                        interval='preserveStart'
                    />
                    <YAxis
                        yAxisId="left"
                        tickFormatter={(amount: number) => formatCurrency(amount)}
                        domain={[0, 'dataMax + 100']}
                    />
                    <YAxis
                        yAxisId="right"
                        orientation="right"
                        allowDecimals={false}
                        domain={[0, 'dataMax + 10']}
                    />
                    <Legend />
                    <Bar
                        name="Rewards Redeemed"
                        yAxisId="right"
                        type="monotone"
                        dataKey="count"
                        stroke="#FECC15"
                        fill="#FECC15"
                        isAnimationActive={false}
                    />
                    <Line
                        name="Customer Transactions"
                        yAxisId="left"
                        type="monotone"
                        dataKey="amount"
                        stroke="rgb(34 197 94)"
                        isAnimationActive={false}
                    />
                </ComposedChart>
            </ResponsiveContainer>
            ) : (
            <div className='h-[240px] w-full flex items-center justify-center'>
                <h3>Nothing to display.</h3>
            </div>
            )}
        </>
    )
}