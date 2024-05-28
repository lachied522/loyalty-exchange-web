"use server";

import { createClient } from "@/utils/supabase/server";

const supabase = createClient();

export async function uploadImageToBucket(
    pathname: string,
    formData: FormData,
    bucket: 'stores'|'logos'|'rewards'
) {
    const image = formData.get('image');
    if (!image) return;

    const { data, error } = await supabase
    .storage
    .from(bucket)
    .upload(
        pathname,
        image,
        {
            contentType: 'image/jpeg',
            upsert: true
        }
    );

    if (error) {
        console.log('Error uploading image to bucket: ', error);
        throw error;
    }

    return data.path;
}

function getPublicURL(
    bucket: 'stores'|'logos'|'rewards',
    path: string
) {
    
    const { data } = supabase
    .storage
    .from(bucket)
    .getPublicUrl(path);

    return data.publicUrl;
}

export async function uploadImage(
    pathname: string,
    formData: FormData,
    bucket: 'stores'|'logos'|'rewards'
) {
    // Step 1: add image to bucket
    const path = await uploadImageToBucket(pathname, formData, bucket);

    if (!path) return null;

    // Step 2: get public URL of uploading image
    const url = getPublicURL(bucket, path);

    return url;
}