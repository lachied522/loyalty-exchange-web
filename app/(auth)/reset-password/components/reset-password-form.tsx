"use client";
import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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

import type { SupabaseClient } from "@supabase/supabase-js";
import { CircleCheckBig } from "lucide-react";

const formSchema = z.object({
    newPassword: z.string().min(6, 'Password must be at least 6 characters.'),
    newPasswordConfirm: z.string(),
})
.refine((obj) => obj.newPassword === obj.newPasswordConfirm, {
    message: 'Passwords do not match',
    path: ['newPasswordConfirm']
});

interface ResetPasswordProps {
    supabase: SupabaseClient
}

export default function ResetPasswordForm({ supabase }: ResetPasswordProps) {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isComplete, setIsComplete] = useState<boolean>(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            newPassword: '',
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {

        setIsLoading(true);
        const { data, error } = await supabase.auth.updateUser({
            password: values.newPassword
        });

        if (error) {
            form.setError('newPasswordConfirm', { message: error.message });
            setIsLoading(false);
            return;
        }

        setIsComplete(true);
    }

    return (
        <>
            {isComplete? (
            <div className='flex flex-row items-center gap-3'>
                <CircleCheckBig size={32} color='black' />
                <div className='text-center'>
                    <p>Your password has been reset</p>
                    <p>You may close this tab.</p>
                </div>
            </div>
            ) : (
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='sm:w-[360px] w-[240px] flex flex-col items-stretch gap-6'>
                    <FormField
                        control={form.control}
                        name="newPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>New Password</FormLabel>
                                <FormControl>
                                    <Input type="password" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="newPasswordConfirm"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Confirm Password</FormLabel>
                                <FormControl>
                                    <Input type="password" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" disabled={isLoading} className='font-bold' onClick={() => console.log(form.formState.errors)}>
                        Submit
                    </Button>
                </form>
            </Form>
            )}
        </>
    )
}