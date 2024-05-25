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
} from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { Button } from "@/components/ui/button";

import { type CustomiseState, useCustomiseContext } from "../context/CustomiseContext";
import { type StoreIDState, useStoreIDContext } from "../../context/StoreIDContext";

const formSchema = z.object({
    address_line_1: z.string(),
    city: z.string(),
    state: z.string().default('VIC'),
    postcode: z.string(),
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
        await updateStoreRecordAndUpdateState(values);
        setIsLoading(false);
    }

    return (
        <div className='flex flex-col items-stretch justify-between gap-4 p-6'>
            <div className='flex flex-row items-end justify-between'>
                <div className='flex flex-col gap-2'>
                    <div className='w-full flex flex-row items-center'>
                        <div className='text-xl font-semibold'>Location</div>
                    </div>
                    <p>Where is your store located?</p>
                </div>

                <>
                    {isEditting ? (
                    <Button
                        type='submit'
                        disabled={!isEditting}
                        onClick={() =>  setIsEditting(false)}
                    >
                        {isLoading? 'Loading...': 'Save'}
                    </Button>
                    ) : (
                    <Button
                        type='button'
                        variant='secondary'
                        onClick={() => setIsEditting(true)}
                        className='flex items-center gap-1'
                    >
                        <Pencil size={16} />
                        Edit
                    </Button>
                    )}
                </>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
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
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription />
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
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription />
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
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription />
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
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription />
                            </FormItem>
                        )}
                    />
                </form>
            </Form>
        </div>
    )
}