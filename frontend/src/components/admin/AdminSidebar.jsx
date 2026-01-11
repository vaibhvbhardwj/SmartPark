import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Building2, 
  MapPin, 
  SquareParking, 
  Settings, 
  BarChart3,
  Users,
  Home
} from "lucide-react";
import "../../styles/admin/AdminSidebar.css";

export default function AdminSidebar() {
  const location = useLocation();

  const navItems = [
    { path: "/admin", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/admin/companies", icon: Building2, label: "Companies" },
    { path: "/admin/parking-areas", icon: MapPin, label: "Parking Areas" },
    { path: "/admin/slots", icon: SquareParking, label: "Manage Slots" },
    { path: "/admin/live-sessions", icon: Users, label: "Live Sessions" },
    { path: "/admin/reports", icon: BarChart3, label: "Reports" },
    { path: "/admin/advanced-analytics", icon: BarChart3, label: "Advance Reports" },
    { path: "/", icon: Home, label: "Back to Home" }
  ];

  return (
    <div className="admin-sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <SquareParking size={32} />
          <span>ADMIN</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map(item => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-item ${location.pathname === item.path ? "active" : ""}`}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}