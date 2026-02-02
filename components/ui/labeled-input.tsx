import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface LabeledInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
}

export function LabeledInput({ label, id, className, ...props }: LabeledInputProps) {
    return (
        <div className={`space-y-2 ${className}`}>
            <Label htmlFor={id}>{label}</Label>
            <Input id={id} {...props} />
        </div>
    )
}