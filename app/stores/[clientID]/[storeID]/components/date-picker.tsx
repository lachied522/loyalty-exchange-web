"use client";
import { useState } from "react";

import { format } from "date-fns";

import { CalendarIcon } from "lucide-react";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { cn } from "@/components/lib";
import { Input } from "@/components/ui/input";


interface DatePickerProps {
    value: Date,
    onChange: (value?: Date) => void
}

export default function DatePicker({ value, onChange }: DatePickerProps) {
    const [date, setDate] = useState<Date>(new Date());
    const [time, setTime] = useState<string>('12:00');

    const onChangeDate = (value?: Date) => {
        // update state
        const dateTime = new Date(value || new Date());
        setDate(dateTime);
        // update time component of date and pass back to parent
        const timeParts = time.split(':');
        dateTime.setHours(parseInt(timeParts[0], 10), parseInt(timeParts[1], 10));
        onChange(dateTime);
    }

    const onChangeTime = (value: string) => {
        // update state
        setTime(value);
        // update time component of date and pass back to parent
        const dateTime = new Date(date);
        const timeParts = value.split(':');
        dateTime.setHours(parseInt(timeParts[0], 10), parseInt(timeParts[1], 10));
        onChange(dateTime);
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !value && "text-muted-foreground"
                    )}
                    >
                        {value ? (
                        format(value, "PPP")
                        ) : (
                        <span>Pick a date</span>
                        )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="single"
                    selected={value}
                    onSelect={onChangeDate}
                    disabled={(date) => date < new Date()}
                    initialFocus
                />
            </PopoverContent>
            <Input
                type="time"
                value={time}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChangeTime(e.target.value)}
                className="w-[240px]"
            />
        </Popover>
    )
}