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
    name: z.string(),
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
        },
    });

    useEffect(() => {
        form.reset({
            name: storeData.name,
        });
    }, [storeData.name, form]);

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsLoading(true);
        await updateStoreRecordAndUpdateState(values);
        setIsLoading(false);
    }

    return (
        <div className='flex flex-col items-stretch justify-between gap-4 p-6'>
            <div className='flex sm:flex-row flex-col items-start sm:items-end justify-between gap-2'>
                <div className='flex flex-col sm:items-start gap-2'>
                    <div className='w-full flex flex-row items-center'>
                        <div className='text-xl font-semibold'>Store Name</div>
                    </div>
                    <p>What is the name of your store?</p>
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
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
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
                </form>
            </Form>
        </div>
    )
}