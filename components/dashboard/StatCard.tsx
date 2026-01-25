import React from 'react';

// Props interface definition
interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    trend?: string; // Optional: for showing growth/decline (e.g., "+5%")
}

export default function StatCard({ title, value, icon, trend }: StatCardProps) {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center justify-between">

                {/* Card Content */}
                <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
                    <h3 className="text-2xl font-bold text-gray-800">{value}</h3>

                    {trend && (
                        <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded mt-2 inline-block">
                            {trend}
                        </span>
                    )}
                </div>

                {/* Icon Wrapper */}
                <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-xl text-matin-primary">
                    {icon}
                </div>
            </div>
        </div>
    );
}