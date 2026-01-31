"use client";

import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { CalendarDays, Gauge } from "lucide-react";
import { Equipment } from "@/types";
import SaudiRiyalIcon from "/images/Saudi_Riyal_icon.svg";

interface ProductCardProps {
    item: Equipment;
}
export function ProductCard({ item }: ProductCardProps) {
    const t = useTranslations('ProductCard');
    return (
        <div className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full">
            <div className="relative h-48 bg-gray-100 overflow-hidden">
                <div className="absolute top-3 left-3 z-10">
                    <Badge variant={item.status} className="uppercase tracking-wider text-[10px]">
                        {item.status}
                    </Badge>
                </div>

                <img
                    src={item.media[0]}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                        e.currentTarget.src = "/images/placeholder.png"
                    }}
                />
            </div>

            {/* 2. Content Area */}
            <div className="p-5 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <p className="text-xs text-matin-primary font-semibold mb-1">{item.category}</p>
                        <h3 className="font-bold text-gray-900 line-clamp-1">{item.name}</h3>
                    </div>
                </div>

                {/* Specs (Mocking specs based on documentation) */}
                <div className="flex gap-4 text-xs text-gray-500 my-3">
                    <div className="flex items-center gap-1">
                        <Gauge size={14} />
                        <span>{t('model')}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <CalendarDays size={14} />
                        <span>{t('daily')}</span>
                    </div>
                </div>

                {/* 3. Footer Area (Price & Action) */}
                <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-1">
                            <img src="/images/Saudi_Riyal_icon.svg" className="w-4 h-4" />
                            <span className="text-lg font-bold text-gray-900">
                                {new Intl.NumberFormat('en-US', {
                                    style: 'decimal',
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 0,
                                }).format(item.dailyRate)}
                            </span>
                            <span className="text-xs text-gray-400 font-normal"> / {item.frequencyRent}</span>
                        </div>
                    </div>

                    <Link href={`/equipment/${item.id}`}>
                        <Button size="sm" variant="outline">
                            {t('details')}
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}