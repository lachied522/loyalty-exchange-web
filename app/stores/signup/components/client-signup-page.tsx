"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod"

import { createClient } from "@/utils/supabase/client";

import {
  Form,
  FormControl,
  FormMessage,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
} from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { Button } from "@/components/ui/button";

async function clientSignup(
    name: string,
    email: string,
    password: string,
) {
    const supabase = createClient();

    // create auth user with 'client' role
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
            // emailRedirectTo: redirectTo,
            data: {
                role: 'client',
                first_name: name,
                last_name: ''
            }
          }
    });

    if (authError || !authData.user) {
        console.log({ authError });
        return;
    }

    return authData.user.id;
}

const formSchema = z.object({
    name: z.string().min(1, 'Required'),
    email: z.string().min(1, 'Required'),
    password: z.string().min(6, 'Password must be 6 characters long'),
    passwordConfirm: z.string(),
})
.refine((obj) => obj.password === obj.passwordConfirm, {
    message: 'Passwords do not match',
    path: ['passwordConfirm']
});

export default function ClientSignUpPage() {
    const [email, setEmail] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    const searchParams = useSearchParams();
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: searchParams.get('email') || '',
            password: "",
            passwordConfirm: "",
        },
    });

    useEffect(() => {
        if (searchParams.get('email')) {
            setEmail(searchParams.get('email'));
        }
    }, [searchParams, setEmail]);

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsLoading(true);

        const _clientID = await clientSignup(
            values.name,
            values.email,
            values.passwordConfirm,
        )

        if (!_clientID) {
            setError(true);
            setIsLoading(false);
            return;
        }

        const redirectUrl = searchParams.get('redirect');
        if (redirectUrl) {
            router.replace(redirectUrl);
        } else {
            // redirect to payments
            router.replace(`/stores/${_clientID}/payments`);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='md:w-[360px] w-[240px] flex flex-col items-stretch gap-2'>
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input {...field} disabled={!!email} />
                            </FormControl>
                            {email && <FormDescription>We already have your email.</FormDescription>}
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
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                            <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <Button
                    type="submit"
                    disabled={isLoading}
                    className='font-bold mt-2'
                >
                    {isLoading? 'Please wait...': 'Signup'}
                </Button>
            </form>
        </Form>
    )
}