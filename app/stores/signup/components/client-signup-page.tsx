"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

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

async function clientSignup({
    first_name,
    last_name,
    email,
    mobile,
    password,
}: z.infer<typeof formSchema>) {
    const supabase = createClient();

    // create auth user with 'client' role
    const { data: { user }, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
            // emailRedirectTo: redirectTo,
            data: {
                role: 'client',
                first_name,
                last_name,
                mobile,
            }
          }
    })

    if (authError) {
        throw authError;
    }

    if (!user) {
        throw new Error('Something went wrong. Please try again later.');
    }

    return user.id;
}

const formSchema = z.object({
    first_name: z.string().min(1, 'Required'),
    last_name: z.string().min(1, 'Required'),
    mobile: z.string().min(1, 'Required'),
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
    const searchParams = useSearchParams();
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            first_name: '',
            last_name: '',
            mobile: '',
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

        try {
            const clientID = await clientSignup(values);
    
            const redirectUrl = searchParams.get('redirect');
            if (redirectUrl) {
                router.replace(redirectUrl);
            } else {
                // redirect to payments
                router.replace(`/stores/${clientID}/payments`);
            }
        } catch (error: any) {
            form.setError('passwordConfirm', { message: error.message || 'Could not login. Please try again later.' });
            setIsLoading(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='md:w-[360px] w-[240px] flex flex-col items-stretch gap-2'>
                <FormField
                    control={form.control}
                    name="first_name"
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
                    name="last_name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Last Name</FormLabel>
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
                    name="mobile"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Contact Mobile</FormLabel>
                            <FormControl>
                                <Input {...field} />
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

                <Button
                    type="submit"
                    disabled={isLoading}
                    className='font-bold mt-2'
                >
                    {isLoading? 'Please wait...': 'Signup'}
                </Button>

                <div className='flex flex-row justify-between text-base mt-2'>
                    Already have an account?
                    <Link href='/stores/login' className='text-blue-400 underline'>Login</Link>
                </div>
            </form>
        </Form>
    )
}