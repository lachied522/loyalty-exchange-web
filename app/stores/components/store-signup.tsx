"use client";
import { useState } from "react";

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
    address: z.string(),
    contactName: z.string(),
    email: z.string(),
    phone: z.string(),
})

export default function StoreSignup() {
    const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            storeName: "",
            address: "",
            contactName: "",
            email: "",
            phone: "",
        },
    });


    const onSubmit = (values: z.infer<typeof formSchema>) => {
        setIsSubmitted(true);

        console.log(values);
    }

    return (
        <Form {...form}>
            <form 
                onSubmit={form.handleSubmit(onSubmit)}
                className='w-[360px] flex flex-col items-stretch gap-2'
            >
                <FormField
                    control={form.control}
                    name="storeName"
                    render={() => (
                    <FormItem>
                        <FormLabel>What is the name of your store?</FormLabel>
                        <FormControl>
                            <Input />
                        </FormControl>
                        <FormDescription />
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="address"
                    render={() => (
                    <FormItem>
                        <FormLabel>Where is your store located?</FormLabel>
                        <FormControl>
                            <Input />
                        </FormControl>
                        <FormDescription />
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="contactName"
                    render={() => (
                    <FormItem>
                        <FormLabel>What is your name?</FormLabel>
                        <FormControl>
                            <Input />
                        </FormControl>
                        <FormDescription />
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={() => (
                    <FormItem>
                        <FormLabel>What is your email address?</FormLabel>
                        <FormControl>
                            <Input />
                        </FormControl>
                        <FormDescription />
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="phone"
                    render={() => (
                    <FormItem>
                        <FormLabel>What is your contact number?</FormLabel>
                        <FormControl>
                            <Input />
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