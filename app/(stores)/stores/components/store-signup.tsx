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
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
    storeName: z.string(),
    location: z.string(),
    contactName: z.string(),
    contactEmail: z.string(),
    contactNumber: z.string(),
});

function sendEmail(values : {
    storeName: string,
    location: string,
    contactName: string,
    contactEmail: string,
    contactNumber: string,
}) {
    emailjs.send(
        'service_icsdf96',
        'template_5msar4i',
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

export default function StoreSignup() {
    const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            storeName: "",
            location: "",
            contactName: "",
            contactEmail: "",
            contactNumber: "",
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
                    name="storeName"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>What is the name of your store?</FormLabel>
                        <FormControl>
                            <Input {...field} />
                        </FormControl>
                        <FormDescription />
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Where is your store located?</FormLabel>
                        <FormControl>
                            <Input {...field} />
                        </FormControl>
                        <FormDescription />
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="contactName"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>What is your name?</FormLabel>
                        <FormControl>
                            <Input {...field} />
                        </FormControl>
                        <FormDescription />
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="contactEmail"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>What is your email address?</FormLabel>
                        <FormControl>
                            <Input {...field} />
                        </FormControl>
                        <FormDescription />
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="contactNumber"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>What is your contact number?</FormLabel>
                        <FormControl>
                            <Input {...field} />
                        </FormControl>
                        <FormDescription />
                        <FormMessage />
                    </FormItem>
                    )}
                />
                {isSubmitted ? (
                <Button disabled className='font-bold'>
                    Thanks, we&apos;ll be in touch
                </Button>
                ) : (
                <Button type="submit" className='font-bold'>
                    Submit
                </Button>
                )}
            </form>
        </Form>
    )
}