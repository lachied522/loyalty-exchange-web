"use client";

import { useState, useEffect } from "react";


export default function CalendlyInlineWidget() {
    const [minWidth, setMinWidth] = useState<number>(0);

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

        // add event listener for obtaining screen width
        const handleResize = () => {
            setMinWidth(window.innerWidth > 768? 720: 420);
        };

        handleResize();

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize)
        };
    }, []);

    return (
        <div
            className="calendly-inline-widget"
            data-url="https://calendly.com/info-pixe?hide_landing_page_details=1&primary_color=fecc15"
            style={{ minWidth, height: 700 }}
        />
    )
}