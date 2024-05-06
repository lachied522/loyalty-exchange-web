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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { Button } from "@/components/ui/button";

const formSchema = z.object({
    email: z.string(),
    password: z.string()
});

export default function LoginForm() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const searchParams = useSearchParams();
    const router = useRouter();

    const supabase = createClient();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsLoading(true);
        const { data, error } = await supabase.auth.signInWithPassword({
            email: values.email,
            password: values.password
        });

        if (error) {
            console.log(error);
            setIsLoading(false);
            return;
        }

        const redirectUrl = searchParams.get('redirect');
        if (redirectUrl) {
            router.replace(redirectUrl)
        } else {
            router.replace('/'); // TO DO: redirect to account page
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='w-[360px] flex flex-col items-stretch gap-2'>
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormDescription />
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
                        <FormDescription />
                    </FormItem>
                    )}
                />
                <Button type="submit" disabled={isLoading} className='font-bold' onClick={() => console.log(form.formState.errors)}>
                    Login
                </Button>
            </form>
        </Form>
    )
}