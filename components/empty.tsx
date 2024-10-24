import Image from "next/image"
interface EmptyProps {
    label: string;
}

export const Empty = ({label} : EmptyProps) => {
    return (
        <div className="h-full flex p-20 flex-col items-center justify-center">
           <div className="relative h-72 w-72">
            <Image alt="Empty" fill src="/empty.png"
             />
           </div>
           <p className="text-muted-foreground text-sm text-center">
            {label}
           </p>
        </div>
    )
}