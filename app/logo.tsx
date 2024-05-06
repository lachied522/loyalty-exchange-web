import Link from 'next/link';
import Image from "next/image";

export default function Logo({
    withText
} : { withText: boolean }) {

    return (
        <Link href='/'>
            <div className='flex flex-row items-center gap-1 cursor-pointer'>
                <Image
                    src='/branding/logo-icon.png'
                    alt='Loyalty Exchange logo'
                    width={50}
                    height={50}
                />
                {withText && <h2 className='text-xl font-bold'>Loyalty Exchange</h2>}
            </div>
        </Link>
    )
}