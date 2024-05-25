import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

interface CreateStoreDialogProps {
    children: React.ReactNode
}

export default function CreateStoreDialog({ children }: CreateStoreDialogProps) {

    return (
        <Dialog>
            <DialogTrigger asChild>
                { children }
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