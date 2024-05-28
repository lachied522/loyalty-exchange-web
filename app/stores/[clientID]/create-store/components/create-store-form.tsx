"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

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

import { createClient } from "@/utils/supabase/client";
import { insertStoreRecord, updateStoreRecord } from "@/utils/crud/stores";

import { type ClientIDState, useClientIDContext } from "../../context/ClientIDContext";

import { uploadImage } from "../../actions/upload-image";

import ImageUploader from "../../[storeID]/components/image-uploader";
import SampleTransactionButton from "../../[storeID]/components/sample-transaction-button";

async function uploadImageFromFile(
    file: File | null,
    bucket: 'stores'|'logos',
    pathname: string,
) {
    if (!file) return null;
    const formData = new FormData();
    formData.set('image', file);

    return await uploadImage(
        pathname,
        formData,
        bucket
    );
}

async function createStoreRecord(
    clientID: string,
    values: z.infer<typeof formSchema>,
    storeImageFile: File | null,
    logoImageFile: File | null,
) {
    try {
        const supabase = createClient();
        // insert new store record to obtain store ID
        const store = await insertStoreRecord(
            { 
                ...values,
                store_img_url: null,
                store_logo_url: null,
                client_id: clientID
            },
            supabase
        );

        // upload files to bucket
        const [store_img_url, store_logo_url] = await Promise.all([
            uploadImageFromFile(storeImageFile, 'stores', store.id),
            uploadImageFromFile(logoImageFile, 'logos', store.id),
        ]);

        // update store record with new image urls
        await updateStoreRecord(
            { store_img_url, store_logo_url },
            store.id,
            supabase
        )

        // return store record with updated image fields
        return {
            ...store,
            store_img_url,
            store_logo_url,
        }
    } catch (e) {
        console.log(e);
    }
}

const formSchema = z.object({
    name: z.string().min(2, 'Required').max(32),
    vendor_name: z.string().min(1, 'Required'),
    address_line_1: z.string().min(1, 'Required'),
    city: z.string().min(1, 'Required'),
    state: z.string().min(1, 'Required'),
    postcode: z.string().min(1, 'Required'),
    store_img_url: z.string().nullable(),
    store_logo_url: z.string().nullable(),
})

export default function CreateStoreForm() {
    const { clientData, dispatch } = useClientIDContext() as ClientIDState;
    const [storeImageFile, setStoreImageFile] = useState<File | null>(null);
    const [storeLogoFile, setStoreLogoFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            store_img_url: '/images/default-store-image.jpg',
            store_logo_url: '/images/default-store-logo.jpg'
        },
    });
    const router = useRouter();

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsLoading(true);

        try {
            // insert store record and update state
            const store = await createStoreRecord(
                clientData.id,
                values,
                storeImageFile,
                storeLogoFile,
            );

            if (!store) {
                throw new Error('Something went wrong. Please try again later.');
            }

            dispatch({
                type: 'INSERT_NEW_STORE',
                payload: {
                    data: store,
                }
            })

            router.replace(`/stores/${clientData.id}/${store.id}/customise`);
        } catch (e) {
            setError(true);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className='max-h-[75vh] space-y-8 p-3 mb-6 overflow-auto'>                    
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Store Name</FormLabel>
                                <FormDescription>
                                    What is your store called?
                                </FormDescription>
                                <FormControl>
                                    <Input
                                        maxLength={32}
                                        placeholder="My Store"
                                        {...field} 
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="address_line_1"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Address Line 1</FormLabel>
                                <FormDescription>
                                    Where is your store located?
                                </FormDescription>
                                <FormControl>
                                    <Input
                                        placeholder='100 Main Street'
                                        maxLength={64}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className='grid md:grid-cols-[1.5fr_0.75fr_0.75fr] items-stretch gap-2'>
                        <FormField
                            control={form.control}
                            name="city"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>City</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder='Melbourne'
                                            maxLength={24}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="state"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>State</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder='VIC'
                                            maxLength={3}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="postcode"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Postcode</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder='3001'
                                            maxLength={4}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="vendor_name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Vendor Name</FormLabel>
                                <FormDescription>
                                    IMPORTANT! This is the name that appears on customer&apos;s statements.
                                    <SampleTransactionButton>
                                        <span className='underline cursor-pointer ml-1'>See example.</span>
                                    </SampleTransactionButton>
                                    <br />
                                    We require this to be accurate to track your customer&apos;s spending.
                                </FormDescription>
                                <FormControl>
                                    <Input
                                        placeholder="MY STORE MELBOURNE"
                                        {...field} 
                                    />
                                </FormControl>
                                
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="store_img_url"
                        render={({ field }) => (
                            <FormItem>
                                <div className='flex flex-row items-center justify-between mb-5'>
                                    <div className='space-y-2'>
                                        <FormLabel>Your Store</FormLabel>
                                        <FormDescription>
                                            Upload an image of your store.
                                        </FormDescription>
                                    </div>

                                    <Button
                                        type='button'
                                        variant='secondary'
                                        disabled={!field.value}
                                        onClick={() => form.setValue('store_img_url', null)}
                                    >
                                        Change
                                    </Button>
                                </div>

                                <FormControl>
                                    <ImageUploader
                                        alt='Store Image'
                                        bucket='stores'
                                        value={field.value}
                                        onChangeURL={field.onChange}
                                        onChangeFile={(file: File) => setStoreImageFile(file)}
                                    />
                                </FormControl>
                                
                                <FormMessage />
                            </FormItem>
                        )}
                    />


                    <FormField
                        control={form.control}
                        name="store_logo_url"
                        render={({ field }) => (
                            <FormItem>
                                <div className='flex flex-row items-center justify-between mb-5'>
                                    <div className='space-y-2'>
                                        <FormLabel>Store Logo</FormLabel>
                                        <FormDescription>
                                            Upload the logo for your store.
                                        </FormDescription>
                                    </div>

                                    <Button
                                        type='button'
                                        variant='secondary'
                                        disabled={!field.value}
                                        onClick={() => form.setValue('store_logo_url', null)}
                                    >
                                        Change
                                    </Button>
                                </div>

                                <FormControl>
                                    <ImageUploader
                                        alt='Store Logo'
                                        bucket='logos'
                                        value={field.value}
                                        onChangeURL={field.onChange}
                                        onChangeFile={(file: File) => setStoreLogoFile(file)}
                                    />
                                </FormControl>
                                
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className='w-full flex flex-row items-center justify-end py-6'>
                    {error && (
                    <div className='w-full text-start text-red-400'>
                        Something went wrong. Please try again later.
                    </div>
                    )}

                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="font-semibold"
                    >
                        {isLoading? 'Please wait...': 'Next'}
                    </Button>
                </div>
            </form>
        </Form>
    )
}