"use client";
import { useState } from "react";

import emailjs from '@emailjs/browser';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod"

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
    name: z.string(),
    email: z.string(),
});

function sendEmail(values: {
    name: string,
    email: string
}) {
    emailjs.send(
        'service_icsdf96',
        'template_o64av9m',
        {
            ...values
        },
        {
            publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!,
        }
    )
    .catch((e) => {
        console.log('error sending form: ', e);
    })
}

export default function Waitlist() {
    const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          name: "",
          email: "",
        },
    });


    const onSubmit = (values: z.infer<typeof formSchema>) => {
        setIsSubmitted(true);

        sendEmail(values);
    }

    return (
        <Form {...form}>
            <form 
                onSubmit={form.handleSubmit(onSubmit)}
                className='md:w-[360px] w-[240px] flex flex-col items-stretch gap-2'
            >
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                    <FormItem>
                        <FormControl>
                            <Input placeholder="Your name" {...field} />
                        </FormControl>
                        <FormDescription />
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                    <FormItem>
                        <FormControl>
                            <Input placeholder="Your email" {...field} />
                        </FormControl>
                        <FormDescription />
                        <FormMessage />
                    </FormItem>
                    )}
                />
                {isSubmitted ? (
                <Button disabled className='font-bold'>
                    You&apos;re in!
                </Button>
                ) : (
                <Button type="submit" className='font-bold'>
                    I&apos;m in!
                </Button>
                )}
            </form>
        </Form>
    )
}