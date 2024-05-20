import Image from "next/image";

export default function ImageBanner() {

    return (
        <div className='w-full flex items-center justify-center overflow-hidden'>
            <div className='w-full min-w-[1800px] grid grid-cols-5 opacity-80'>
                <Image
                    src='/landing-page/landing-image-1.jpg'
                    alt='Example Store Image'
                    width={1600}
                    height={1200}
                />
                <Image
                    src='/landing-page/landing-image-2.jpg'
                    alt='Example Store Image'
                    width={1600}
                    height={1200}
                />
                <Image
                    src='/landing-page/landing-image-3.jpg'
                    alt='Example Store Image'
                    width={1600}
                    height={1200}
                />
                <Image
                    src='/landing-page/landing-image-4.jpg'
                    alt='Example Store Image'
                    width={1600}
                    height={1200}
                />
                <Image
                    src='/landing-page/landing-image-5.jpg'
                    alt='Example Store Image'
                    width={1600}
                    height={1200}
                />
            </div>
        </div>
    )
}