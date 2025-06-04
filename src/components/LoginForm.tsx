"use client";
import {useState} from "react";

export default function LoginForm({onLoginAction}: { onLoginAction: (email: string) => void }) {
    const [emailInput, setEmailInput] = useState("");
    return (
        <form
            onSubmit={e => {
                e.preventDefault();
                if (emailInput) onLoginAction(emailInput);
            }}
            className="space-y-4"
        >
            <input
                type="email"
                placeholder="Email"
                value={emailInput}
                onChange={e => setEmailInput(e.target.value)}
                className="w-full border rounded px-3 py-2"
                required
            />
            <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded w-full hover:bg-blue-700 cursor-pointer"
            >
                Login
            </button>
        </form>
    );
}

