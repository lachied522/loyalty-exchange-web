"use client";
import { useState, useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Pencil } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
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

const formSchema = z.object({
    name: z.string(),
});

export default function StoreName() {
    const { selectedStoreData, updateStoreRecordAndUpdateState } = useCustomiseContext() as CustomiseState;
    const [isEditting, setIsEditting] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: selectedStoreData.name,
        },
    });

    useEffect(() => {
        form.reset({
            name: selectedStoreData.name,
        });
    }, [selectedStoreData, form]);

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsLoading(true);
        await updateStoreRecordAndUpdateState(values);
        setIsLoading(false);
    }

    return (
        <Card>
            <CardContent className='flex flex-col items-stretch justify-between gap-4 p-6'>
                <div className='w-full flex flex-row items-center'>
                    <div className='text-xl font-semibold'>Store Name</div>
                </div>
                <p>What is the name of your store?</p>

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

                        <div className='w-full flex justify-end'>
                            {isLoading ? (
                            <Button
                                type='button'
                                variant='secondary'
                                disabled
                            >
                                Please wait...
                            </Button> 
                            ) : (
                            <>
                                {isEditting ? (
                                <Button
                                    type='submit'
                                    disabled={!isEditting}
                                    onClick={() =>  setIsEditting(false)}
                                >
                                    Save
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
                            )}
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}