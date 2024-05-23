"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod"

import { createClient } from "@/utils/supabase/client";

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

import { type ClientState, useClientContext } from '../../context/ClientContext';

const formSchema = z.object({
    email: z.string().email().min(1, { message: 'Please enter a valid email.' }),
    password: z.string().min(6, 'Password must be at least 6 characters.'),
    passwordConfirm: z.string(),
})
.refine((obj) => obj.password === obj.passwordConfirm, {
    message: 'Passwords do not match',
    path: ['passwordConfirm']
});

export default function CreatePasswordForm() {
    const { clientData } = useClientContext() as ClientState;
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const searchParams = useSearchParams();
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: clientData.email || '', // email should already exist
            password: '',
            passwordConfirm: '',
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        const supabase = createClient();

        setIsLoading(true);

        // create new user in supabase with 'client' role
        const { data, error } = await supabase.auth.signUp({
            email: values.email,
            password: values.password,
            options: {
                // emailRedirectTo: redirectTo,
                data: {
                  role: 'client',
                }
              }
        });

        if (error) {
            form.setError('passwordConfirm', { message: error.message });
            setIsLoading(false);
            return;
        }

        const redirectUrl = searchParams.get('redirect');
        if (redirectUrl) {
            router.replace(redirectUrl);
        } else {
            router.replace(`/stores/${clientData.id}/dashboard`);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='md:w-[360px] w-[240px] flex flex-col items-stretch gap-2'>
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input {...field} disabled={!!clientData.email} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                            <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="passwordConfirm"
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
                    {isLoading? 'Please wait...': 'Submit'}
                </Button>
            </form>
        </Form>
    )
}