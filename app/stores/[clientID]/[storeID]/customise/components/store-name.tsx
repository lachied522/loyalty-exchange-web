"use client";
import { useState, useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Pencil } from "lucide-react";

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { Button } from "@/components/ui/button";

import { type CustomiseState, useCustomiseContext } from "../context/CustomiseContext";
import { type StoreIDState, useStoreIDContext } from "../../context/StoreIDContext";
import SampleTransactionButton from "../../components/sample-transaction-button";

const formSchema = z.object({
    name: z.string().min(1, 'Required'),
    vendor_name: z.string().min(1, 'Required'),
});

export default function StoreName() {
    const { storeData } = useStoreIDContext() as StoreIDState;
    const { updateStoreRecordAndUpdateState } = useCustomiseContext() as CustomiseState;
    const [isEditting, setIsEditting] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: storeData.name,
            vendor_name: storeData.vendor_name,
        },
    });

    useEffect(() => {
        form.reset({
            name: storeData.name,
            vendor_name: storeData.vendor_name,
        });
    }, [form, storeData.name, storeData.vendor_name]);

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsLoading(true);
        try {
            await updateStoreRecordAndUpdateState(values);
        } catch (e) {
            form.setError('vendor_name', { message: 'Something went wrong. Your changes were not saved.' });
        } finally {
            setIsLoading(false);
            setIsEditting(false);
        }
    }

    const toggleIsEditting = () => {
        // delay by 100ms to prevent onSubmit being called by the same event
        setTimeout(() => {
            setIsEditting((curr) => !curr);
        }, 100);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col items-stretch justify-between gap-4 p-6'>
                <div className='flex sm:flex-row flex-col items-start sm:items-end justify-between gap-2'>
                    <div className='flex flex-col sm:items-start gap-2'>
                        <div className='w-full flex flex-row items-center'>
                            <div className='text-xl font-semibold'>Store Details</div>
                        </div>
                    </div>

                    {isEditting ? (
                    <Button
                        type='submit'
                        disabled={!isEditting}
                    >
                        {isLoading? 'Loading...': 'Save'}
                    </Button>
                    ) : (
                    <Button
                        type='button'
                        variant='secondary'
                        onClick={toggleIsEditting}
                        className='flex items-center gap-1'
                    >
                        <Pencil size={16} />
                        Edit
                    </Button>
                    )}
                </div>

                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder='100 Main Street'
                                    maxLength={64}
                                    disabled={!isEditting}
                                    className='max-w-[360px]'
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="vendor_name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Vendor Name</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder='100 Main Street'
                                    maxLength={64}
                                    disabled={!isEditting}
                                    className='max-w-[360px]'
                                    {...field}
                                />
                            </FormControl>

                            {isEditting && (
                            <FormDescription>
                                IMPORTANT! This is the name that appears on customer&apos;s statements.
                                <SampleTransactionButton>
                                    <span className='underline cursor-pointer ml-1'>See example.</span>
                                </SampleTransactionButton>
                                <br />
                                We require this to be accurate to track your customer&apos;s spending.
                            </FormDescription>
                            )}
                            
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </form>
        </Form>            
    )
}