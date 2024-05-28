"use client";
import { useState, useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Pencil } from "lucide-react";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { Button } from "@/components/ui/button";

import { type CustomiseState, useCustomiseContext } from "../context/CustomiseContext";
import { type StoreIDState, useStoreIDContext } from "../../context/StoreIDContext";

const formSchema = z.object({
    address_line_1: z.string().min(1, 'Required'),
    city: z.string().min(1, 'Required'),
    state: z.string().min(1, 'Required'),
    postcode: z.string().min(1, 'Required'),
});

export default function StoreLocation() {
    const { storeData } = useStoreIDContext() as StoreIDState;
    const { updateStoreRecordAndUpdateState } = useCustomiseContext() as CustomiseState;
    const [isEditting, setIsEditting] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            address_line_1: storeData.address_line_1 || '',
            city: storeData.city || '',
            state: storeData.state || 'VIC',
            postcode: storeData.postcode || '',
        },
    });

    useEffect(() => {
        form.reset({
            address_line_1: storeData.address_line_1 || '',
            city: storeData.city || '',
            state: storeData.state || 'VIC',
            postcode: storeData.postcode || '',
        });
    }, [storeData, form]);

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsLoading(true);
        try {
            await updateStoreRecordAndUpdateState(values);
        } catch (e) {
            form.setError('postcode', { message: 'Something went wrong. Your changes were not saved.' });
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
                    <div className='flex flex-col gap-2'>
                        <div className='w-full flex flex-row items-center'>
                            <div className='text-xl font-semibold'>Location</div>
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
                    name="address_line_1"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Address Line 1</FormLabel>
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
                    name="city"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder='Melbourne'
                                    maxLength={24}
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
                    name="state"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>State</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder='VIC'
                                    maxLength={3}
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
                    name="postcode"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Postcode</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder='3001'
                                    maxLength={4}
                                    disabled={!isEditting}
                                    className='max-w-[360px]'
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </form>
        </Form>
    )
}