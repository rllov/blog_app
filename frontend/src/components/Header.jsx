import { Outlet, Link } from "react-router-dom";

export default function Header() {
  return (
    <div>
      <nav style={{ padding: 20, background: "#eee" }}>
        <Link to="/" style={{ marginRight: 20 }}>
          Home
        </Link>
        <Link to="/login" style={{ marginRight: 20 }}>
          Login
        </Link>
        <Link to="/signup">Sign Up</Link>
      </nav>

      {/* Critical: This renders the child routes */}
      <Outlet />
    </div>
  );
}
