import {
  User,
  Code2,
  FolderKanban,
  FileText,
  Briefcase,
  MessageSquare,
  Image,
} from "lucide-react";

const Dashboard = () => {
  const stats = [
    {
      title: "About",
      value: "1",
      icon: User,
    },
    {
      title: "Skills",
      value: "0",
      icon: Code2,
    },
    {
      title: "Projects",
      value: "0",
      icon: FolderKanban,
    },
    {
      title: "Blogs",
      value: "0",
      icon: FileText,
    },
    {
      title: "Experience",
      value: "0",
      icon: Briefcase,
    },
    {
      title: "Messages",
      value: "0",
      icon: MessageSquare,
    },
    {
      title: "Media",
      value: "0",
      icon: Image,
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Dashboard
        </h1>

        <p className="mt-2 text-gray-600">
          Manage your portfolio content from one place.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">
                    {stat.title}
                  </p>

                  <p className="mt-2 text-3xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>

                <div className="rounded-lg bg-gray-100 p-3">
                  <Icon size={24} className="text-gray-700" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Welcome Section */}
      <div className="mt-8 rounded-xl bg-gray-900 p-8 text-white">
        <h2 className="text-2xl font-semibold">
          Welcome to your Portfolio CMS 👋
        </h2>

        <p className="mt-2 text-gray-300">
          You can manage your portfolio content, projects,
          blogs, skills, experience and media from the sidebar.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;