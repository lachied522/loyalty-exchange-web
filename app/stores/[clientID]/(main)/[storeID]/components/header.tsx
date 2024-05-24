"use client";
import { type ClientIDState, useClientIDContext } from "../../../context/ClientIDContext";

export default function Header() {
    const { clientData } = useClientIDContext() as ClientIDState;

    return (
        <div className='w-full px-6 py-6'>
            <div className='flex flex-row items-center justify-center gap-2'>
                <h3 className='font-semibold text-xl'>Welcome <span className='font-normal text-base'>{clientData.name}</span></h3>
            </div>
        </div>
    )
}