import { useState } from "react";
import {
  LayoutDashboard,
  User,
  Code2,
  FolderKanban,
  FileText,
  Briefcase,
  MessageSquareQuote,
  Wrench,
  Image,
  Mail,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const menuItems = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "About",
    path: "/about",
    icon: User,
  },
  {
    name: "Skills",
    path: "/skills",
    icon: Code2,
  },
  {
    name: "Projects",
    path: "/projects",
    icon: FolderKanban,
  },
  {
    name: "Blogs",
    path: "/blogs",
    icon: FileText,
  },
  {
    name: "Experience",
    path: "/experience",
    icon: Briefcase,
  },
  {
    name: "Testimonials",
    path: "/testimonials",
    icon: MessageSquareQuote,
  },
  {
    name: "Services",
    path: "/services",
    icon: Wrench,
  },
  {
    name: "Media",
    path: "/media",
    icon: Image,
  },
  {
    name: "Messages",
    path: "/messages",
    icon: Mail,
  },
];

const AdminLayout = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const closeMobileSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile Header */}
      <header className="fixed left-0 right-0 top-0 z-40 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 lg:hidden">
        <div>
          <h1 className="text-lg font-bold text-gray-900">Portfolio CMS</h1>
          <p className="text-xs text-gray-500">Admin Panel</p>
        </div>

        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="rounded-lg p-2 text-gray-700 transition hover:bg-gray-100"
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>
      </header>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <button
          type="button"
          onClick={closeMobileSidebar}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          aria-label="Close menu"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-64 flex-col bg-gray-900 text-white transition-transform duration-300 lg:z-30 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between border-b border-gray-800 px-6 py-6">
          <div>
            <h1 className="text-xl font-bold">Portfolio CMS</h1>
            <p className="mt-1 text-sm text-gray-400">Admin Panel</p>
          </div>

          <button
            type="button"
            onClick={closeMobileSidebar}
            className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-800 hover:text-white lg:hidden"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={closeMobileSidebar}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition ${
                    isActive
                      ? "bg-white text-gray-900"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  }`
                }
              >
                <Icon size={18} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* User / Logout */}
        <div className="border-t border-gray-800 p-4">
          <div className="mb-3">
            <p className="text-sm font-medium text-white">
              {user?.name || "Admin"}
            </p>

            <p className="mt-1 truncate text-xs text-gray-400">
              {user?.email || ""}
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm text-gray-300 transition hover:bg-red-600 hover:text-white"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="min-h-screen lg:ml-64">
        <div className="px-4 pb-8 pt-20 sm:px-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;