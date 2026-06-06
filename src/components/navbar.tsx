import Link from "next/link";
import { getUser } from "@/lib/auth";
import LogoutButton from "./logout-button";

export default async function Navbar() {
  const user = await getUser();

  return (
    <nav
      style={{
        borderBottom: "1px solid var(--border)",
        background: "var(--bg-card)",
        position: "sticky",
        top: 0,
        zIndex: 40,
        backdropFilter: "blur(12px)",
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 16px",
          height: 56,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            fontSize: 15,
            fontWeight: 600,
            color: "var(--text-primary)",
            letterSpacing: "-0.01em",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span
            style={{
              display: "inline-block",
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "var(--accent)",
              boxShadow: "0 0 8px var(--accent)",
            }}
          />
          hackathons
        </Link>

        {/* Nav links */}
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <NavLink href="/">Active</NavLink>
          <NavLink href="/past">Past</NavLink>
          <NavLink href="/sites">Sites</NavLink>

          <div
            style={{
              width: 1,
              height: 20,
              background: "var(--border)",
              margin: "0 8px",
            }}
          />

          {user ? (
            <LogoutButton />
          ) : (
            <Link href="/login" className="btn btn-secondary" style={{ fontSize: 12 }}>
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      style={{
        padding: "6px 12px",
        borderRadius: "var(--radius)",
        fontSize: 13,
        color: "var(--text-secondary)",
        transition: "color 0.15s ease, background 0.15s ease",
      }}
      className="nav-link"
    >
      {children}
      <style>{`
        .nav-link:hover {
          color: var(--text-primary) !important;
          background: var(--bg-elevated);
        }
      `}</style>
    </Link>
  );
}
