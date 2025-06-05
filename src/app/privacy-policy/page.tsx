"use client";

import Navbar from "@/components/Navbar";

export default function PrivacyPage() {
    return (
        <main className="min-h-screen bg-white text-gray-900">
            <Navbar/>
            <section className="max-w-3xl mx-auto px-6 py-12">
                <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>

                <p className="mb-4">
                    ModShop is an educational prototype created for research and learning purposes within a Master's
                    level course on Designing Human-Centered AI Systems.
                </p>

                <p className="mb-4">
                    As such, ModShop does not collect, store, or share any real personal information. All user data,
                    including profile info, cart contents, and past orders, are stored locally in your browser via
                    <strong> localStorage</strong> and shopping behavior and data is sent to our local server only for
                    the purpose of timely nudging and interaction design experiments.
                </p>

                <p className="mb-4">
                    This means:
                </p>

                <ul className="list-disc list-inside mb-4">
                    <li>We do not use cookies or third-party trackers.</li>
                    <li>No personal data is stored on remote servers.</li>
                    <li>You may clear your browser data at any time to delete all stored information.</li>
                </ul>

                <p className="mb-4">
                    Any behavioral data used for nudging (such as identifying impulsive behavior) is simulated or stored
                    locally and intended purely for interaction design experiments.
                </p>

                <p>
                    If this prototype is adapted for production use in the future, a full privacy policy and proper
                    data protection measures will be implemented, but for now, ModShop will likely remain only a
                    prototype for educational purposes.
                </p>
            </section>
        </main>
    );
}
