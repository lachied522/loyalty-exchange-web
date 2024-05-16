"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { cn } from "@/components/lib";

import { type CustomiseState, useCustomiseContext } from "../context/CustomiseContext";
import { uploadImage } from "../actions/upload-image";

export default function ImageUploader({ content } : { content: 'logo'|'store' }) {
    const { selectedStoreData } = useCustomiseContext() as CustomiseState;
    const [image, setImage] = useState<string | null>(selectedStoreData.store_img_url);
    const [isInputVisible, setIsInputVisible] = useState<boolean>(!image);

    const _key = content === 'store'? 'store_img_url': 'store_logo_url';

    useEffect(() => {
        setImage(selectedStoreData[_key]);

        if (selectedStoreData[_key]) {
            setIsInputVisible(!selectedStoreData[_key]);
        }
    }, [selectedStoreData[_key], setImage]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target!.files![0];
        const formData = new FormData();
        formData.append('image', file);

        const res = await uploadImage(
            selectedStoreData.id,
            formData,
            content
        );
        
        if (!res) {
            return
        }

        const reader = new FileReader();
    
        reader.onload = () => {
          if (reader.readyState === 2) {
            setImage(res);
          }
        };
    };
    
    return (
        <div className='flex flex-col items-stretch gap-4'>
            {image && !isInputVisible ? (
            <div className='h-[240px] flex items-center relative'>
                <Image
                    src={image}
                    alt="Your Store Image"
                    sizes="(height: 240px)"
                    fill={true}
                />
            </div>
            ) : (
            <div className='w-full h-[240px] flex items-center justify-center border border-dashed border-neutral-400'>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                />
            </div>
            )}
            <div className='w-full flex justify-start'>
                {(image && !isInputVisible) && (
                <Button onClick={() => setIsInputVisible(true)}>
                    Change
                </Button>
                )}
            </div>
        </div>
    )
}