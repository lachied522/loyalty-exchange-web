import Link from "next/link";
import Image from "next/image";

import { Coins, FastForward, Gift, HandCoins, Handshake, LineChart, MonitorSmartphone, Palette, Rocket, TrendingUp } from "lucide-react";

import Logo from "@/logo";

import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

import ImageBanner from "./components/image-banner";
import GetStartedButton from "./components/get-started-button";

export default function StorePage() {

    return (
        <main className='scrollbar-custom'>
            <section className='bg-gradient-to-bl from-yellow-300 via-yellow-200 to-yellow-300/80 relative'>
                <div className='w-full flex sm:flex-row flex-col justify-between p-6 gap-2'>
                    <Logo withText={true} />

                    <div className='flex flex-row justify-between sm:justify-end gap-3.5'>
                        <Link href='/' className='flex flex-row justify-end'>
                            <Button variant='ghost' className='font-medium hover:bg-yellow-200'>I am a customer</Button>
                        </Link>

                        <Link href='/stores/signup' className='flex flex-row justify-end'>
                            <Button variant='ghost' className='font-medium hover:bg-yellow-200'>Signup</Button>
                        </Link>

                        <Link href='/stores/login' className='flex flex-row justify-end'>
                            <Button variant='default' className='font-medium hover:bg-yellow-200'>Login</Button>
                        </Link>
                    </div>
                </div>
                
                <div className='h-[60vh] min-h-[360px] md:min-h-[540px] flex justify-center items-center p-6 sm:p-12 md:p-24'>
                    <div className='max-w-[960px] flex flex-col items-start gap-6'>
                        <h3 className='text-xl font-medium'>Get your store out there with Loyalty Exchange!</h3>

                        <h1 className='sm:text-6xl text-4xl font-bold'>Launch a Fully Automated, Custom Loyalty Program</h1>

                        <p className='md:text-lg text-base font-semibold text-wrap mb-3.5'>
                            We only work with businesses who can take on a <b>43% increase</b> in customer retention.
                        </p>
                        
                        <GetStartedButton />
                    </div>
                </div>

                <div className='w-full max-w-[1600px] mx-auto px-2 md:px-6 mb-24'>
                    <div className='grid grid-cols-1 sm:grid-cols-3 bg-white p-6 md:p-12 gap-12 rounded-md shadow shadow-neutral-200 translate-y-1/4 md:translate-y-1/2'>
                        <h2 className='flex flex-row sm:flex-col lg:flex-row text-2xl font-bold gap-3.5'>
                            <Palette size={36} />
                            Step 1: Customise Your Reward
                        </h2>

                        <h2 className='flex flex-row sm:flex-col lg:flex-row text-2xl font-bold gap-3.5'>
                            <Gift size={36} />
                            Step 2: Engage Your Customers
                        </h2>

                        <h2 className='flex flex-row sm:flex-col lg:flex-row text-2xl font-bold gap-3.5'>
                            <LineChart size={36} />
                            Step 3: Watch Your Revenue Grow
                        </h2>
                    </div>
                </div>
            </section>

            <section className='flex flex-col items-center justify-center px-5 gap-12'>
                <div className='min-h-[440px] max-w-[720px] flex flex-col items-center justify-center sm:py-24 py-12 gap-12'>
                    <div className='grid md:grid-cols-[48px_1fr] items-center justify-center gap-5 mb-6'>
                        <Rocket size={48} />

                        <h1 className='sm:text-4xl text-3xl font-bold'>Australia&apos;s First All-In-One Loyalty as a Service Platform</h1>                        
                    </div>

                    <p className='text-2xl font-medium mb-12'>
                        With Loyalty Exchange, you can launch your program onto an app with thousands of loyal users, all through our intuitive online dashboard.
                        <br /><br />
                        Let us provide a consistent stream of loyal customers, so you can focus on what you do best: running your business.
                    </p>
                </div>

                <div className='w-full max-w-[1600px] bg-neutral-100 rounded-xl p-6 md:pt-24'>
                    <div className='max-w-[1200px] grid grid-cols-1 gap-6 mx-auto'>
                        <div className='grid grid-cols-1 md:grid-cols-2 items-center gap-6 md:gap-12'>
                            <div className='flex flex-col md:flex-row items-start gap-2 md:gap-12'>
                                <div className='text-6xl md:text-7xl text-neutral-300'>
                                    01
                                </div>

                                <div className='flex flex-col items-start gap-2'>
                                    <h2 className='text-3xl font-bold'>Customise Your Reward</h2>
                                    <p className='text-xl'>
                                        Our rewards are <b>fully customisable</b>, so you can match your rewards to your customer preferences.
                                        <br /><br />
                                        You can also work with the <b>Loyalty Exchange experts</b> to determine the best rewards program to implement.
                                    </p>
                                </div>
                            </div>

                            <Image
                                src='/landing-page/customise-your-reward.png'
                                alt='Custome Your Reward'
                                width={800}
                                height={476}
                            />
                        </div>

                        <Separator className='my-12' />

                        <div className='grid grid-cols-1 md:grid-cols-2 items-center gap-6 md:gap-12'>
                            <div className='flex flex-col md:flex-row items-start gap-2 md:gap-12'>
                                <div className='text-6xl md:text-7xl text-neutral-300'>
                                    02
                                </div>

                                <div className='flex flex-col items-start gap-2'>
                                    <h2 className='text-3xl font-bold'>Enage Your Customers</h2>
                                    <p className='text-xl'>
                                        Invite your customers to foster a <b>long-term relationship</b> with you and your business.
                                        <br /> <br />
                                        Implement <b>free</b> in-store signage and custom social media campaigns to promote your new program.
                                    </p>
                                </div>
                            </div>


                            <Image
                                src='/landing-page/engage-your-customers.png'
                                alt='Custome Your Reward'
                                width={800}
                                height={476}
                            />
                        </div>

                        <Separator className='my-12' />

                        <div className='grid grid-cols-1 md:grid-cols-2 items-center gap-6 md:gap-12'>
                            <div className='flex flex-col md:flex-row items-start gap-2 md:gap-12'>
                                <div className='text-6xl md:text-7xl text-neutral-300'>
                                    03
                                </div>

                                <div className='flex flex-col items-start gap-2'>
                                    <h2 className='text-3xl font-bold'>Watch Your Revenue Grow</h2>
                                    <p className='text-xl'>
                                        Launch your program onto the <b>Loyalty Exchange app</b> straight from our dashboard.
                                        <br /><br />
                                        Access <b>tracking</b> and customer <b>analytics</b> to understand your customers&apos; preferences and spending patterns.
                                    </p>
                                </div>
                            </div>

                            <Image
                                src='/landing-page/launch-and-monitor.png'
                                alt='Custome Your Reward'
                                width={800}
                                height={476}
                            />
                        </div>

                        <div className='flex flex-col lg:flex-row items-center justify-between mx-auto py-12 mt-12 gap-12'>
                            <h1 className='text-3xl font-semibold'>Ready to get started?</h1>

                            <GetStartedButton />
                        </div>
                    </div>
                </div>
            </section>

            <section className='min-h-[960px] flex flex-col items-center justify-center gap-24 px-12'>
                <h1 className='sm:text-4xl text-3xl font-semibold'>What does working with Loyalty Exchange look like?</h1>

                <div className='max-w-[1600px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:gap-16 gap-12'>
                    <div className='flex flex-col items-start gap-2.5'>
                        <div className='bg-yellow-200 rounded-full p-3 mb-2'>
                            <Coins size={32} color='black' />
                        </div>
                        <h2 className='md:text-2xl text-xl font-semibold'>Cost-Effective Solution</h2>
                        <p className='md:text-lg text-base'>
                            Our platform has <b>no signup fee</b>, and a low referral fee of <b>4%</b>, meaning you only get charged when one of our customers spends at your store.
                        </p>
                    </div>

                    <div className='flex flex-col items-start gap-2.5'>
                        <div className='bg-blue-200 rounded-full p-3 mb-2'>
                            <FastForward size={32} color='black' />
                        </div>
                        <h2 className='md:text-2xl text-xl font-semibold'>Streamlined Operations</h2>
                        <p className='md:text-lg text-base'>
                            No integration with your POS, no barcode scanners, and no physical cards required. <b>Customers simply pay as usual</b>, and our platform will automate the entire process.
                        </p>
                    </div>

                    <div className='flex flex-col items-start gap-2.5'>
                        <div className='bg-lime-200 rounded-full p-3 mb-2'>
                            <HandCoins size={32} color='black' />
                        </div>
                        <h2 className='md:text-2xl text-xl font-semibold'>Existing Network of Customers</h2>
                        <p className='md:text-lg text-base'>
                            With over <b>2,000 customers</b> already on the platform, you can take advantage of our network to grow your business.
                        </p>
                    </div>
                </div>
            </section>

            <ImageBanner />

            <section className='flex flex-col items-center justify-center bg-neutral-50 px-5 py-24 gap-24'>
                <h1 className='sm:text-4xl text-3xl font-semibold'>Why choose us?</h1>

                <p className='max-w-[720px] text-xl mb-12'>
                    Not just any loyalty app. We are a digitalised service, here to help you grow.
                    <br/><br/>
                    No matter what your business, you can access our network of <b>loyal customers</b> through our <b>comprehensive</b> and <b>intuitive</b> platform.

                    It&apos;s time to turn every transaction into an <b>opportunity</b> for fostering repeat customers and driving your business forward.
                </p>

                <div className='grid grid-cols-1 lg:grid-cols-3 gap-12'>
                    <div className='max-w-[480px] flex flex-col gap-6'>
                        <div className='min-h-[120px] border-l-[4px] border-l-yellow-400 pl-6'>
                            <p className='text-4xl font-semibold'>
                                43% higher customer retention
                            </p>
                        </div>


                        <p className='text-xl font-medium'>
                            <span>Businesses that introduce loyalty rewards programs experience a </span>
                            <a href='https://australianloyaltyassociation.com/the-top-198-customer-loyalty-statistics-for-2023-and-beyond/' className='underline text-yellow-400'>43% average increase </a>
                            <span>in customer retention compared to without a program.</span>
                        </p>
                    </div>

                    <div className='max-w-[480px] flex flex-col gap-6'>
                        <div className='min-h-[120px] border-l-[4px] border-l-yellow-400 pl-6'>
                            <p className='text-4xl font-semibold'>
                                73% higher customer referrals
                            </p>
                        </div>


                        <p className='text-xl font-medium'>
                            <span>Customers who belong to a loyalty rewards program are up to </span>
                            <a href='https://www.mckinsey.com/industries/retail/our-insights/introducing-the-australian-consumer-loyalty-survey' className='underline text-yellow-400'>73% more likely </a>
                            <span>to refer their friends.</span>
                        </p>
                    </div>

                    <div className='max-w-[480px] flex flex-col gap-6'>
                        <div className='min-h-[120px] border-l-[4px] border-l-yellow-400 pl-6'>
                            <p className='text-4xl font-semibold'>
                                15-25% higher revenue per customer
                            </p>
                        </div>


                        <p className='text-xl font-medium'>
                            <span>Businesses with loyalty rewards programs experience a </span>
                            <a href='https://queue-it.com/blog/loyalty-program-statistics/' className='underline text-yellow-400'>15-25% increase </a>
                            <span>in revenue from customers who use them.</span>
                        </p>
                    </div>
                </div>
            </section>


            <section className='flex flex-col items-center gap-12 sm:p-24 p-12'>
                <div className='min-h-[440px] flex flex-col lg:flex-row items-center justify-between mx-auto py-24 mb-12 gap-6'>
                    <h1 className='text-3xl font-semibold'>What are you waiting for?</h1>

                    <GetStartedButton />
                </div>
            </section>

        </main>
    )
}