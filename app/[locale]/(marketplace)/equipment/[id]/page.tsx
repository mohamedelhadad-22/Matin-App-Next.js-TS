import { getTranslations } from "next-intl/server"
import { MOCK_EQUIPMENT } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/routing";
import { notFound } from "next/navigation";
import {
    CalendarDays,
    MapPin,
    User,
    ShieldCheck,
    Fuel,
    Gauge,
    CheckCircle2
} from "lucide-react";

interface EquipmentPageProps {
    params: Promise<{ id: string }>;
}

export default async function EquipmentDetailsPage({ params }: EquipmentPageProps) {
    const t = await getTranslations("marketplace.equipment");
    const { id } = await params;

    const equipment = MOCK_EQUIPMENT.find(eq => eq.id === id)
    if (!equipment) notFound()

    return (
        <div className="bg-gray-50 min-h-screen py-8">
            <div className="container mx-auto px-4">

                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                    <Link href="/search" className="hover:text-matin-primary">{t("breadcrumb")}</Link>
                    <span>/</span>
                    <span className="text-gray-900 font-medium">{equipment.category}</span>
                    <span>/</span>
                    <span>{equipment.name}</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Main Content (Right Side) */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Image Gallery Section */}
                        <div className="bg-white rounded-2xl overflow-hidden border shadow-sm">
                            <div className="aspect-video bg-gray-100 relative">
                                <img
                                    src={equipment.media?.[0] || "/images/placeholder.jpg"}
                                    alt={equipment.name}
                                    className="w-full h-full object-cover"
                                />
                                <Badge className="absolute top-4 left-4 text-sm px-3 py-1 uppercase">
                                    {equipment.status}
                                </Badge>
                            </div>
                        </div>

                        {/* Description Section */}
                        <div className="bg-white p-6 rounded-2xl border shadow-sm">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t("description")}</h2>
                            <p className="text-gray-600 leading-relaxed">
                                {equipment.description || t("noDescription")}
                            </p>

                            <div className="mt-6 flex flex-wrap gap-3">
                                {equipment.sectors.map(sector => (
                                    <Badge key={sector} variant="secondary">{sector}</Badge>
                                ))}
                            </div>
                        </div>

                        {/* Technical Specs Grid */}
                        <div className="bg-white p-6 rounded-2xl border shadow-sm">
                            <h3 className="text-xl font-bold text-gray-900 mb-6">{t("specs")}</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                <SpecItem icon={<Gauge />} label={t("model")} value={equipment.model} />
                                <SpecItem icon={<CalendarDays />} label={t("year")} value={equipment.manufacturingYear} />
                                <SpecItem icon={<Fuel />} label={t("fuelType")} value={equipment.fuelType || t("notSpecified")} />
                                <SpecItem icon={<MapPin />} label={t("location")} value={equipment.location} />
                                <SpecItem icon={<User />} label={t("operator")} value={equipment.withOperator ? t("withOperator") : t("withoutOperator")} />
                                <SpecItem icon={<ShieldCheck />} label={t("insurance")} value={t("included")} />
                            </div>
                        </div>
                    </div>

                    {/* Booking Sidebar (Left Side) */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-2xl border shadow-sm sticky top-24">
                            <h3 className="text-gray-500 text-sm font-medium mb-1">{t("dailyRateLabel")}</h3>
                            <div className="flex items-end gap-2 mb-6">
                                <span className="text-3xl font-bold text-matin-primary">
                                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'SAR', maximumFractionDigits: 0 }).format(equipment.dailyRate)}
                                </span>
                                <span className="text-gray-400 mb-1">{t("perDay")}</span>
                            </div>

                            {/* Booking Actions */}
                            <div className="space-y-3">
                                <Link href={`/equipment/${equipment.id}/book`} className="block w-full">
                                    <Button className="w-full h-12 text-lg font-bold" size="lg">
                                        {t("bookNow")}
                                    </Button>
                                </Link>

                                <Button variant="outline" className="w-full h-12">
                                    {t("contactOwner")}
                                </Button>
                            </div>

                            {/* Safety Features */}
                            <div className="mt-8 space-y-4 border-t pt-6">
                                <div className="flex gap-3">
                                    <CheckCircle2 className="text-green-600 w-5 h-5 flex-shrink-0" />
                                    <p className="text-sm text-gray-600">{t("inspected")}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

// Helper Component
function SpecItem({ icon, label, value }: { icon: any, label: string, value: any }) {
    return (
        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="text-matin-primary mt-1">{icon}</div>
            <div>
                <p className="text-xs text-gray-500 mb-1">{label}</p>
                <p className="font-semibold text-gray-900 text-sm">{value}</p>
            </div>
        </div>
    )
}