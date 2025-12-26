import AdminNavbar from "../components/AdminNavbar";
import AdminSidebar from "../components/AdminSidebar";
import StatCard from "../components/StatCard";
import BookingTable from "../components/BookingTable";
import "../styles/admin.css";

function AdminDashboard() {
  return (
    <div className="admin-layout">
      <AdminSidebar />

      <div className="admin-main">
        <AdminNavbar />

        <div className="stats-grid">
          <StatCard title="Available Slots" value="125" />
          <StatCard title="Daily Revenue" value="₹1,000" />
          <StatCard title="Active Sessions" value="80" />
        </div>

        <div className="admin-section">
          <h3>Recent Transactions</h3>
          <BookingTable />
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
