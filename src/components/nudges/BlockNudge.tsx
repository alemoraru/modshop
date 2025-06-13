"use client";

import {useState, useEffect} from "react";

interface PurchaseBlockNudgeProps {
    duration: number; // seconds
    onCompleteAction: () => void;
}

/**
 * PurchaseBlockNudge component displays a nudge to the user during a cool-down period
 * after they attempt to make a purchase. It shows a countdown timer and blocks further actions
 * until the timer expires, encouraging users to reconsider their purchase decision.
 * @param duration - The duration of the cool-down period in seconds.
 * @param onCompleteAction - Action to take when the cool-down period ends (e.g., allowing the purchase to proceed).
 */
export default function PurchaseBlockNudge({duration, onCompleteAction}: PurchaseBlockNudgeProps) {
    const [timeLeft, setTimeLeft] = useState(duration);

    useEffect(() => {
        if (timeLeft === 0) {
            onCompleteAction();
        }
    }, [timeLeft, onCompleteAction]);

    // Initialize, and reset the timer when duration changes
    useEffect(() => {
        setTimeLeft(duration);
    }, [duration]);

    // Countdown timer logic
    useEffect(() => {
        if (timeLeft === 0) return;
        const timer = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, [timeLeft]);

    return (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-md mx-4 text-center">
                <h3 className="text-lg font-semibold mb-4 text-red-600">
                    ⏳ Cool Down Period
                </h3>
                <p className="mb-4 text-gray-700">
                    Please take a moment to reconsider your purchase.
                    The checkout will be available in:
                </p>
                <div className="text-3xl font-bold text-red-600 mb-4">
                    {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                </div>
                <p className="text-sm text-gray-500">
                    This helps prevent impulse purchases.
                </p>
            </div>
        </div>
    );
}
