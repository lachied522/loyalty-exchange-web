"use client";
import { useState, useRef } from "react";

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

import { type CustomiseState, useCustomiseContext } from "../../context/CustomiseContext";

interface DeleteRewardDialogProps {
    rewardID: string
}

export default function DeleteRewardDialog({ rewardID } : DeleteRewardDialogProps) {
    const { deleteRewardRecordAndUpdateState } = useCustomiseContext() as CustomiseState;
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const closeRef = useRef<HTMLButtonElement | null>(null);

    const onDelete = async () => {
        setIsLoading(true);

        try {
            await deleteRewardRecordAndUpdateState(rewardID);

            // close modal
            if (closeRef && closeRef.current) closeRef.current.click();
        } catch (e) {
            console.log(e);
            setIsLoading(false);
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
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
                        <Button
                            ref={closeRef}
                            variant='secondary'
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                    </DialogClose>

                    {isLoading ? (
                    <Button variant='secondary' disabled>
                        Please wait...
                    </Button>
                    ) : (
                    <Button variant='destructive' onClick={onDelete}>
                        Confirm
                    </Button> 
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}