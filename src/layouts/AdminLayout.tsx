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

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white fixed left-0 top-0 h-screen flex flex-col">
        <div className="px-6 py-6 border-b border-gray-800">
          <h1 className="text-xl font-bold">Portfolio CMS</h1>
          <p className="text-sm text-gray-400 mt-1">Admin Panel</p>
        </div>

        <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition ${
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

        <div className="border-t border-gray-800 p-4">
          <div className="mb-3">
            <p className="text-sm font-medium text-white">
              {user?.name || "Admin"}
            </p>

            <p className="text-xs text-gray-400 mt-1">
              {user?.email || ""}
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-gray-300 hover:bg-red-600 hover:text-white transition"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1 min-h-screen">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;