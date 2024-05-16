"use client";
import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";

import type { Reward } from "@/types/helpers";
import { Trash } from "lucide-react";
import DeleteRewardDialog from "./delete-reward-dialog";

const formSchema = z.object({
    title: z.string().min(2).max(32),
    type: z.enum(['discount', 'item']),
    cost: z.number().min(0),
});

interface EditRewardFormProps {
    rewardData: Reward
}

export default function EditRewardForm({ rewardData } : EditRewardFormProps) {
    const [isDeleteButtonVisible, setIsDeleteButtonVisible] = useState<boolean>(false);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: rewardData,
    });
    const title = form.watch("title");
    const cost = form.watch("cost");

    const onDelete = () => {

    }

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        console.log(values);
    }

    const onCancel = () => {
        form.reset();
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                <div className='w-full flex flex-col gap-2'>
                    <h5 className='text-base font-semibold'>Formula</h5>
                    <p className='text-sm'>Use the fields below to edit this.</p>

                    <div className='text-center text-xl font-medium p-6'>{`Spend $${Math.max(cost, 0)} to get ${title}`}</div>
                </div>

                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormDescription>
                                This is the name of the reward your customers will see.
                            </FormDescription>
                            <FormControl>
                                <Input
                                    maxLength={32}
                                    placeholder="e.g. 1 Free Tea or Coffee"
                                    {...field} 
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="cost"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Cost ($)</FormLabel>
                            <FormDescription>
                                This is the amount customers must spend to redeem this reward.
                            </FormDescription>
                            <FormControl>
                                <Input
                                    type="number"
                                    min={0}
                                    placeholder="e.g. 50"
                                    {...field} 
                                />
                            </FormControl>
                            
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className='w-full flex flex-col gap-2'>
                    <h5 className='text-base font-semibold'>Reward</h5>

                    <p className='text-sm'>What reward do you want to give your customers?</p>
                </div>

                <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Type</FormLabel>
                            <FormDescription>
                                Set the type of reward you want to offer customers.
                            </FormDescription>
                            <FormControl>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Discount" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="discount">Discount</SelectItem>
                                        <SelectItem value="item">Item</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className='w-full flex flex-row items-center justify-between py-12'>
                    <p>Delete this reward</p>

                    <DeleteRewardDialog rewardID={rewardData.id} />
                </div>

                <div className='w-full flex flex-row items-center justify-between'>
                    <DialogClose asChild>
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={onCancel}
                        >
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button type="submit" className="font-semibold">
                        Done
                    </Button>
                </div>
            </form>
        </Form>
    )
}