import Image from "next/image";

import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog";


interface SampleTransactionButtonProps {
    children: React.ReactNode
}


export default function SampleTransactionButton({ children }: SampleTransactionButtonProps) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent>
                <Image
                    src='/images/sample-transaction.png'
                    alt='Sample Transaction'
                    width={800}
                    height={476}
                />
            </DialogContent>
        </Dialog>
    )
}