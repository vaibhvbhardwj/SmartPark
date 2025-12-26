import UserSidebar from "../components/UserSidebar";
import ActiveParkingCard from "../components/ActiveParkingCard";
import ParkingHistory from "../components/ParkingHistory";
import "../styles/userDashboard.css";

function UserDashboard() {
  return (
    <div className="user-layout">
      <UserSidebar />

      <main className="user-main">
        <header className="user-header">
          <h2>Welcome, User 👋</h2>
        </header>

        <section className="dashboard-grid">
          <div className="map-card">
            <h4>Live Parking Map</h4>
            <div className="map-placeholder">Map Coming Soon</div>
          </div>

          <ActiveParkingCard />
        </section>

        <ParkingHistory />
      </main>
    </div>
  );
}

export default UserDashboard;
