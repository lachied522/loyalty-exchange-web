"use client";
import { useRef, useState } from "react";

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
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";

import { type CustomiseState, useCustomiseContext } from "../../context/CustomiseContext";
import ImageUploader from "../image-uploader";

import type { Reward } from "@/types/helpers";

const formSchema = z.object({
    title: z.string().min(2).max(32),
    reward_type: z.enum(['discount', 'free_item', 'promo_code']).nullable(),
    cost: z.coerce.number().min(0),
    image_url: z.string().nullable(),
});

interface EditRewardFormProps {
    rewardData?: Reward,
}

export default function EditRewardForm({ rewardData } : EditRewardFormProps) {
    const {
        insertRewardRecordAndUpdateState,
        updateRewardRecordAndUpdateState,
        uploadImageFromFile,
    } = useCustomiseContext() as CustomiseState;
    const [imageFile, setImageFile] = useState<File | null>(null); // images must be stored in state before being uploaded
    const [isEdittingImage, setIsEdittingImage] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const closeRef = useRef<HTMLButtonElement | null>(null);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            ...(
                rewardData ? rewardData: {
                    title: '1 Free Tea or Coffee',
                    reward_type: 'free_item',
                    cost: 50,
                }
            )
        },
    });
    const title = form.watch("title");
    const cost = form.watch("cost");
    const imageURL = form.watch("image_url");

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsLoading(true);

        let _imageURL = imageURL;
        if (imageFile) {
            // image must be uploaded to storage
            const res = await uploadImageFromFile(imageFile, 'rewards');
            if (res) _imageURL = res;
        }

        if (!rewardData) {
            await insertRewardRecordAndUpdateState({ ...values, image_url: _imageURL });
        } else {
            await updateRewardRecordAndUpdateState({ ...rewardData, ...values, image_url: _imageURL });
        }

        // close dialog
        if (closeRef && closeRef.current) closeRef.current.click();
    }

    const onEditImageClick = () => {
        setIsEdittingImage(true);
        form.setValue('image_url', null);
    }

    const onCancelEditImageClick = () => {
        setIsEdittingImage(false);
        form.setValue('image_url', rewardData?.image_url || '');
    }

    const resetForm = () => {
        form.reset();
        setIsEdittingImage(false);
        setIsLoading(false);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className='max-h-[90vh] space-y-8 p-2 mb-6 overflow-auto'>
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
                        name="reward_type"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Type</FormLabel>
                                <FormDescription>
                                    Set the type of reward you want to offer customers.
                                </FormDescription>
                                <FormControl>
                                    <Select onValueChange={field.onChange} defaultValue={field.value || 'free_item'}>
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Item" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="free_item">Item</SelectItem>
                                            <SelectItem value="discount">Discount</SelectItem>
                                            <SelectItem value="promo_code">Promo Code</SelectItem>
                                        </SelectContent>
                                    </Select>
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

                    <FormField
                        control={form.control}
                        name="image_url"
                        render={({ field }) => (
                            <FormItem>
                                <div className='flex flex-row items-center justify-between mb-5'>
                                    <div className='space-y-2'>
                                        <FormLabel>Image</FormLabel>
                                        <FormDescription>
                                            Upload an image to go with your reward.
                                        </FormDescription>
                                    </div>

                                    {isEdittingImage ? (
                                    <Button
                                        type='button'
                                        variant='secondary'
                                        onClick={onCancelEditImageClick}
                                    >
                                        Cancel
                                    </Button>
                                    ) : (
                                    <Button
                                        type='button'
                                        variant='secondary'
                                        disabled={!imageURL}
                                        onClick={onEditImageClick}
                                    >
                                        Edit
                                    </Button>
                                    )}
                                </div>

                                <FormControl>
                                    <ImageUploader
                                        alt='Reward Image'
                                        bucket='rewards'
                                        value={imageURL}
                                        onChangeURL={(value: string) => {
                                            field.onChange(value);
                                            setIsEdittingImage(false);
                                        }}
                                        onChangeFile={(file: File) => setImageFile(file)}
                                    />
                                </FormControl>
                                
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className='w-full flex flex-row items-center justify-between'>
                    <DialogClose asChild>
                        <Button
                            ref={closeRef}
                            type="button"
                            variant="secondary"
                            onClick={resetForm}
                        >
                            Cancel
                        </Button>
                    </DialogClose>

                    {isLoading ? (
                    <Button
                        type="button"
                        variant="secondary"
                        disabled
                        className="font-semibold"
                    >
                        Please wait...
                    </Button>
                    ) : (
                    <Button
                        type="submit"
                        className="font-semibold"
                    >
                        Save
                    </Button>
                    )}
                </div>
            </form>
        </Form>
    )
}