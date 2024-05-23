"use client";
import { useState } from "react";

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
import { Input } from '@/components/ui/input';
import { Button } from "@/components/ui/button";

import type { SupabaseClient } from "@supabase/supabase-js"

const formSchema = z.object({
    email: z.string().min(1, 'Please enter your email.').email(),
})


interface SendPasswordResetEmailProps {
    supabase: SupabaseClient
}

export default function SendPasswordResetEmail({ supabase }: SendPasswordResetEmailProps) {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isComplete, setIsComplete] = useState<boolean>(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {

        setIsLoading(true);
        const { error } = await supabase.auth.resetPasswordForEmail(
            values.email,
            {
                redirectTo: 'https://www.loyaltyexchange.com.au/reset-password',
            }
        );

        if (error) {
            form.setError('email', { message: error.message });
            setIsLoading(false);
            return;
        }

        setIsComplete(true);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='sm:w-[360px] w-[240px] flex flex-col items-stretch gap-6'>
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                                <Input type="email" {...field} />
                            </FormControl>
                            <FormDescription>We will send you an email to change your password.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {isComplete ? (
                <div className='flex items-center justify-center p-3'>
                    <p className='text-center'>Thanks, please check your email.</p>
                </div>
                ) :(
                <Button type="submit" disabled={isLoading} className='font-bold' onClick={() => console.log(form.formState.errors)}>
                    {isLoading? 'Please wait...': 'Send Email'}
                </Button>
                )}
            </form>
        </Form>
    )
}