import { useState, useEffect } from "react";
import SideBar from "./SideBar";

export default function Layout({ children }) {
  const [showNav, setShowNav] = useState(true);

  function handleResize() {
    if (window.innerWidth <= 40) {
      setShowNav(false);
    } else {
      setShowNav(true);
    }
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      addEventListener("resize", handleResize);
    }

    return () => {
      removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="">
      {/* Sidebar */}
      {showNav && <SideBar showNav={showNav} />}

      {/* Main Content */}
      <main className={`pt-16 ${showNav ? "pl-56" : ""}`}>
        <div className="px-16 md:px-16">{children}</div>
      </main>
    </div>
  );
}
