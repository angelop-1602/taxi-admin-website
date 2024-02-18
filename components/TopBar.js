import React from "react";
import { Dropdown } from "react-bootstrap";
import { FiLogOut, FiChevronDown } from "react-icons/fi";
import cvkatcoLogo from "../public/cvkatco-logo.png";



export default function TopBar({ showNav }) {
  return (
    <div className={`fixed w-full h-16 flex justify-between items-center transition-all duration-[400ms] ${showNav ? "pl-56" : ""}`}>
      <div className="pl-4 md:pl-16">
        <div className="flex items-center">
          <picture>
            <img src={cvkatcoLogo.src} className="rounded-full h-8 md:mr-4 border-2 border-white shadow-sm" alt="profile picture" />
          </picture>
          <span className="font-medium text-gray-700">CVKATCO</span>
        </div>
      </div>
      <div className="flex items-center pr-4 md:pr-16">
        <div className="relative inline-block text-left">
          <Dropdown align="end">
            <Dropdown.Toggle variant="secondary" id="dropdown-menu">
              <FiChevronDown className="h-5 w-5 text-gray-400" />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item>
                <FiLogOut className="mr-3 h-5 w-5 text-gray-400" />
                <button onClick={handleLogout}>Logout</button>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
    </div>
  );
}
