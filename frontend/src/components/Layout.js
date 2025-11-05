import React, { useContext } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

function Layout() {
  const { logout } = useContext(AuthContext);

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-indigo-700 text-white p-4 flex justify-between">
        <div className="space-x-6">
          <NavLink to="/dashboard" className="hover:underline" activeclassname="underline">
            Dashboard
          </NavLink>
          <NavLink to="/marketplace" className="hover:underline" activeclassname="underline">
            Marketplace
          </NavLink>
          <NavLink to="/requests" className="hover:underline" activeclassname="underline">
            Requests
          </NavLink>
        </div>
        <button onClick={logout} className="bg-red-600 px-3 py-1 rounded hover:bg-red-700 transition">
          Logout
        </button>
      </nav>
      <main className="flex-grow p-6 bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
