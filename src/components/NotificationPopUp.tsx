"use client"

import { useEffect } from "react"
import { X } from "lucide-react"

interface NotificationPopUpProps {
    open: boolean
    message: string
    onCloseAction: () => void
    duration?: number
    type?: "success" | "warning"
}

/**
 * NotificationPopUp component displays a notification message that can be optionally closed by the user.
 * It automatically closes after a specified duration.
 */
export default function NotificationPopUp({
    open,
    message,
    onCloseAction,
    duration = 5000,
    type = "success",
}: NotificationPopUpProps) {
    useEffect(() => {
        if (open) {
            const timer = setTimeout(() => {
                onCloseAction()
            }, duration)
            return () => clearTimeout(timer)
        }
    }, [open, duration, onCloseAction])

    if (!open) return null

    let bgColor = "bg-blue-600"
    let icon = <span className="text-xl">✅</span>
    if (type === "success") {
        bgColor = "bg-green-600"
        icon = <span className="text-xl">✅</span>
    } else if (type === "warning") {
        bgColor = "bg-yellow-400 text-gray-900"
        icon = <span className="text-xl">⚠️</span>
    }

    return (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 opacity-0 animate-[appear_0.4s_ease-out_forwards]">
            <div className={`${bgColor} px-4 py-3 rounded shadow-lg flex items-center gap-3`}>
                {icon}
                <p>{message}</p>
                <button
                    onClick={onCloseAction}
                    className="ml-auto text-white hover:text-gray-200 text-lg font-bold"
                    aria-label="Close notification"
                >
                    <X className="cursor-pointer" />
                </button>
            </div>
        </div>
    )
}
