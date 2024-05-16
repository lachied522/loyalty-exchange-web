
import { Card, CardContent } from "@/components/ui/card";
import ImageUploader from "./image-uploader";

export default function StoreImage() {
    
    return (
        <Card>
            <CardContent className='flex flex-col items-stretch justify-between gap-4 p-6'>
                <div className='w-full flex flex-row items-center'>
                    <div className='text-xl font-semibold'>Your Store</div>
                </div>
                <p>This is displayed in-app. Upload a nice image of your store.</p>
                <ImageUploader content='store' />
            </CardContent>
        </Card>
    )
}