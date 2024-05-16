import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

import type { Reward } from "@/types/helpers";
import EditRewardForm from "./edit-reward-form";

interface RewardDialogProps {
    rewardData: Reward
}

export default function RewardDialog({ rewardData } : RewardDialogProps) {

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant='secondary' className='flex items-center gap-1'>
                    <Pencil size={16} />
                    Edit
                </Button>
            </DialogTrigger>
            <DialogContent className='md:min-w-[760px]'>
                <DialogHeader>
                    <DialogTitle>Edit Reward</DialogTitle>
                </DialogHeader>

                <EditRewardForm rewardData={rewardData}/>

            </DialogContent>
        </Dialog>
    )
}