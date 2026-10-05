import { useEffect, useState } from "react";
import {
  User,
  Code2,
  FolderKanban,
  FileText,
  Briefcase,
  MessageSquare,
  Image,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import api from "../services/api";

interface Stat {
  title: string;
  value: number;
  icon: typeof User;
  description: string;
}

const Dashboard = () => {
  const [counts, setCounts] = useState({
    about: 0,
    skills: 0,
    projects: 0,
    blogs: 0,
    experience: 0,
    messages: 0,
    media: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const [
          aboutResponse,
          skillsResponse,
          projectsResponse,
          blogsResponse,
          experienceResponse,
          messagesResponse,
          mediaResponse,
        ] = await Promise.all([
          api.get("/about"),
          api.get("/skills"),
          api.get("/projects"),
          api.get("/blogs"),
          api.get("/experience"),
          api.get("/contact"),
          api.get("/media"),
        ]);

        const skills = skillsResponse.data?.data || [];
        const projects = projectsResponse.data?.data || [];
        const blogs = blogsResponse.data?.data || [];
        const experience = experienceResponse.data?.data || [];
        const messages = messagesResponse.data?.data || [];
        const media = mediaResponse.data?.data || [];

        setCounts({
          about: aboutResponse.data?.data ? 1 : 0,
          skills: Array.isArray(skills) ? skills.length : 0,
          projects: Array.isArray(projects) ? projects.length : 0,
          blogs: Array.isArray(blogs) ? blogs.length : 0,
          experience: Array.isArray(experience) ? experience.length : 0,
          messages: Array.isArray(messages) ? messages.length : 0,
          media: Array.isArray(media) ? media.length : 0,
        });
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  const stats: Stat[] = [
    {
      title: "About",
      value: counts.about,
      icon: User,
      description: "Profile information",
    },
    {
      title: "Skills",
      value: counts.skills,
      icon: Code2,
      description: "Technical skills",
    },
    {
      title: "Projects",
      value: counts.projects,
      icon: FolderKanban,
      description: "Portfolio projects",
    },
    {
      title: "Blogs",
      value: counts.blogs,
      icon: FileText,
      description: "Published articles",
    },
    {
      title: "Experience",
      value: counts.experience,
      icon: Briefcase,
      description: "Work experience",
    },
    {
      title: "Messages",
      value: counts.messages,
      icon: MessageSquare,
      description: "Contact messages",
    },
    {
      title: "Media",
      value: counts.media,
      icon: Image,
      description: "Uploaded media",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-gray-950 via-gray-900 to-indigo-950 p-8 text-white shadow-lg">
        <div className="relative z-10">
          <div className="mb-3 flex items-center gap-2">
            <div className="rounded-lg bg-white/10 p-2">
              <Sparkles size={20} />
            </div>

            <span className="text-sm font-medium text-indigo-200">
              Portfolio Overview
            </span>
          </div>

          <h1 className="text-3xl font-bold md:text-4xl">
            Welcome back, Admin 👋
          </h1>

          <p className="mt-3 max-w-2xl text-gray-300">
            Manage your portfolio content, projects, skills, blogs and
            messages from one powerful dashboard.
          </p>
        </div>

        {/* Decorative circles */}
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-indigo-500/20 blur-2xl" />
        <div className="absolute -bottom-16 right-32 h-40 w-40 rounded-full bg-purple-500/20 blur-2xl" />
      </div>

      {/* Stats */}
      <div>
        <div className="mb-5">
          <h2 className="text-xl font-semibold text-gray-900">
            Portfolio Overview
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Your current portfolio content at a glance.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-gray-300 hover:shadow-lg"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {stat.title}
                    </p>

                    <p className="mt-2 text-4xl font-bold text-gray-900">
                      {loading ? "..." : stat.value}
                    </p>

                    <p className="mt-2 text-xs text-gray-500">
                      {stat.description}
                    </p>
                  </div>

                  <div className="rounded-xl bg-gray-100 p-3 transition group-hover:bg-gray-900 group-hover:text-white">
                    <Icon size={24} />
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
                  <span className="text-xs font-medium text-gray-400">
                    Total records
                  </span>

                  <ArrowUpRight
                    size={16}
                    className="text-gray-400 transition group-hover:text-gray-900"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Overview */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Content Summary */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Content Summary
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Quick look at your portfolio content.
              </p>
            </div>

            <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
              <FolderKanban size={22} />
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4">
              <div className="flex items-center gap-3">
                <Code2 size={19} className="text-gray-600" />
                <span className="text-sm font-medium text-gray-700">
                  Skills
                </span>
              </div>

              <span className="font-semibold text-gray-900">
                {counts.skills}
              </span>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4">
              <div className="flex items-center gap-3">
                <FolderKanban size={19} className="text-gray-600" />
                <span className="text-sm font-medium text-gray-700">
                  Projects
                </span>
              </div>

              <span className="font-semibold text-gray-900">
                {counts.projects}
              </span>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4">
              <div className="flex items-center gap-3">
                <FileText size={19} className="text-gray-600" />
                <span className="text-sm font-medium text-gray-700">
                  Blogs
                </span>
              </div>

              <span className="font-semibold text-gray-900">
                {counts.blogs}
              </span>
            </div>
          </div>
        </div>

        {/* Messages / Media */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Activity Overview
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Important items from your portfolio.
              </p>
            </div>

            <div className="rounded-xl bg-green-50 p-3 text-green-600">
              <MessageSquare size={22} />
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between rounded-xl border border-gray-100 p-4">
              <div className="flex items-center gap-3">
                <MessageSquare size={19} className="text-gray-500" />
                <span className="text-sm font-medium text-gray-700">
                  Messages
                </span>
              </div>

              <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-800">
                {counts.messages}
              </span>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-gray-100 p-4">
              <div className="flex items-center gap-3">
                <Image size={19} className="text-gray-500" />
                <span className="text-sm font-medium text-gray-700">
                  Media Files
                </span>
              </div>

              <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-800">
                {counts.media}
              </span>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-gray-100 p-4">
              <div className="flex items-center gap-3">
                <Briefcase size={19} className="text-gray-500" />
                <span className="text-sm font-medium text-gray-700">
                  Experience
                </span>
              </div>

              <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-800">
                {counts.experience}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Welcome Footer */}
      <div className="rounded-2xl bg-gray-900 p-7 text-white shadow-lg">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold">
              Your portfolio is looking good 🚀
            </h2>

            <p className="mt-2 text-sm text-gray-400">
              Keep your projects, skills and portfolio content updated.
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-gray-300">
            CMS is ready
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;