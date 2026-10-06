import { Navigate, Route, Routes } from "react-router-dom";
import Login from "../pages/Login";
import AdminLayout from "../layouts/AdminLayout";
import ProtectedRoute from "./ProtectedRoute";
import Dashboard from "../pages/Dashboard";
import About from "../pages/About";
import Skills from "../pages/Skills";
import Projects from "../pages/Projects";
import Blogs from "../pages/Blogs";
import Experience from "../pages/Experience";
import Testimonials from "../pages/Testimonials";
import Services from "../pages/Services";
import Media from "../pages/Media";
import Messages from "../pages/Messages";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/about" element={<About />} />

          <Route path="/skills" element={<Skills />} />

          <Route path="/projects" element={<Projects />} />

          <Route path="/blogs" element={<Blogs />} />

          <Route path="/experience" element={<Experience />} />

          <Route path="/testimonials" element={<Testimonials />} />

          <Route path="/services" element={<Services />} />

          <Route path="/media" element={<Media />} />

          <Route path="/messages" element={<Messages />} />
        </Route>
      </Route>

      <Route
        path="*"
        element={<Navigate to="/login" replace />}
      />
    </Routes>
  );
};

export default AppRoutes;