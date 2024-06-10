import { Plus } from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import NewRewardForm from "./new-reward-form";

interface CreateNewReward {
    isLimitedTime?: boolean
}

export default function CreateNewReward({ isLimitedTime = false }: CreateNewReward) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className='w-[240px] min-h-[300px] grid place-items-center border border-dashed border-neutral-200 rounded-xl cursor-pointer hover:scale-[102%] transition-all duration-300'>
                    <div className='h-16 w-16 grid place-items-center bg-neutral-100 rounded-full '>
                        <Plus size={32} color='black' />
                    </div>
                </div>
            </DialogTrigger>
            <DialogContent className='md:min-w-[760px]'>
                <DialogHeader>
                    <DialogTitle>
                        Create New Reward
                    </DialogTitle>
                </DialogHeader>

                <NewRewardForm isLimitedTime={isLimitedTime} />
            </DialogContent>
        </Dialog>
    )
}