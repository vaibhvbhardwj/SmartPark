import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <header className="main-header">
      <div className="logo">
        <Link to="/">
          <img src="logo.png" className="logo-icon" ></img>
        </Link>
      </div>

      <nav className="main-nav">
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><a href="#why-us">Why Us</a></li>
          <li><a href="#features">Features</a></li>
          <li><a href="#pricing">Pricing</a></li>
          <li><a href="#contact">Contact</a></li>

          {/* Logged-in user links */}
          {token && role === "user" && (
            <li><Link to="/user">Dashboard</Link></li>
          )}

          {token && role === "admin" && (
            <li><Link to="/admin">Admin</Link></li>
          )}
        </ul>
      </nav>

      <div className="auth-buttons">
        {/* Show login/register ONLY when NOT logged in */}
        {!token && (
          <>
            <Link to="/login" className="btn btn-login">Login</Link>
            <Link to="/register" className="btn btn-register">Register</Link>
          </>
        )}

        {/* Show logout ONLY when logged in */}
        {token && (
          <button onClick={logout} className="btn btn-logout">
            Logout
          </button>
        )}
      </div>
    </header>
  );
}

export default Navbar;
