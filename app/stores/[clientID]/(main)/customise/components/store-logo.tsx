
import { Card, CardContent } from "@/components/ui/card";
import ImageUploader from "./image-uploader";

export default function StoreLogo() {
    
    return (
        <Card>
            <CardContent className='flex flex-col items-stretch justify-between gap-4 p-6'>
                <div className='w-full flex flex-row items-center'>
                    <div className='text-xl font-semibold'>Your Logo</div>
                </div>
                <p>Let customers know who you are. Upload an image of your logo.</p>
                <ImageUploader content='logo' />
            </CardContent>
        </Card>
    )
}