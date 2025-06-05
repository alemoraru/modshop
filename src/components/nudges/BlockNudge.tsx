"use client";

import { useState, useEffect } from "react";

interface PurchaseBlockNudgeProps {
    duration: number; // seconds
    onComplete: () => void;
}

export default function PurchaseBlockNudge({ duration, onComplete }: PurchaseBlockNudgeProps) {
    const [timeLeft, setTimeLeft] = useState(duration);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    onComplete();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [onComplete]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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