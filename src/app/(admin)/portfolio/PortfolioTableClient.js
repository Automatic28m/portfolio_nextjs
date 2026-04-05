'use client';
import React, { useState, useMemo, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import Image from 'next/image';
import Link from 'next/link';
import { toast, Toaster } from 'react-hot-toast';
import { deletePortfolioAction } from '@/actions/portfolioActions';
import { Edit3, Image as ImageIcon, Trash2, Search } from 'lucide-react';

export default function PortfolioTableClient({ initialData }) {
    const [filterText, setFilterText] = useState('');
    const [data, setData] = useState(initialData);
    
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const filteredItems = data.filter(item => 
        item.title?.toLowerCase().includes(filterText.toLowerCase())
    );

    const handleDelete = async (id) => {
        if (!confirm(`Are you sure you want to delete ID: ${id}?`)) return;
        const loadingToast = toast.loading('Deleting...');
        const result = await deletePortfolioAction(id);
        if (result.success) {
            toast.success('Deleted successfully', { id: loadingToast });
            setData(prev => prev.filter(item => item.id !== id));
        } else {
            toast.error('Failed to delete', { id: loadingToast });
        }
    };

    const columns = [
        { name: 'ID', selector: row => row.id, sortable: true, width: '70px' },
        {
            name: 'Thumbnail',
            cell: row => (
                <div className="relative w-16 h-10 my-2 rounded overflow-hidden border border-slate-200">
                    <Image 
                        src={row.thumbnail || "/images/profile.png"} 
                        fill 
                        className="object-cover" 
                        alt="thumb" 
                    />
                </div>
            ),
            width: '100px'
        },
        { name: 'Title', selector: row => row.title, sortable: true, wrap: true },
        { name: 'Type', selector: row => row.type_title, sortable: true },
        { name: 'Date', selector: row => row.event_date, sortable: true },
        {
            name: 'Actions',
            cell: row => (
                <div className='flex gap-2'>
                    <Link href={`/admin/portfolio/edit/${row.id}`} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition">
                        <Edit3 size={18} />
                    </Link>
                    <Link href={`/admin/portfolio/gallery/${row.id}`} className="p-2 text-cyan-600 hover:bg-cyan-50 rounded-lg transition flex items-center gap-1">
                        <ImageIcon size={18} />
                        <span className="text-xs font-bold">({row.gallery_count})</span>
                    </Link>
                    <button onClick={() => handleDelete(row.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition">
                        <Trash2 size={18} />
                    </button>
                </div>
            ),
            width: '180px'
        }
    ];

    // ✅ 2. If not mounted yet, return a simple loading placeholder or null
    // This prevents the server from rendering the "complex" table HTML
    if (!isMounted) {
        return <div className="p-8 text-center text-slate-700">Loading Table...</div>;
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden text-slate-900">
            <Toaster />
            <div className="p-4 border-b border-slate-100 flex items-center gap-4 bg-slate-50/50">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                    <input 
                        type="text"
                        placeholder="Search projects..."
                        className="w-full pl-10 pr-4 py-2 bg-white text-slate-900 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                        value={filterText}
                        onChange={e => setFilterText(e.target.value)}
                    />
                </div>
            </div>

            <DataTable
                columns={columns}
                data={filteredItems}
                pagination
                responsive
                striped
                highlightOnHover
            />
        </div>
    );
}