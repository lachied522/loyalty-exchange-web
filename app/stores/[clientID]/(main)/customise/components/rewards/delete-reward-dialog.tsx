import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { Trash } from "lucide-react";


interface DeleteRewardDialogProps {
    rewardID: string
}

export default function DeleteRewardDialog({ rewardID }: DeleteRewardDialogProps) {

    return (
        <Dialog>
            <DialogTrigger>
                <Button
                    type="button"
                    variant='destructive'
                    className='flex items-center gap-1'
                >
                    <Trash size={16} />
                    Delete
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Are you sure?</DialogTitle>
                    <DialogDescription>
                        This will remove this reward from the app and prevent customers redeeming it.
                    </DialogDescription>
                </DialogHeader>

                <div className='w-full flex flex-row items-center justify-between'>
                    <DialogClose asChild>
                        <Button variant='secondary'>
                            Cancel
                        </Button>
                    </DialogClose>

                    <DialogClose asChild>
                        <Button variant='destructive'>
                            Confirm
                        </Button>
                    </DialogClose>
                </div>
            </DialogContent>
        </Dialog>
    )
}