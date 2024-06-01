import Canvas from "./components/canvas";
import Editor from "./components/editor";

export default function CampaignsPage() {

    return (
        <div className='flex flex-col items-stretch justify-center md:p-6 p-2 gap-6'>
            <div>
                <div className='text-xl font-semibold'>Campaigns</div>
                <p>
                    Create a social media campaign for your rewards program in seconds.
                </p>
            </div>

            <div className='grid xl:grid-cols-[minmax(360px,1fr)_1fr] gap-6 p-6'>
                <Canvas />

                <Editor />
            </div>
        </div>
    )
}