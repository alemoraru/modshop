"use client"

import { Mail } from "lucide-react"
import React, { useState } from "react"
import Image from "next/image"
import Link from "next/link"

/**
 * This component renders a simple login form that allows users to enter their email
 * and submit it to trigger a login action.
 * @param onLoginAction - A callback function that is called with the entered email when the form is submitted.
 */
export default function LoginForm({ onLoginAction }: { onLoginAction: (email: string) => void }) {
    const [emailInput, setEmailInput] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/
        if (!emailRegex.test(emailInput)) {
            setError("Please enter a valid email address.")
            return
        }

        setLoading(true)
        setTimeout(() => {
            setLoading(false)
            onLoginAction(emailInput)
        }, 800)
    }

    return (
        <div className="flex min-h-[60vh] items-center justify-center bg-white px-4 py-10">
            <div className="w-full max-w-md rounded-xl shadow-lg bg-white border border-gray-300 p-8">
                {/* Login-form Header */}
                <div className="flex flex-col items-center mb-6">
                    <div className="w-16 h-16 mb-3 relative">
                        <Image
                            src="/modshop-icon-transparent.png"
                            alt="ModShop Logo"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800">Welcome to ModShop</h2>
                    <p className="text-sm text-gray-500">Enter your email to continue</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            <Mail size={18} />
                        </span>
                        <input
                            type="email"
                            placeholder="you@example.com"
                            value={emailInput}
                            onChange={e => setEmailInput(e.target.value)}
                            className="w-full border border-gray-300 rounded-md pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            autoFocus
                            required
                        />
                    </div>

                    {error && <div className="text-red-500 text-sm">{error}</div>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-medium flex justify-center items-center gap-2 transition disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {loading && (
                            <svg
                                className="animate-spin h-5 w-5 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                />
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8v8z"
                                />
                            </svg>
                        )}
                        {loading ? "Signing in..." : "Sign in"}
                    </button>
                </form>

                {/* Login-Form Footer */}
                <div className="mt-6 text-center text-xs text-gray-400">
                    <p>
                        This is a local session using your browser&#39;s storage only.
                        <br />
                        By signing in, you agree to our&nbsp;
                        <Link href="/privacy-policy" className="underline hover:text-blue-600">
                            Privacy Policy
                        </Link>
                        .
                    </p>
                </div>
            </div>
        </div>
    )
}
