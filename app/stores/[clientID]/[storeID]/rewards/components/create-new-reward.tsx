import { Plus } from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import NewRewardForm from "./new-reward-form";

export default function CreateNewReward() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className='h-[300px] w-[240px] grid place-items-center border border-dashed border-neutral-200 rounded-xl cursor-pointer hover:scale-[102%] transition-all duration-300'>
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

                <NewRewardForm />
            </DialogContent>
        </Dialog>
    )
}