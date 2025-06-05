"use client";

import {useEffect} from "react";
import {X} from "lucide-react";

interface NotificationPopUpProps {
    open: boolean;
    message: string;
    onCloseAction: () => void;
    duration?: number;
}

export default function NotificationPopUp({open, message, onCloseAction, duration = 5000}: NotificationPopUpProps) {
    useEffect(() => {
        if (open) {
            const timer = setTimeout(() => {
                onCloseAction();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [open, duration, onCloseAction]);

    if (!open) return null;

    return (
        <div className="fixed bottom-6 right-6 z-50 opacity-0 animate-[appear_0.4s_ease-out_forwards]">
            <div className="bg-blue-600 text-white px-4 py-3 rounded shadow-lg flex items-center gap-3">
                <span className="text-xl">✅</span>
                <p>{message}</p>
                <button
                    onClick={onCloseAction}
                    className="ml-auto text-white hover:text-gray-200 text-lg font-bold"
                    aria-label="Close notification"
                >
                    <X className="cursor-pointer"/>
                </button>
            </div>
        </div>
    );
}
