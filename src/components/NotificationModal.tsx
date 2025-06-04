"use client";
import React from "react";

interface NotificationModalProps {
    open: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

export default function NotificationModal({open, onClose, children}: NotificationModalProps) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay with blur and semi-transparent black */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
                aria-label="Close notification overlay"
            />
            {/* Modal content */}
            <div
                className="relative bg-white border border-blue-200 shadow-xl rounded-xl px-8 py-6 flex flex-col items-center animate-fade-in z-10 min-w-[320px]">
                <button
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl font-bold cursor-pointer"
                    onClick={onClose}
                    aria-label="Close notification"
                >
                    ×
                </button>
                {children}
            </div>
        </div>
    );
}
