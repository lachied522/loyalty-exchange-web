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
            <section className='bg-yellow-100 pb-24'>
                <div className='w-full flex flex-row justify-between p-6'>
                    <Logo withText={true} />

                    <div className='flex flex-row gap-3.5'>
                        <Link href='/' className='flex flex-row justify-end'>
                            <Button variant='ghost' className='sm:text-lg font-medium hover:bg-yellow-200'>I am a customer</Button>
                        </Link>

                        <Link href='/stores/signup' className='flex flex-row justify-end'>
                            <Button variant='ghost' className='sm:text-lg font-medium hover:bg-yellow-200'>Signup</Button>
                        </Link>

                        <Link href='/stores/login' className='flex flex-row justify-end'>
                            <Button variant='default' className='sm:text-lg font-medium hover:bg-yellow-200'>Login</Button>
                        </Link>
                    </div>
                </div>

                <div className='h-[60vh] min-h-[540px] flex justify-center items-center sm:p-24 p-12'>
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

            <section className='flex items-center justify-center bg-gradient-to-b from-yellow-100  via-white to-white px-2'>
                <div className='w-full max-w-[1600px] grid grid-cols-1 sm:grid-cols-3 bg-white p-6 md:p-12 gap-12 rounded-md shadow shadow-neutral-200'>
                    <h2 className='flex flex-row sm:flex-col lg:flex-row text-2xl font-semibold gap-3.5'>
                        <Palette size={32} />
                        Step 1: Customise Your Reward
                    </h2>
                    <h2 className='flex flex-row sm:flex-col lg:flex-row text-2xl font-semibold gap-3.5'>
                        <Gift size={32} />
                        Step 2: Engage Your Customers
                    </h2>
                    <h2 className='flex flex-row sm:flex-col lg:flex-row text-2xl font-semibold gap-3.5'>
                        <LineChart size={32} />
                        Step 3: Launch And Monitor
                    </h2>
                </div>
            </section>

            <section className='flex flex-col items-center justify-center px-5 gap-12'>
                <div className='min-h-[440px] flex flex-col items-center justify-center sm:py-24 py-12 gap-12'>
                    <div className='grid md:grid-cols-[36px_1fr] items-center justify-center gap-5 mb-6'>
                        <Rocket size={36} />

                        <h1 className='sm:text-4xl text-3xl font-semibold'>When you use Loyalty Exchange, loyalty goes up</h1>                        
                    </div>

                    <p className='max-w-[640px] text-xl font-medium text-center mb-12'>
                        Access our existing network of loyal customers through our online dashboard. Launch your loyalty program in 3 easy steps.
                    </p>
                </div>

                <div className='w-full max-w-[1600px] bg-neutral-100 rounded-md md:pt-24'>
                    <div className='max-w-[1200px] grid grid-cols-1 gap-6 p-12 mx-auto'>
                        <div className='grid grid-cols-1 md:grid-cols-2 items-center gap-6 md:gap-12'>
                            <div className='flex flex-col md:flex-row items-start gap-2 md:gap-6'>
                                <div className='text-5xl md:text-6xl text-neutral-300'>
                                    01
                                </div>

                                <div className='flex flex-col items-start gap-2'>
                                    <h2 className='text-2xl font-semibold'>Customise Your Reward</h2>
                                    <p className='text-lg'>
                                        Our rewards are fully customisable so you can match your rewards to your customer preferences.
                                        <br /><br />
                                        You can also work with the Loyalty Exchange experts to determine the best rewards program to implement.
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
                            <div className='flex flex-col md:flex-row items-start gap-2 md:gap-6'>
                                <div className='text-5xl md:text-6xl text-neutral-300'>
                                    02
                                </div>

                                <div className='flex flex-col items-start gap-2'>
                                    <h2 className='text-2xl font-semibold'>Enage Your Customers</h2>
                                    <p className='text-lg'>
                                        Invite your customers to foster a relationship with you and your business.
                                        <br /> <br />
                                        Implement free in-store signage and custom social media campaigns to promote your new program.
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
                            <div className='flex flex-col md:flex-row items-start gap-2 md:gap-6'>
                                <div className='text-5xl md:text-6xl text-neutral-300'>
                                    03
                                </div>

                                <div className='flex flex-col items-start gap-2'>
                                    <h2 className='text-2xl font-semibold'>Launch and Monitor</h2>
                                    <p className='text-lg'>
                                        Launch your program onto the Loyalty Exchange app straight from our dashboard.
                                        <br /><br />
                                        Access tracking and customer analytics to understand your customers&apos; preferences and spending patterns.
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

                        <div className='flex flex-col lg:flex-row items-center justify-between mx-auto py-12 mt-12 gap-6'>
                            <h1 className='text-3xl font-semibold'>Ready to get started?</h1>

                            <GetStartedButton />
                        </div>
                    </div>
                </div>
            </section>

            <section className='flex flex-col items-center justify-center gap-24 py-24 px-12'>
                <h1 className='sm:text-4xl text-3xl font-semibold'>What does working with Loyalty Exchange look like?</h1>

                <div className='max-w-[1600px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:gap-16 gap-12'>
                    <div className='flex flex-col items-start gap-2.5'>
                        <div className='bg-yellow-200 rounded-full p-3 mb-2'>
                            <Coins size={32} color='black' />
                        </div>
                        <h2 className='md:text-2xl text-xl font-semibold'>Cost-Effective Solution</h2>
                        <p className='md:text-lg text-base'>
                            Our platform has no signup fee, and a low referral fee of 4% per transaction, ensuring you get a customer for every dollar spent.
                        </p>
                    </div>

                    <div className='flex flex-col items-start gap-2.5'>
                        <div className='bg-blue-200 rounded-full p-3 mb-2'>
                            <FastForward size={32} color='black' />
                        </div>
                        <h2 className='md:text-2xl text-xl font-semibold'>Streamlined Operations</h2>
                        <p className='md:text-lg text-base'>
                            No need to integrate with your POS. No bar code scanning. Customers simply pay as usual, and our platform will automate the entire process.
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
            </section>

            <ImageBanner />

            <section className='flex flex-col items-center justify-center bg-neutral-50 px-5 py-12 gap-12'>
                <h1 className='sm:text-4xl text-3xl font-semibold'>Why choose us?</h1>

                <p className='max-w-[640px] text-xl mb-12'>
                    Not just any loyalty app. We are a digitalised service, here to help you grow.
                    <br/><br/>
                    No matter what your business, you can access our network of <b>loyal customers</b> through our <b>comprehensive</b> and <b>intuitive</b> platform.

                    It&apos;s time to turn every transaction into an <b>opportunity</b> for fostering repeat customers and driving your business forward.
                </p>

                <div className='grid grid-cols-1 lg:grid-cols-3 gap-12'>
                    <div className='max-w-[480px] flex flex-col gap-6'>
                        <div className='min-h-[120px] border-l-[6px] border-l-blue-400 pl-6'>
                            <p className='text-4xl font-semibold'>
                                43% higher customer retention
                            </p>
                        </div>


                        <p className='text-xl font-medium'>
                            <span>Businesses that introduce loyalty rewards programs experience a </span>
                            <a href='https://australianloyaltyassociation.com/the-top-198-customer-loyalty-statistics-for-2023-and-beyond/' className='underline text-blue-400'>43% average increase </a>
                            <span>in customer retention compared to without a program.</span>
                        </p>
                    </div>

                    <div className='max-w-[480px] flex flex-col gap-6'>
                        <div className='min-h-[120px] border-l-[6px] border-l-blue-400 pl-6'>
                            <p className='text-4xl font-semibold'>
                                73% higher customer referrals
                            </p>
                        </div>


                        <p className='text-xl font-medium'>
                            <span>Customers who belong to a loyalty rewards program are up to </span>
                            <a href='https://www.mckinsey.com/industries/retail/our-insights/introducing-the-australian-consumer-loyalty-survey' className='underline text-blue-400'>73% more likely </a>
                            <span>to refer their friends.</span>
                        </p>
                    </div>

                    <div className='max-w-[480px] flex flex-col gap-6'>
                        <div className='min-h-[120px] border-l-[6px] border-l-blue-400 pl-6'>
                            <p className='text-4xl font-semibold'>
                                15-25% higher revenue per customer
                            </p>
                        </div>


                        <p className='text-xl font-medium'>
                            <span>Businesses with loyalty rewards programs experience a </span>
                            <a href='https://queue-it.com/blog/loyalty-program-statistics/' className='underline text-blue-400'>15-25% increase </a>
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