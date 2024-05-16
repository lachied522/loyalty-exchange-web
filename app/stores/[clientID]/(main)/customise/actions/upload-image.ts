"use server";

import { createClient } from "@/utils/supabase/server";

const supabase = createClient();

export async function uploadImageToBucket(
    formData: FormData,
    path: string,
) {
    const image = formData.get('image');

    if (!image) return;

    const { data, error } = await supabase
    .storage
    .from('stores')
    .upload(
        path,
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

function getPublicURL(path: string) {
    
    const { data } = supabase
    .storage
    .from('stores')
    .getPublicUrl(path);

    return data.publicUrl;
}

export async function updateStoreRecord(
    storeID: string,
    field: 'store_img_url'|'store_logo_url',
    value: string
) {
    
    const { error } = await supabase
    .from('stores')
    .update({ [field]: value })
    .eq('id', storeID);

    if (error) {
        console.log(`Error updating store record: `, error);
        throw new Error(`Error updating store record ${error}`);
    };
}


export async function uploadImage(
    storeID: string,
    formData: FormData,
    content: 'store'|'logo'
) {

    // Step 1: add image to bucket
    const bucketPathname = storeID + (
        content === 'store'? '_store_img': '_store_logo'
    )
    const path = await uploadImageToBucket(formData, bucketPathname);

    if (!path) return;

    // Step 3: get public URL of uploading image
    const url = getPublicURL(path);

    // Step 2: update corresponding field in store record
    const field = content === 'store'? 'store_img_url': 'store_logo_url';
    await updateStoreRecord(storeID, field, url);

    return path;
}