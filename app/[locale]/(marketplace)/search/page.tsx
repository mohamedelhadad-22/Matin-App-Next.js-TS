import { getTranslations } from "next-intl/server"
import { ProductCard } from "@/components/ui/product-card";
import { Button } from "@/components/ui/button";
import { Search as SearchIcon, SlidersHorizontal } from "lucide-react";
import { MOCK_EQUIPMENT } from "@/lib/mock-data";
import { FilterSidebar } from "@/components/marketplace/filter-sidebar";
import { EquipmentSector } from "@/types";
import { SearchInput } from "@/components/marketplace/search-input";


interface SearchPageProps {
    searchParams: Promise<{
        q?: string;
        sector?: string;
        min_price?: string;
        max_price?: string;
    }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
    const t = await getTranslations("SearchPage")
    const { q, sector, min_price, max_price } = await searchParams;

    const filteredData = MOCK_EQUIPMENT.filter((item) => {
        const query = q?.toLowerCase() || "";
        const matchesSearch = query
            ? item.name.toLowerCase().includes(query) ||
            item.brand.toLowerCase().includes(query) ||
            item.category.toLowerCase().includes(query)
            : true;

        const matchesSector = sector
            ? item.sectors.includes(sector as EquipmentSector)
            : true;

        const matchesMinPrice = min_price
            ? item.dailyRate >= Number(min_price)
            : true;

        const matchesMaxPrice = max_price
            ? item.dailyRate <= Number(max_price)
            : true;
        console.log(matchesSearch && matchesSector && matchesMinPrice && matchesMaxPrice)
        return matchesSearch && matchesSector && matchesMinPrice && matchesMaxPrice;

    })

    return (
        <div className="bg-gray-50 min-h-screen py-8">
            <div className="container mx-auto px-4">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8">
                    <SearchInput defaultValue={q} />

                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">{t("resultsCount", { count: filteredData.length })}</span>
                        <Button variant="outline" className="md:hidden">
                            <SlidersHorizontal className="h-4 w-4 mr-2" /> {t("filterButton")}
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

                    {/* Sidebar */}
                    <div className="hidden md:block col-span-1 space-y-6">
                        <FilterSidebar />
                    </div>

                    {/* Results Grid */}
                    <div className="col-span-1 md:col-span-3">
                        {filteredData.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredData.map((item) => (
                                    <ProductCard key={item.id} item={item} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-white rounded-lg border border-dashed">
                                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                    <SearchIcon className="text-gray-400" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-700">{t("noResults")}</h3>
                                <p className="text-gray-500 mt-2">{t("noResultsDescription")}</p>
                                <Button variant="link" className="text-matin-primary mt-2" >
                                    <a href="/search">{t("clearFilters")}</a>
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}