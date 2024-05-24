"use client";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { type ClientIDState, useClientIDContext } from "../../../../context/ClientIDContext";
import { type CustomiseState, useCustomiseContext } from "../context/CustomiseContext";

export default function StoreSelector() {
    const { clientData } = useClientIDContext() as ClientIDState;
    const { setSelectedStoreID } = useCustomiseContext() as CustomiseState;

    return (
        <Select
            onValueChange={(value: string) => setSelectedStoreID(value)}
            defaultValue={clientData.stores[0].id}
        >
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="" />
            </SelectTrigger>
            <SelectContent>
                {clientData.stores.map((store) => (
                    <SelectItem
                        key={`select-${store.id}`}
                        value={store.id}
                        className='font-medium'
                    >
                        {store.name}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )

}