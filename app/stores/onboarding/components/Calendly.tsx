"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const BASE_URL = 'https://calendly.com/info-pixe?hide_landing_page_details=1&primary_color=fecc15';

function isCalendlyEvent(e: MessageEvent) {
    return e.origin === "https://calendly.com" && e.data.event && e.data.event.indexOf("calendly.") === 0;
};

export default function CalendlyInlineWidget() {
    const [url, setUrl] = useState<string>(BASE_URL);
    const [isComplete, setIsComplete] = useState<boolean>(false);
    const [minWidth, setMinWidth] = useState<number>(0);
    const searchParams = useSearchParams();

    useEffect(() => {
        // add script element to head
        const head = document.querySelector('head');
        const script = document.createElement('script');
        script.setAttribute(
          'src',
          'https://assets.calendly.com/assets/external/widget.js'
        );
          script.setAttribute(
            'async',
            'true'
        )
        head!.appendChild(script);

        // add event listener for completion
        // see https://help.calendly.com/hc/en-us/articles/223147027-Embed-options-overview?tab=advanced#6
        const handleCalendlyEvent = (e: MessageEvent) => {
            if(isCalendlyEvent(e)) {
                if (e.data.event === "calendly.event_scheduled") {
                    setIsComplete(true);
                }
              }
        }
        window.addEventListener("message", handleCalendlyEvent);

        // add event listener for obtaining screen width
        const handleResize = () => {
            setMinWidth(window.innerWidth > 768? 720: 420);
        }
        window.addEventListener('resize', handleResize);
        // call handle resize once to set initial width
        handleResize();

        return () => {
            window.removeEventListener('message', handleCalendlyEvent);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        if (searchParams.get('email')) {
            setUrl(BASE_URL + '&email=' + searchParams.get('email')!.toString());
        }
    }, [searchParams, setUrl]);

    return (
        <div className='flex flex-col gap-6'>
            <div
                className="calendly-inline-widget"
                data-url={url || BASE_URL}
                style={{ minWidth, height: 700 }}
            />

            {isComplete && (
            <div className='w-full flex flex-row items-center justify-center gap-3.5'>
                <h4 className='text-lg font-medium'>Thanks for booking.</h4>
                <Link href='/stores/login'>
                    <Button>
                        Proceed to login
                    </Button>
                </Link>
            </div>
            )}
        </div>
    )
}