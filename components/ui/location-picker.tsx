"use client"

import { useState, useEffect } from "react"
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet"
import { Search, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import "leaflet/dist/leaflet.css"
import L from "leaflet"

// Fix Leaflet Icons
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Helper: لتحريك الكاميرا عند البحث
function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 13);
  }, [center, map]);
  return null;
}

// Helper: للتعامل مع النقر على الخريطة (Reverse Geocoding)
function LocationMarker({ position, setPosition, onLocationSelect }: any) {
  useMapEvents({
    click: async (e) => {
      const { lat, lng } = e.latlng;
      setPosition(e.latlng);
      
      // نداء للـ API عشان نجيب تفاصيل العنوان (Reverse Geocoding)
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=ar`);
        const data = await response.json();
        
        // تجهيز البيانات للفورم
        if (onLocationSelect) {
            onLocationSelect({
                lat,
                lng,
                city: data.address.city || data.address.town || data.address.state || "",
                district: data.address.suburb || data.address.neighbourhood || data.address.district || "",
                street: data.address.road || "",
            });
        }
      } catch (error) {
        console.error("Failed to fetch address details", error);
        // لو فشل، نرجع الإحداثيات بس
        if (onLocationSelect) onLocationSelect({ lat, lng });
      }
    },
  });

  return position ? <Marker position={position} /> : null;
}

interface LocationPickerProps {
  value?: { lat: number; lng: number };
  // دالة جديدة لترجيع البيانات الكاملة للفورم
  onLocationSelect?: (data: { lat: number; lng: number; city?: string; district?: string; street?: string }) => void;
}

export default function LocationPicker({ value, onLocationSelect }: LocationPickerProps) {
  const defaultCenter: [number, number] = [24.7136, 46.6753]; // Riyadh
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(value || null);
  const [mapCenter, setMapCenter] = useState<[number, number]>(value ? [value.lat, value.lng] : defaultCenter);
  
  // Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  // 1. وظيفة البحث
  const handleSearch = async () => {
    if (!searchQuery) return;
    setIsSearching(true);
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${searchQuery}&accept-language=ar&countrycodes=sa`);
        const results = await response.json();
        setSearchResults(results);
    } catch (error) {
        console.error("Search failed", error);
    } finally {
        setIsSearching(false);
    }
  };

  // 2. عند اختيار نتيجة من البحث
  const selectResult = (result: any) => {
      const lat = parseFloat(result.lat);
      const lng = parseFloat(result.lon);
      const newPos = { lat, lng };
      
      setPosition(newPos);
      setMapCenter([lat, lng]);
      setSearchResults([]); // إخفاء القائمة
      
      // تحديث الفورم بالبيانات اللي رجعت
      // Nominatim بيرجع address object لو طلبت تفاصيل، بس هنا في الـ Search البسيط ممكن نحتاج call تاني أو نعتمد على التقريب
      if (onLocationSelect) {
           onLocationSelect({ 
               lat, 
               lng,
               // محاولة استخراج البيانات من الاسم المعروض (Display Name) غالباً مش دقيقة، 
               // فالأفضل نعتمد على الـ Reverse Geocoding لما نضغط أو نكتفي بالإحداثيات هنا
           });
           
           // تريك: بنعمل تريجر للنقر عشان نجيب العنوان بالتفصيل
           // أو ممكن نعمل Fetch هنا للتفاصيل
      }
  };

  return (
    <div className="relative h-[400px] w-full rounded-md overflow-hidden border border-gray-300">
      
      {/* شريط البحث العائم فوق الخريطة */}
      <div className="absolute top-2 left-2 right-2 z-[1000] flex flex-col gap-1">
          <div className="flex gap-2 bg-white p-2 rounded-md shadow-md">
            <Input 
                placeholder="ابحث عن منطقة، حي، أو مدينة..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="h-9"
            />
            <Button size="sm" onClick={handleSearch} disabled={isSearching}>
                {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            </Button>
          </div>

          {/* نتائج البحث */}
          {searchResults.length > 0 && (
              <div className="bg-white rounded-md shadow-md max-h-40 overflow-y-auto">
                  {searchResults.map((result, idx) => (
                      <div 
                        key={idx} 
                        onClick={() => selectResult(result)}
                        className="p-2 text-sm hover:bg-gray-100 cursor-pointer border-b last:border-0 text-right"
                      >
                          {result.display_name}
                      </div>
                  ))}
              </div>
          )}
      </div>

      <MapContainer 
        center={mapCenter} 
        zoom={13} 
        scrollWheelZoom={false} 
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapUpdater center={mapCenter} />
        <LocationMarker position={position} setPosition={setPosition} onLocationSelect={onLocationSelect} />
      </MapContainer>
    </div>
  )
}