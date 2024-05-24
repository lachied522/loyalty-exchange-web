import Image from "next/image";

interface ImageUploaderProps {
    bucket: 'logos'|'stores'|'rewards',
    alt: string,
    value: string | null, // url of image
    onChangeURL: (url: string) => void,
    onChangeFile: (file: File) => void,
}

export default function ImageUploader({
    value,
    alt,
    onChangeURL,
    onChangeFile
} : ImageUploaderProps) {

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        
        const reader = new FileReader();
        reader.onload = () => {
            if (reader.readyState === 2) {
                onChangeURL(reader.result as string);
            }
        };
    
        if (file) {
            reader.readAsDataURL(file);
            onChangeFile(file);
        }
    }
    
    return (
        <div className='flex flex-col items-center gap-6'>
            {value ? (
            <div className='h-[240px] flex items-center relative'>
                <Image
                    src={value}
                    alt={alt}
                    height={240}
                    width={360}
                    style={{ borderRadius: 12 }}
                />
            </div>
            ) : (
            <div className='w-full h-[240px] flex items-center justify-center border border-dashed border-neutral-400'>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                />
            </div>
            )}
        </div>
    )
}