import { cn } from "@/lib/utils";

interface OrderSummaryRowProps {
    label: string;
    value: string | number;
    isBold?: boolean;
    isTotal?: boolean;
}

export function OrderSummaryRow({ label, value, isBold, isTotal }: OrderSummaryRowProps) {
    return (
        <div className={cn(
            "flex justify-between",
            isTotal && "pt-4 border-t mt-2",
            isBold ? "text-lg font-bold text-matin-primary" : "text-sm"
        )}>
            <span className={cn("text-gray-600", isBold && "text-matin-primary")}>{label}</span>
            <span className="font-medium">{value}</span>
        </div>
    )
}