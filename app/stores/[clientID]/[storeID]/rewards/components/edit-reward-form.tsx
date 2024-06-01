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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";

import { uploadImage } from "../../../actions/upload-image";

import { type StoreIDState, useStoreIDContext } from "../../context/StoreIDContext";

import ImageUploader from "../../components/image-uploader";

import IconSelector from "./icon-selector";
import DeleteRewardDialog from "./delete-reward-dialog";

import type { Reward } from "@/types/helpers";

const formSchema = z.object({
    title: z.string().min(2).max(32),
    conditions: z.string().max(64).nullable(),
    reward_type: z.enum(['discount', 'free_item', 'promo_code']).nullable(),
    promo_code: z.string().nullable(),
    cost: z.coerce.number().min(0),
    icon_name: z.string().nullable(),
    image_url: z.string().nullable(),
})
.refine((obj) => obj.reward_type!=='promo_code' || obj.promo_code?.length, {
    message: 'Required',
    path: ['promo_code']
});

interface EditRewardFormProps {
    rewardData: Reward,
}

export default function EditRewardForm({ rewardData } : EditRewardFormProps) {
    const { updateRewardRecordAndUpdateState } = useStoreIDContext() as StoreIDState;
    const [imageFile, setImageFile] = useState<File | null>(null); // images must be stored in state before being uploaded
    const [isEdittingImage, setIsEdittingImage] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const closeRef = useRef<HTMLButtonElement | null>(null);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: rewardData,
    });
    const title = form.watch("title");
    const condtions = form.watch("conditions");
    const cost = form.watch("cost");
    
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsLoading(true);

        let image_url = null;
        if (imageFile) {
            // image must be uploaded to storage
            const formData = new FormData();
            formData.set('image', imageFile);
            image_url = await uploadImage(
                rewardData.id + '_image',
                formData,
                'rewards'
            );
        }

        await updateRewardRecordAndUpdateState({
            ...rewardData,
            ...values,
            ...(image_url? { image_url } : {})
        });

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
                <div className='max-h-[80vh] flex flex-col gap-6 p-2 space-y-8 overflow-auto'>
                    <div className='flex flex-col items-center p-6 gap-3.5'>
                        <div className='text-center text-xl font-medium'>
                            {`Spend $${Math.max(cost / 10, 0).toFixed(2)} to get ${title}`}
                            {condtions? '*' : ''}
                        </div>
                        {condtions && <p>*{condtions}</p>}
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
                        name="conditions"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Conditions</FormLabel>
                                <FormDescription>
                                    Set conditions under which the reward can be redeemed, if any.
                                </FormDescription>
                                <FormControl>
                                    <Input
                                        maxLength={32}
                                        placeholder="e.g. Orders above $50 only"
                                        value={field.value || ''}
                                        onChange={field.onChange}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {rewardData.reward_type === 'promo_code' && (
                        <FormField
                            control={form.control}
                            name="promo_code"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Promo Code</FormLabel>
                                    <FormDescription>
                                        This is the code that users will receive when they redeem this reward.
                                    </FormDescription>
                                    <FormControl>
                                        <Input
                                            maxLength={12}
                                            placeholder="My Promo Code"
                                            value={field.value || ''}
                                            onChange={field.onChange}
                                            className='min-h-[56px] max-w-[240px] text-2xl font-medium'
                                        />
                                    </FormControl>
                                    
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        )}

                    <div className='flex flex-row justify-between gap-3.5'>
                        <FormField
                            control={form.control}
                            name="cost"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Points</FormLabel>
                                    <FormDescription>
                                        This is the amount of points customers require to redeem this reward.
                                    </FormDescription>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            min={0}
                                            placeholder="e.g. 50"
                                            className='max-w-[180px]'
                                            {...field} 
                                        />
                                    </FormControl>
                                    
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormItem>
                            <FormLabel>Cost ($)</FormLabel>
                            <FormDescription>
                                This is the equivalent dollar amount customers must spend to redeem this reward.
                            </FormDescription>
                            <FormControl>
                                <Input
                                    type="number"
                                    placeholder="e.g. 50"
                                    value={cost? (cost / 10).toFixed(2): ''}
                                    min={0}
                                    disabled
                                    className='max-w-[180px]'
                                />
                            </FormControl>
                            
                            <FormMessage />
                        </FormItem>
                    </div>
                   
                    <FormField
                        control={form.control}
                        name="icon_name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Icon</FormLabel>
                                <FormDescription>
                                    Give your reward some personality with an icon.
                                </FormDescription>
                                <FormControl>
                                    <IconSelector value={field.value} onChange={(value: string) => field.onChange(value)} />
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
                                        <FormMessage />
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
                                        disabled={!field.value}
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
                                        value={field.value}
                                        onChangeURL={(value: string) => {
                                            field.onChange(value);
                                            setIsEdittingImage(false);
                                        }}
                                        onChangeFile={(file: File) => setImageFile(file)}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <div className='w-full flex flex-row items-center justify-between py-12'>
                        <p>Delete this reward</p>

                        <DeleteRewardDialog rewardID={rewardData.id} />
                    </div>
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