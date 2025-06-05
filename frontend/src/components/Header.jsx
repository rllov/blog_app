import { Outlet, Link } from "react-router-dom";

export default function Header() {
  return (
    <div>
      <nav style={{ padding: 20, background: "#eee" }}>
        <Link to="/home" style={{ marginRight: 20 }}>
          Home
        </Link>
        <Link to="/posts" style={{ marginRight: 20 }}>
          Posts
        </Link>
      </nav>

      {/* Critical: This renders the child routes */}
      <Outlet />
    </div>
  );
}
