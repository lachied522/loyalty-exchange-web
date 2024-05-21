import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Pencil, Plus } from "lucide-react";

import type { Reward } from "@/types/helpers";
import EditRewardForm from "./edit-reward-form";

interface RewardDialogProps {
    rewardData?: Reward,
    isNewReward?: boolean
}

export default function RewardDialog({ rewardData, isNewReward = false } : RewardDialogProps) {

    return (
        <Dialog>
            <DialogTrigger asChild>
                {isNewReward ? (
                <Button variant='secondary' className='flex items-center gap-1'>
                    <Plus size={16} />
                    Create New
                </Button>
                ) : (
                <Button variant='ghost' className='flex items-center gap-1'>
                    <Pencil size={16} />
                    Edit
                </Button>
                )}
            </DialogTrigger>
            <DialogContent className='md:min-w-[760px]'>
                <DialogHeader>
                    <DialogTitle>
                        {isNewReward? 'Create New Reward': 'Edit Reward'}
                    </DialogTitle>
                </DialogHeader>

                <EditRewardForm rewardData={rewardData} />
            </DialogContent>
        </Dialog>
    )
}