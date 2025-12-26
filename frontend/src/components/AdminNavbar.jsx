function AdminNavbar() {
  return (
    <header className="admin-navbar">
      <h2>ParkEase Admin</h2>
      <div className="admin-actions">
        <span>Admin</span>
        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = "/login";
          }}
        >
          Logout
        </button>
      </div>
    </header>
  );
}

export default AdminNavbar;
