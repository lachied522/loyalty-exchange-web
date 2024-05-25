"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { createClient } from "@/utils/supabase/client";
import { insertStoreRecord } from "@/utils/crud/stores";

import { type ClientIDState, useClientIDContext } from "../../../context/ClientIDContext";

const formSchema = z.object({
    name: z.string().min(2, 'Required').max(32),
    vendor_name: z.string().min(1, 'Required'),
    address_line_1: z.string().min(1, 'Required'),
    city: z.string().min(1, 'Required'),
    state: z.string().min(1, 'Required'),
    postcode: z.string().min(1, 'Required'),
})

export default function CreateStoreForm() {
    const { clientData, dispatch } = useClientIDContext() as ClientIDState;
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {},
    });
    const router = useRouter();

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsLoading(true);

        try {
            // insert store record and update state
            const store = await insertStoreRecord(
                { ...values, client_id: clientData.id },
                createClient()
            );

            dispatch({
                type: 'INSERT_NEW_STORE',
                payload: {
                    data: store,
                }
            })

            router.replace(`/stores/${clientData.id}/${store.id}/customise`);
        } catch (e) {
            setError(true);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className='max-h-[90vh] space-y-8 p-2 mb-6 overflow-auto'>                    
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Store Name</FormLabel>
                                <FormDescription>
                                    What is your store called?
                                </FormDescription>
                                <FormControl>
                                    <Input
                                        maxLength={32}
                                        placeholder="My Store"
                                        {...field} 
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="address_line_1"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Address Line 1</FormLabel>
                                <FormDescription>
                                    Where is your store located?
                                </FormDescription>
                                <FormControl>
                                    <Input
                                        placeholder='100 Main Street'
                                        maxLength={64}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className='grid md:grid-cols-[1.5fr_0.75fr_0.75fr] items-stretch gap-2'>
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
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="vendor_name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Vendor Name</FormLabel>
                                <FormDescription>
                                    IMPORTANT! This is the name that appears on customer&apos;s statements.
                                    <br /><br />
                                    We require this to track your customer&apos;s spending.
                                </FormDescription>
                                <FormControl>
                                    <Input
                                        placeholder="MY STORE MELBOURNE"
                                        {...field} 
                                    />
                                </FormControl>
                                
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className='w-full flex flex-row items-center justify-end'>
                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="font-semibold"
                    >
                        {isLoading? 'Please wait...': 'Next'}
                    </Button>
                </div>
            </form>
        </Form>
    )
}