export default function AdminDashboardPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">لوحة تحكم الإدارة 🛡️</h1>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* statistics for all MAteen Platform */}
                <div className="p-6 bg-white rounded-xl shadow border-l-4 border-blue-600">
                    <h3>إجمالي المستخدمين</h3>
                    <p className="text-2xl font-bold">1,250</p>
                </div>
                <div className="p-6 bg-white rounded-xl shadow border-l-4 border-green-600">
                    <h3>إجمالي الشركات</h3>
                    <p className="text-2xl font-bold">340</p>
                </div>
                <div className="p-6 bg-white rounded-xl shadow border-l-4 border-red-600">
                    <h3>بلاغات ونزاعات</h3>
                    <p className="text-2xl font-bold">12</p>
                </div>
            </div>
        </div>
    );
}