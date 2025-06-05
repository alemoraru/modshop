"use client";

import Link from "next/link";
import {Github, Info, Twitter, Facebook, Instagram} from "lucide-react";
import {useState} from "react";

const version = "0.1.0";
const githubReleaseUrl = `https://github.com/amoraru/modshop-frontend/releases/tag/v${version}`;

export default function Footer() {
    const [showInfo, setShowInfo] = useState(false);

    return (
        <footer
            className="w-full border-t bg-gray-50 text-gray-700 py-4 px-6 flex items-center justify-between text-sm">
            {/* Left: Privacy Policy & About */}
            <div className="flex gap-4 items-center">
                <Link href="/privacy-policy" className="hover:underline">Privacy Policy</Link>
                <Link href="/about" className="hover:underline">About</Link>
            </div>

            {/* Center: Socials */}
            <div className="flex gap-6 items-center">
                <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                    <Twitter className="w-5 h-5 hover:text-blue-400"/>
                </a>
                <a href="https://facebook.com/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                    <Facebook className="w-5 h-5 hover:text-blue-600"/>
                </a>
                <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                    <Instagram className="w-5 h-5 hover:text-pink-500"/>
                </a>
                <a href="https://github.com/amoraru/modshop-frontend" target="_blank" rel="noopener noreferrer"
                   aria-label="GitHub">
                    <Github className="w-5 h-5 hover:text-gray-900"/>
                </a>
            </div>

            {/* Right: Version & Info */}
            <div className="flex items-center gap-2 relative">
                <a href={githubReleaseUrl} target="_blank" rel="noopener noreferrer"
                   className="hover:underline font-mono">v{version}</a>
                <button
                    className="ml-1 p-1 rounded-full hover:bg-gray-200"
                    aria-label="Show version info"
                    onClick={() => setShowInfo((v) => !v)}
                >
                    <Info className="w-4 h-4"/>
                </button>
                {showInfo && (
                    <div className="absolute right-0 top-8 bg-white border rounded shadow px-4 py-2 text-xs z-10 w-56">
                        <div className="font-semibold mb-1">Webapp Version</div>
                        <div className="mb-2">{version}</div>
                        <a href={githubReleaseUrl} target="_blank" rel="noopener noreferrer"
                           className="text-blue-600 hover:underline">View Release on GitHub</a>
                    </div>
                )}
            </div>
        </footer>
    );
}

