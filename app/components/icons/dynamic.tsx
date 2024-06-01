"use client";
import { memo } from "react";
import dynamic from 'next/dynamic';

import dynamicIconImports from 'lucide-react/dynamicIconImports';
import type { LucideProps } from "lucide-react";

interface IconProps extends LucideProps {
    name: string;
}

export const DynamicIcon = memo(
    ({ name, ...props }: IconProps) => {
        // see https://lucide.dev/guide/packages/lucide-react#nextjs-example
        const LucideIcon = dynamic(
            dynamicIconImports[name as keyof typeof dynamicIconImports],
            {
                loading: () => <div className='h-6 w-6 rounded-md bg-neutral-200'/>
            }
        );
    
        return <LucideIcon {...props} />;
    }
);