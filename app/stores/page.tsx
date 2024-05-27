import Link from "next/link";
import Image from "next/image";

import { Coins, FastForward, HandCoins, Handshake, MonitorSmartphone, Rocket, TrendingUp } from "lucide-react";

import Logo from "@/logo";

import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

import ImageBanner from "./components/image-banner";
import GetStartedButton from "./components/get-started-button";

export default function StorePage() {

    return (
        <main className=''>
            <section className='bg-yellow-100 pb-24'>
                <div className='w-full flex flex-row justify-between py-4 px-6'>
                    <Logo withText={true} />

                    <Link href='/' className='flex flex-row justify-end'>
                        <Button variant='ghost' className='sm:text-lg font-medium hover:bg-yellow-200'>I am a customer</Button>
                    </Link>
                </div>

                <div className='min-h-[440px] flex justify-center items-center sm:p-24 p-12'>
                    <div className='max-w-[720px] flex flex-col gap-6'>
                        <h3 className='text-xl'>Ready to ignite your customer loyalty with Loyalty exchange?</h3>

                        <h1 className='sm:text-5xl text-4xl font-semibold'>Launch a Fully Customisable Loyalty Program</h1>

                        <p className='max-w-[640px] md:text-lg text-base font-medium text-wrap'>
                            We only work with businesses who can take on a <b>43% increase</b> in customer retention.
                        </p>
                        
                        <GetStartedButton /> 
                    </div>
                </div>
            </section>

            <section className='flex flex-col items-center justify-center sm:py-24 py-12 gap-12'>
                <div className='grid md:grid-cols-[36px_1fr] items-center justify-center gap-5 px-5 mb-6'>
                    <Rocket size={36} />

                    <h1 className='sm:text-4xl text-3xl font-semibold'>When you use Loyalty Exchange, loyalty goes up</h1>                        
                </div>

                <p className='max-w-[640px] text-xl font-medium text-center mb-12'>
                    Access our existing network of loyal customers through our online dashboard. Launch your loyalty program in 4 easy steps.
                </p>

                <div className='bg-neutral-50 rounded-md'>
                    <div className='flex flex-col xl:flex-row items-center justify-center gap-5'>
                        <div className='max-w-[720px] grid grid-cols-1 gap-6 p-12 mx-auto'>
                            <div className='flex flex-col items-center gap-2'>
                                <h2 className='text-2xl font-semibold'>1. Customise Your Reward</h2>
                                <p className='text-lg'>
                                    It&apos;s time to understand your customers and how they spend at your shop. Follow the guidelines or consult during a call to determine the best course of action for your business.
                                </p>
                            </div>

                            <Separator className='my-12' />

                            <div className='flex flex-col items-center gap-2'>
                                <h2 className='text-2xl font-semibold'>2. Engage Your Customers</h2>
                                <p className='text-lg'>
                                    Invite your customers to foster a relationship with you and your business. Implement onsite signage, online posts and incentives to generate more online reviews.
                                </p>
                            </div>

                            <Separator className='my-12' />

                            <div className='flex flex-col items-center gap-2'>
                                <h2 className='text-2xl font-semibold'>3. Launch and Monitor</h2>
                                <p className='text-lg'>
                                    Rewards tracking and customer data make it easy to understand their preferences and spending patterns.
                                </p>
                            </div>

                            <Separator className='my-12' />

                            <div className='flex flex-col items-center gap-2'>
                                <h2 className='text-2xl font-semibold'>4. Grow Your Business</h2>
                                <p className='text-lg'>
                                    When you customise a loyalty program, engage with your customers and monitor the processes loyalty will skyrocket and your business will grow.
                                </p>
                            </div>
                        </div>

                        <div className='max-w-[720px] flex xl:flex-col flex-row xl:gap-12 py-12'>
                            <div className='flex items-center justify-center'>
                                <Image
                                    src='/landing-page/dashboard-mockup-1.png'
                                    alt='App Preview'
                                    width={800}
                                    height={476}
                                />
                            </div>

                            <div className='hidden xl:flex items-center justify-center'>
                                <Image
                                    src='/landing-page/dashboard-mockup-2.png'
                                    alt='App Preview'
                                    width={800}
                                    height={476}
                                />
                            </div>
                        </div>
                    </div>

                    <div className='max-w-[720px] flex flex-col lg:flex-row items-center justify-between mx-auto p-12 mb-12 gap-6'>
                        <h1 className='text-3xl font-semibold'>Ready to get started?</h1>

                        <GetStartedButton />
                    </div>
                </div>
            </section>

            <section className='flex flex-col items-center justify-center gap-24 py-24'>
                <h1 className='sm:text-4xl text-3xl font-semibold px-5'>What does working with Loyalty Exchange look like?</h1>

                <div className='grid md:grid-cols-1 xl:grid-cols-[0.75fr_0.25fr] items-center px-12 gap-12'>
                    <div className='max-w-[1600px] grid lg:grid-cols-2 grid-cols-1 lg:gap-16 gap-12'>
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
                                No need to integrate with your POS. Customers simply pay as usual, and our platform will automate the entire process.
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
                            <h2 className='md:text-2xl text-xl font-semibold'>Existing Network of Customers</h2>
                            <p className='md:text-lg text-base'>
                                With over 2,000 customers already on the platform, you can take advantage of our network to grow your business.
                            </p>
                        </div>
                    </div>
                    
                    <div className='grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-1 gap-6'>
                        <div className='max-w-[480px] bg-white border border-neutral-200 border-l-[12px] border-l-yellow-200 p-12 rounded-md mx-auto'>
                            <p className='text-xl font-medium'>
                                <b>43%</b> average increase in customer retention rate experienced by businesses with loyalty programs.
                            </p>
                        </div>

                        <div className='max-w-[480px] bg-white border border-neutral-200 border-l-[12px] border-l-green-200 p-12 rounded-md mx-auto'>
                            <p className='text-xl font-medium'>
                                <b>83%</b> of customers say that loyalty programs make them more likely to continue doing business with a company.
                            </p>
                        </div>

                        <div className='max-w-[480px] bg-white border border-neutral-200 border-l-[12px] border-l-blue-200 p-12 rounded-md mx-auto'>
                            <p className='text-xl font-medium'>
                                <b>73%</b> of loyalty program members are more likely to recommend brands with good loyalty programs.
                            </p>
                        </div>
                    </div>
                </div>
                
            </section>

            <section className='flex flex-col items-center justify-center bg-neutral-50 sm:p-24 p-12 gap-12'>
                <h1 className='sm:text-4xl text-3xl font-semibold'>Why choose us?</h1>

                <p className='max-w-[640px] md:text-lg text-base'>
                    Not just any loyalty app. We are a digitalised service, here to help you grow.
                    <br/><br/>
                    No matter what your business, you can access our network of <b>loyal customers</b> through our <b>comprehensive</b> and <b>intuitive</b> platform.

                    It&apos;s time to turn every transaction into an <b>opportunity</b> for fostering repeat customers and driving your business forward.
                </p>
            </section>

            <ImageBanner />

            <section className='flex flex-col items-center gap-12 sm:p-24 p-12'>
                <div className='flex flex-col lg:flex-row items-center justify-between mx-auto py-24 mb-12 gap-6'>
                    <h1 className='text-3xl font-semibold'>What are you waiting for?</h1>

                    <GetStartedButton />
                </div>
            </section>

        </main>
    )
}