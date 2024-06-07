import Link from 'next/link';

import { Rocket } from 'lucide-react';

import { Button } from "@/components/ui/button";

import Logo from "./logo";
import Waitlist from "./waitlist";

export default function HomePage() {

  return (
      <main className=''>
        <section className='h-screen bg-yellow-100'>
          <div className='w-full flex sm:flex-row flex-col justify-between p-6 gap-2'>
            <Logo withText={true} />

            <Link href='/stores' className='flex flex-row justify-end'>
              <Button variant='ghost' className='sm:text-lg font-medium hover:bg-yellow-200'>I am a store</Button>
            </Link>
          </div>

          <div className='flex flex-col items-center sm:p-24 p-12'>
            <div className='flex flex-col gap-6 mb-12'>
              <div className='flex md:flex-row flex-col md:items-center items-start gap-3.5 md:mb-6 mb-2'>
                  <h1 className='sm:text-4xl text-3xl font-semibold'>Loyalty Exchange is launching soon</h1>

                  <Rocket size={36} />
              </div>

              <p className='max-w-[640px] font-medium text-wrap'>
                Loyalty Exchange is Australia&apos;s next largest loyalty points and rewards program. Earn points for your loyalty in new and improved ways.
              </p>
              <p className='max-w-[640px] font-medium'>
                Sign up for our waitlist to get notified when we are live and become part of the community.
              </p>
            </div>

            <Waitlist />
          </div>
        </section>
      </main>
  )
}