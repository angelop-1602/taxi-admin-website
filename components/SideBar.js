import { forwardRef } from "react";
import Link from "next/link";
import {
  HomeIcon,
  UserIcon,
  UserGroupIcon,
  CreditCardIcon,
  ArrowRightOnRectangleIcon
} from "@heroicons/react/24/solid/index";
import { useRouter } from "next/router";
import Router from "next/router";

const SideBar = forwardRef(({ showNav }, ref) => {
  const router = useRouter();
  const activeLinkStyle = {
    backgroundColor: "#116C92",
    color: "#F6F1F1",
  };

  const hoverLinkStyle = {
    backgroundColor: "#146C94",
    color: "#FFFFFF",
  };

  const neutralLinkStyle = {
    backgroundColor: "transparent",
    color: "#146C94",
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    Router.push("./LoginForm");
  };

  return (
    <div
      ref={ref}
      className="fixed w-60 h-full flex flex-col"
      style={{ backgroundColor: "#AFD3E2" }}
    >
      <div className="flex justify-center mt-6 mb-14">
        <picture>
          <img
            className="w-32 h-auto"
            src="/cvkatco-logo.png"
            alt="company logo"
          />
        </picture>
      </div>

      <div className="flex flex-col flex-grow">
        <Link href="/Dashboard">
          <div
            className={`pl-6 py-3 mx-5 rounded text-center cursor-pointer mb-3 flex items-center transition-colors`}
            style={
              router.pathname === "/Dashboard"
                ? activeLinkStyle
                : neutralLinkStyle
            }
          >
            <div className="mr-2">
              <HomeIcon className="h-5 w-5" />
            </div>
            <div>
              <p>Home</p>
            </div>
          </div>
        </Link>

        <Link href="/driver-pages/Drivers">
          <div
            className={`pl-6 py-3 mx-5 rounded text-center cursor-pointer mb-3 flex items-center transition-colors`}
            style={
              router.pathname.includes("/driver-pages/Drivers")
                ? activeLinkStyle
                : neutralLinkStyle
            }
          >
            <div className="mr-2">
              <UserIcon className="h-5 w-5" />
            </div>
            <div>
              <p>Drivers</p>
            </div>
          </div>
        </Link>

        <Link href="/passenger-pages/Passengers">
          <div
            className={`pl-6 py-3 mx-5 rounded text-center cursor-pointer mb-3 flex items-center transition-colors`}
            style={
              router.pathname.includes("/passenger-pages/Passengers")
                ? activeLinkStyle
                : neutralLinkStyle
            }
          >
            <div className="mr-2">
              <UserGroupIcon className="h-5 w-5" />
            </div>
            <div>
              <p>Passenger</p>
            </div>
          </div>
        </Link>

        {/* <Link href="/Income">
          <div
            className={`pl-6 py-3 mx-5 rounded text-center cursor-pointer mb-3 flex items-center transition-colors`}
            style={
              router.pathname.includes("/Income")
                ? activeLinkStyle
                : neutralLinkStyle
            }
          >
            <div className="mr-2">
              <CreditCardIcon className="h-5 w-5" />
            </div>
            <div>
              <p>Income</p>
            </div>
          </div>
        </Link> */}
      </div>

      <div className="fixed bottom-0 left-0 mb-6 ml-6">
        <button onClick={handleLogout} className="flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded-lg pl-5 pr-20 py-3">
          <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
          Logout
        </button>
      </div>
    </div>
  );
});

SideBar.displayName = "SideBar";

export default SideBar;
