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
    password: z.string(),
    passwordConfirm: z.string(),
})
.refine((obj) => obj.password === obj.passwordConfirm, {
    message: "Passwords do not match"
});


interface CreatePasswordFormProps {
    clientID: string
    email: string | null
}

export default function CreatePasswordForm({ clientID, email }: CreatePasswordFormProps) {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const searchParams = useSearchParams();
    const router = useRouter();

    const supabase = createClient();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: email || "", // email should already exist
            password: "",
            passwordConfirm: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
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
            console.log(error);
            setIsLoading(false);
            return;
        }

        const redirectUrl = searchParams.get('redirect');
        if (redirectUrl) {
            router.replace(redirectUrl)
        } else {
            router.replace(`/stores/${clientID}/`);
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
                                <Input {...field} disabled={!!email} />
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
                <FormField
                    control={form.control}
                    name="passwordConfirm"
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
                    Submit
                </Button>
            </form>
        </Form>
    )
}