import { Suspense } from "react";

import Logo from "@/logo";
import CalendlyInlineWidget from "./components/Calendly";
import Image from "next/image";

export default function OnboardingPage() {

    return (
        <main className='h-full flex xl:flex-row flex-col justify-between bg-yellow-100'>
            <section className='min-h-screen w-full p-12'>
                <Logo withText />

                <div className='flex flex-col items-center justify-center xl:items-start gap-6 mt-24'>
                    <h1 className='text-3xl font-bold'>Ready to ignite your customer loyalty with Loyalty exchange?</h1>
                    <p className='text-lg font-medium'>Are you a store owner? Book an introductory call to get started with Loyalty Exchange below.</p>

                    <Suspense>
                        <CalendlyInlineWidget />
                    </Suspense>
                </div>
            </section>

            <section className='min-h-screen w-full max-w-[50vw] opacity-90 hidden xl:block relative'>
                <Image
                    src='/landing-page/onboarding-hero-image-1.jpg'
                    alt='Example Store Image'
                    fill={true}
                    style={{
                        objectFit: 'cover'
                    }}
                />
            </section>
        </main>
    )
}