import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Pencil, Plus } from "lucide-react";

export default function CreateStoreDialog() {

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant='ghost' className='flex items-center gap-3.5'>
                    <Plus size={16} />
                    Create New
                </Button>
            </DialogTrigger>
            <DialogContent className='md:min-w-[760px]'>
                <DialogHeader>
                    <DialogTitle>
                        Create New Store
                    </DialogTitle>
                </DialogHeader>

            </DialogContent>
        </Dialog>
    )
}