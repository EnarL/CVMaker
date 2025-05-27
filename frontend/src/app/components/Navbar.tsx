import Link from "next/link";
import React from "react";

const Navbar: React.FC = () => {
    return (
        <nav className="bg-gray-900 text-white p-4 flex justify-between">
            <Link href="/" className="text-xl font-bold">DevCard</Link>
            <div className="space-x-4">
                <Link href="/dashboard">Dashboard</Link>
                <Link href="/login">Login</Link>
            </div>
        </nav>
    );
};

export default Navbar;