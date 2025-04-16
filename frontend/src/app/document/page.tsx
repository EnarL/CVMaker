"use client"
import React, { useState } from "react";

export default function DocumentEditor() {
    const [content, setContent] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const handleContentChange = (e: React.FormEvent<HTMLDivElement>) => {
        setContent(e.currentTarget.textContent || "");
    };

    const handleFocus = () => {
        setIsFocused(true);
    };

    const handleBlur = (e: React.FormEvent<HTMLDivElement>) => {
        if (!e.currentTarget.textContent) {
            setIsFocused(false);
        }
    };
    return (
        <div className="flex flex-col h-screen bg-gray-50">
            <div className="flex items-center justify-between bg-white p-3 shadow-sm border-b border-gray-200">
                <div className="flex items-center gap-3">
                    <button className="text-gray-700 px-3 py-1 rounded hover:bg-gray-100">
                        Print as PDF
                    </button>
                    <button className="text-gray-700 px-3 py-1 rounded hover:bg-gray-100">
                        Share Link
                    </button>
                    <button className="text-gray-700 px-3 py-1 rounded hover:bg-gray-100">
                        Add Users
                    </button>
                    <button className="text-gray-700 px-3 py-1 rounded hover:bg-gray-100">
                        Save Document
                    </button>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-gray-600 text-sm">Current Users:</span>
                    <div className="flex -space-x-2">
                        <img
                            src="https://via.placeholder.com/32"
                            alt="User 1"
                            className="w-8 h-8 rounded-full border border-gray-200"
                        />
                        <img
                            src="https://via.placeholder.com/32"
                            alt="User 2"
                            className="w-8 h-8 rounded-full border border-gray-200"
                        />
                    </div>
                </div>
            </div>
            <div className="flex-1 bg-white p-6 overflow-auto">
                <div
                    contentEditable
                    onInput={handleContentChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    className="border border-gray-300 p-4 rounded-lg min-h-full focus:outline-none focus:ring-1 focus:ring-gray-400"
                >
                    {!isFocused && content === "" && (
                        <span className="text-gray-400 pointer-events-none">
                            Start typing your document here...
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}