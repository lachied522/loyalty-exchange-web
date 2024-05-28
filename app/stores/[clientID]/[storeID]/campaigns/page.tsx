import Canvas from "./components/canvas";
import SocialMediaSelector from "./components/social-media-selector";

export default function CampaignsPage() {


    return (
        <div className='flex flex-col items-stretch justify-center md:p-6 p-2'>
            <div className='text-xl font-semibold'>Campaigns</div>
            <p>
                Create a social media campaign for your rewards program in seconds.
            </p>


            <div className='flex flex-col items-center justify-center p-12 gap-12'>
                <SocialMediaSelector />

                <Canvas />
            </div>
        </div>
    )
}