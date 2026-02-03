import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Search } from "lucide-react";
import { ProductCard } from "@/components/ui/product-card";
import { MOCK_EQUIPMENT } from "@/lib/mock-data";

export default function LandingPage() {
    const t = useTranslations('LandingPage');
    const tCat = useTranslations('Categories');
    return (
        <div className="w-full">
            {/* Hero Section */}
            <section className="bg-matin-primary w-full text-white py-20 px-4">
                <div className="container mx-auto text-center">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">
                        {t('heroTitle')}
                    </h1>
                    <p className="text-lg opacity-90 mb-8">
                        {t('heroDescription')}
                    </p>

                    {/* Search Box Simulator */}
                    <div className="bg-white p-2 rounded-lg flex items-center gap-2 max-w-xl mx-auto shadow-xl">
                        <input
                            type="text"
                            placeholder={t('searchPlaceholder')}
                            className="flex-1 px-4 py-2 text-gray-800 outline-none"
                        />
                        <Button size="lg" className="rounded-md">
                            <Search className="w-4 h-4 mr-2" />
                            {t('searchButton')}
                        </Button>
                    </div>
                </div>
            </section>

            {/* Categories Teaser */}
            <section className="py-16 container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-10 text-gray-900">{t('categoriesTitle')}</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {['Heavy Machinery', 'Generators', 'Earthmovers', 'Cranes'].map((cat) => (
                        <div key={cat} className="p-6 border rounded-xl hover:shadow-lg transition cursor-pointer text-center bg-gray-50">
                            <span className="font-bold text-gray-700">{tCat(cat)}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* Featured Equipment Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-end mb-10">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900">{t('featuredTitle')}</h2>
                            <p className="text-gray-500 mt-2">{t('featuredDescription')}</p>
                        </div>
                        <Button variant="link" className="text-matin-primary">{t('viewAllButton')} &larr;</Button>
                    </div>

                    {/* Grid System */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {MOCK_EQUIPMENT.map((item) => (
                            <ProductCard key={item.id} item={item} />
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}