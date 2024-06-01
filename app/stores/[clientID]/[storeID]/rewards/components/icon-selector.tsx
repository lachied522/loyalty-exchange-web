"use client";
import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import Icons from "@/components/icons/static";
import { renderStaticIcon } from "@/components/icons/helpers";

interface IconSelectorProps {
    value: string | null
    onChange: (value: string) => void
}

export default function IconSelector({ value, onChange } : IconSelectorProps) {
    const [open, setOpen] = useState(false);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="flex items-center justify-start gap-2 px-5"
                >
                    {renderStaticIcon({ name: value })}
                    {value || 'PartyPopper'}
                </Button>
            </PopoverTrigger>
            <PopoverContent>
                <div className='grid grid-cols-4'>
                    {Object.keys(Icons).map((name, index) => (
                        <Button
                            key={`icon-select-option-${index}`}
                            variant='ghost'
                            onClick={() => onChange(name)}
                        >
                            {renderStaticIcon({ name })}
                        </Button>
                    ))}
                </div>
            </PopoverContent>
            </Popover>
    )
}