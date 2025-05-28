"use client";
import React from "react";
import {useRouter} from "next/navigation";
import {DocumentTextIcon} from "@heroicons/react/24/outline";

const Home: React.FC = () => {
    const router = useRouter();

    const handleCreateCV = () => {
        router.push("/dashboard");
    };

    return (
        <main className="flex flex-col items-center justify-center min-h-screen px-4 bg-gradient-to-br from-blue-50 to-white text-center">
            <div className="flex flex-col items-center space-y-4">
                <DocumentTextIcon className="h-16 w-16 text-blue-500" />
                <h1 className="text-4xl font-bold text-gray-900">
                    Build Your Dev Resume
                </h1>
                <p className="text-gray-600 max-w-md text-base">
                    Create, preview, and share your professional resume in one place — effortlessly.
                </p>
                <button
                    onClick={handleCreateCV}
                    className="mt-4 px-5 py-2.5 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700 transition"
                >
                    Create a CV
                </button>
            </div>
        </main>
    );
};

export default Home;
