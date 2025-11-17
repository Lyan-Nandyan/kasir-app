import React from "react";
import { NavLink } from "react-router-dom";

const Header = () => {
    const navLinkClass = ({ isActive }) =>
        `px-3 py-2 rounded transition-colors ${isActive ? "bg-blue-600 text-white" : "text-gray-200 hover:bg-gray-700"
        }`;

    return (
        <header className="bg-gray-800 text-white">
            <nav className="flex justify-between items-center px-3 py-4 ">
                <h1 className="text-xl font-bold">Kasir App</h1>
                <div className="flex gap-4">
                    <NavLink to="/" className={navLinkClass} end>
                        Kasir
                    </NavLink>
                    <NavLink to="/list" className={navLinkClass}>
                        Daftar Produk
                    </NavLink>
                    <NavLink to="/riwayat" className={navLinkClass}>
                        Riwayat Transaksi
                    </NavLink>
                    <NavLink to="/pendapatan" className={navLinkClass}>
                        Pendapatan
                    </NavLink>
                </div>
            </nav>
        </header>
    );
};

export default Header;
