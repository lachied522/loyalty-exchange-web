"use client";

import { type ClientState, useClientContext } from "../../context/ClientContext";

export default function Header() {
    const { clientData } = useClientContext() as ClientState;

    return (
        <div className='w-full px-6 py-6'>
            <div className='flex flex-row items-center justify-center gap-2'>
                <h3 className='font-semibold text-xl'>Welcome <span className='font-normal text-base'>{clientData.name}</span></h3>
            </div>
        </div>
    )
}