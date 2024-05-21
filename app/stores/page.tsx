import Link from "next/link";
import Image from "next/image";

import { ChevronsDown, Coins, FastForward, HandCoins, Handshake, MonitorSmartphone, Rocket, TrendingUp } from "lucide-react";

import Logo from "@/logo";
import { Button } from "@/components/ui/button";

import StoreContact from "./components/store-contact";
import ImageBanner from "./components/image-banner";
import CalendlyInlineWidget from "./components/Calendly";

export default function StorePage() {

    return (
        <main className=''>
            <section className='bg-yellow-100'>
                <div className='w-full flex flex-row justify-between py-4 px-6'>
                    <Logo withText={true} />

                    <Link href='/' className='flex flex-row justify-end'>
                        <Button variant='ghost' className='sm:text-lg font-medium hover:bg-yellow-200'>I am a customer</Button>
                    </Link>
                </div>

                <div className='min-h-[440px] flex flex-col items-center sm:p-24 xs:p-12 p-6'>
                    <div className='flex flex-col gap-6'>
                        <div className='flex md:flex-row flex-col md:items-center items-start gap-3.5 md:mb-6 mb-2'>
                            <h1 className='sm:text-4xl text-3xl font-semibold'>Loyalty Exchange is launching soon</h1>

                            <Rocket size={36} />
                        </div>

                        <p className='max-w-[640px] md:text-lg text-base font-medium text-wrap'>
                            We are making effective <b>loyalty rewards programs</b> accessible to small businesses.
                            Simply become a member of our network to design your own <b>completely custom</b> loyalty rewards program.
                            We do all the <b>heavy lifting</b>, so you can sit back and watch customers fly through your doors.
                        </p>
                        <a href='#join' className='flex flex-row items-center justify-center gap-3.5'>
                            <ChevronsDown size={24} />
                            <p className='md:text-lg text-base font-medium'>
                                Submit your details below to book a demo.
                            </p>
                            <ChevronsDown size={24} />
                        </a>
                    </div>
                </div>
            </section>

            <section className='flex flex-col items-center justify-center sm:p-24 p-12 gap-12'>
                <h1 className='sm:text-4xl text-3xl font-semibold'>How we help your business</h1>

                <div className='max-w-[1600px] grid lg:grid-cols-3 grid-cols-2 lg:gap-16 gap-12'>
                    <div className='flex flex-col items-start gap-2.5'>
                        <div className='bg-yellow-200 rounded-full p-3 mb-2'>
                            <TrendingUp size={32} color='black' />
                        </div>
                        <h2 className='md:text-2xl text-xl font-semibold'>Increased Customer Engagement</h2>
                        <p className='md:text-lg text-base'>
                            Engage your customers like never before with our intuitive loyalty program. Tailored rewards and incentives encourage repeat visits.
                        </p>
                    </div>
                    <div className='flex flex-col items-start gap-2.5'>
                        <div className='bg-green-200 rounded-full p-3 mb-2'>
                            <FastForward size={32} color='black' />
                        </div>
                        <h2 className='md:text-2xl text-xl font-semibold'>Streamlined Operations</h2>
                        <p className='md:text-lg text-base'>
                            Our platform automates the entire accumulation and redemption process, allowing you to focus on running your business.
                        </p>
                    </div>
                    <div className='flex flex-col items-start gap-2.5'>
                        <div className='bg-blue-200 rounded-full p-3 mb-2'>
                            <MonitorSmartphone size={32} color='black' />
                        </div>
                        <h2 className='md:text-2xl text-xl font-semibold'>Digital Convenience</h2>
                        <p className='md:text-lg text-base'>
                            With no physical cards, our platform offers a seamless experience for both you and your customers.
                        </p>
                    </div>
                    <div className='flex flex-col items-start gap-2.5'>
                        <div className='bg-fuchsia-200 rounded-full p-3 mb-2'>
                            <Coins size={32} color='black' />
                        </div>
                        <h2 className='md:text-2xl text-xl font-semibold'>Cost-Effective Solution</h2>
                        <p className='md:text-lg text-base'>
                            Accessing our network is completely free, and our referral-based pricing pricing policy ensures you get a customer for every dollar spent.
                        </p>
                    </div>
                    <div className='flex flex-col items-start gap-2.5'>
                        <div className='bg-amber-200 rounded-full p-3 mb-2'>
                            <Handshake size={32} color='black' />
                        </div>
                        <h2 className='md:text-2xl text-xl font-semibold'>Hassle-Free Setup</h2>
                        <p className='md:text-lg text-base'>
                            Onboarding is easy. Simply tell us you are interested, and we will handle everything for you.
                        </p>
                    </div>
                    <div className='flex flex-col items-start gap-2.5'>
                        <div className='bg-lime-200 rounded-full p-3 mb-2'>
                            <HandCoins size={32} color='black' />
                        </div>
                        <h2 className='md:text-2xl text-xl font-semibold'>Existing Network of Users</h2>
                        <p className='md:text-lg text-base'>
                            With over 2,000 users already on the platform, you can take advantage of our network to grow your business.
                        </p>
                    </div>
                </div>
            </section>

            <section className='grid md:grid-cols-2 grid-cols-1 lg:p-24 p-12 gap-12'>
                <div className='flex flex-col items-center gap-12'>
                    <h1 className='sm:text-4xl text-3xl font-semibold'>How it works</h1>

                    <div className='max-w-[360px] grid grid-cols-1 gap-6'>
                        <div className='flex flex-col items-center gap-2'>
                            <h3 className='text-xl font-semibold'>1. Sign Up.</h3>
                            <div>Join our platform with a simple sign-up process.</div>
                        </div>
                        <div className='flex flex-col items-center gap-2'>
                            <h3 className='text-xl font-semibold'>2. Customize Your Program. </h3>
                            <div>Set up personalized rewards and engagement strategies.</div>
                        </div>
                        <div className='flex flex-col items-center gap-2'>
                            <h3 className='text-xl font-semibold'>3. Automate and Launch.</h3>
                            <div>Let our platform handle tracking and rewards issuance.</div>
                        </div>
                        <div className='flex flex-col items-center gap-2'>
                            <h3 className='text-xl font-semibold'>4. Grow Your Business.</h3>
                            <div>Watch your customer base grow with increased loyalty and engagement.</div>
                        </div>
                    </div>
                </div>

                <div className='flex items-center justify-center'>
                    <Image
                        src='/branding/app-preview-image.png'
                        alt='App Preview'
                        width={1600}
                        height={1200}
                    />
                </div>
            </section>

            <section className='flex flex-col items-center justify-center bg-neutral-50 sm:p-24 p-12 gap-12'>
                <h1 className='sm:text-4xl text-3xl font-semibold'>Why choose us?</h1>

                <p className='max-w-[640px] md:text-lg text-base'>
                    No matter what your business, you can access our network of <b>loyal customers</b> through our <b>comprehensive</b> and <b>intuitive</b> platform.

                    It is time to turn every transaction into an <b>opportunity</b> for fostering repeat customers and driving your business forward.
                </p>
            </section>

            <ImageBanner />

            <section
                id='join'
                className='flex flex-col items-center gap-12 sm:p-24 p-12'
            >
                <h1 className='sm:text-4xl text-3xl font-semibold'>Join our store network</h1>

                <CalendlyInlineWidget />
            </section>

        </main>
    )
}