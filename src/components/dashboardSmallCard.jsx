// src/components/dashboardSmallCard.jsx
import React from 'react';

const colorVariants = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    violet: "bg-violet-50 text-violet-600 border-violet-100",
    green: "bg-green-50 text-green-600 border-green-100",
    red: "bg-red-50 text-red-600 border-red-100",
    yellow: "bg-yellow-50 text-yellow-600 border-yellow-100",
    lime: "bg-lime-50 text-lime-600 border-lime-100",
    cyan: "bg-cyan-50 text-cyan-600 border-cyan-100",
    sky: "bg-sky-50 text-sky-600 border-sky-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
};

export default function DashboardSmallCard({ title, number, icon, bg_color, col_span = 1 }) {
    const colorClass = colorVariants[bg_color] || colorVariants.blue;

    return (
        <div className={`
            p-6 rounded-2xl border shadow-sm transition-all hover:shadow-md bg-white flex items-center gap-5
            ${col_span === 2 ? 'col-span-2' : 'col-span-1'}
        `}>
            <div className={`p-4 rounded-xl ${colorClass}`}>
                {icon}
            </div>
            <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                    {title}
                </p>
                <p className="text-2xl font-black text-slate-900 leading-none">
                    {number}
                </p>
            </div>
        </div>
    );
}