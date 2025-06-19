import { Outlet, Link } from "react-router-dom";

export default function Header() {
  return (
    <div>
      <nav style={{ padding: 20, background: "#eee" }}>
        <Link to="/auth/home" style={{ marginRight: 20 }}>
          Home
        </Link>
        <Link to="/auth/posts" style={{ marginRight: 20 }}>
          Posts
        </Link>
        <Link to="/auth/features" style={{ marginRight: 20 }}>
          Future Features
        </Link>
      </nav>

      {/* Critical: This renders the child routes */}
      <Outlet />
    </div>
  );
}
