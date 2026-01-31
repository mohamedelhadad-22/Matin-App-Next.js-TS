"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { EquipmentSector } from "@/types"
import { useTranslations } from "next-intl"

const SECTORS: EquipmentSector[] = [
    "Construction",
    "Industrial",
    "Agricultural",
    "Transportation",
    "Mining",
    "Oil & Gas"
];

export function FilterSidebar() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const t = useTranslations('FilterSidebar')

    // 1. Read the current values from the URL (so they persist on refresh)
    const currentSector = searchParams.get("sector")
    const currentMinPrice = searchParams.get("min_price")
    const currentMaxPrice = searchParams.get("max_price")
    const pathname = usePathname()

    // Local state for the price range (to avoid page refresh on every keypress)
    const [priceRange, setPriceRange] = useState({
        min: currentMinPrice || "",
        max: currentMaxPrice || ""
    })
    const applyPriceFilter = () => {
        const params = new URLSearchParams(searchParams.toString())

        if (priceRange.min) {
            params.set("min_price", priceRange.min)
        } else {
            params.delete("min_price")
        }

        if (priceRange.max) {
            params.set("max_price", priceRange.max)
        } else {
            params.delete("max_price")
        }

        router.push(`${pathname}?${params.toString()}`, { scroll: false })
    }
    // function to update the URL without a page refresh
    const updateFilter = (key: string, value: string | null) => {
        // get the current params
        const params = new URLSearchParams(searchParams.toString())
        if (value) {
            params.set(key, value) // add or update the value
            console.log(key)
            console.log(value)

        } else {
            params.delete(key) // remove the filter
        }
        console.log(params.toString())
        // update the URL without a page refresh
        router.push(`${pathname}?${params.toString()}`, { scroll: false })
    }

    return (
        <div className="bg-white p-5 rounded-lg border shadow-sm space-y-8">
            {/* 1. Filter by sector */}
            <div>
                <h3 className="font-bold mb-4 text-gray-900">{t('sectorTitle')}</h3>
                <div className="space-y-2">
                    {SECTORS.map((sector) => (
                        <div key={sector} className="flex items-center gap-2">
                            <input
                                type="radio" // temporary radio for now
                                id={sector}
                                name="sector"
                                value={sector}
                                checked={currentSector === sector}
                                onChange={(e) => updateFilter("sector", e.target.checked ? sector : null)}
                                className="w-4 h-4 text-matin-primary focus:ring-matin-primary border-gray-300"
                            />
                            <label htmlFor={sector} className="text-sm text-gray-600 cursor-pointer select-none">
                                {sector}
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            {/* 2. Filter by price */}
            <div>
                <h3 className="font-bold mb-4 text-gray-900">{t('priceTitle')}</h3>
                <div className="flex items-center gap-2">
                    <Input
                        type="number"
                        placeholder={t('priceFrom')}
                        value={priceRange.min}
                        onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                        className="h-9"
                    />
                    <span className="text-gray-400">-</span>
                    <Input
                        type="number"
                        placeholder={t('priceTo')}
                        value={priceRange.max}
                        onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                        className="h-9"
                    />
                </div>
                <Button
                    className="w-full mt-3"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                        applyPriceFilter()
                    }}
                >
                    {t('applyPriceButton')}
                </Button>
            </div>

            {/* 3. Reset button */}
            <Button
                variant="ghost"
                className="w-full text-red-500 hover:text-red-600 hover:bg-red-50"
                onClick={() => router.push(`${pathname}`)}
            >
                {t('resetButton')}
            </Button>

        </div>
    )
}