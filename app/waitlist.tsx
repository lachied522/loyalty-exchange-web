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
    name: z.string(),
    email: z.string(),
})

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
    }

    return (
        <Form {...form}>
            <form 
                onSubmit={form.handleSubmit(onSubmit)}
                className='w-[360px] flex flex-col items-stretch gap-2'
            >
                <FormField
                    control={form.control}
                    name="name"
                    render={() => (
                    <FormItem>
                        <FormControl>
                            <Input placeholder="Your name"/>
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
                        <FormControl>
                            <Input placeholder="Your email"/>
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