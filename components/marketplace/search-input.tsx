"use client"

import { Input } from "@/components/ui/input"
import { Search as SearchIcon } from "lucide-react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { useTranslations } from "next-intl"

export function SearchInput({ defaultValue }: { defaultValue?: string }) {
    const t = useTranslations("SearchPage")
    const router = useRouter()
    const searchParams = useSearchParams()
    const pathname = usePathname()

    // this function will run when the user types
    const handleSearch = (term: string) => {
        const params = new URLSearchParams(searchParams.toString())

        if (term) {
            params.set("q", term)
        } else {
            params.delete("q")
        }

        // update url
        router.replace(`${pathname}?${params.toString()}`)
    }

    return (
        <div className="relative w-full md:w-96">
            <Input
                placeholder={t("searchPlaceholder")}
                className="pl-10"
                defaultValue={defaultValue}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        handleSearch(e.currentTarget.value)
                    }
                }}
            />
            <SearchIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        </div>
    )
}