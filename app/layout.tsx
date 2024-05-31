import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import Script from 'next/script'

import "./globals.css";

const raleway = Raleway({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Loyalty Exchange",
  description: "Loyalty Exchange",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className='scroll-smooth'>
      <head>
          {/* <!-- Meta Pixel Code --> */}
          <Script key='function' id='facebook-pixel-script'>
            {`!function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '3652381828354357');
            fbq('track', 'PageView');`}
          </Script>
          {/* <!-- End Meta Pixel Code --> */}
      </head>
      <body className={raleway.className}>{children}</body>
    </html>
  );
}
