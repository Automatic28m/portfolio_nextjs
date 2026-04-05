'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, Folder, FolderPlus, 
  Tag, DoorOpen, LogOut, ChevronRight 
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", href: "/dashboard", icon: <LayoutDashboard size={18} /> },
    { name: "Show all", href: "/portfolio", icon: <Folder size={18} /> },
    { name: "Add new", href: "/portfolio/create", icon: <FolderPlus size={18} /> },
    { name: "Tags", href: "/tags", icon: <Tag size={18} /> },
  ];

  return (
    <div className="h-full bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800">
      <div className="p-8">
        <div className="font-durer text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-100 bg-clip-text text-transparent leading-tight">
          PORTFOLIO<br/>ADMIN
        </div>
        <div className="h-px bg-slate-800 w-full mt-6" />
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                isActive ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20" : "hover:bg-slate-800 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <span className="text-sm font-medium">{item.name}</span>
              </div>
              {isActive && <ChevronRight size={14} />}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800 space-y-2">
        <Link href="/" className="flex items-center gap-3 px-4 py-3 text-sm hover:text-blue-400 transition">
          <DoorOpen size={18} /> Exit to Home
        </Link>
        <button className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 rounded-xl transition">
          <LogOut size={18} /> Logout
        </button>
      </div>
    </div>
  );
}