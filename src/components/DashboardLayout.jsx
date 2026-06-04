import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const DashboardLayout = () => {
  return (
    <div className="dashboard">
      <Sidebar />
      <Outlet />
    </div>
  );
};

export default DashboardLayout;
