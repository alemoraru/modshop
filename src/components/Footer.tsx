"use client";

import Link from "next/link";
import {Github, Info, Twitter, Facebook, Instagram} from "lucide-react";
import {appVersion} from "@/lib/contstants";

const githubReleaseUrl = `/releases/tag/v${appVersion}`;

export default function Footer() {
    return (
        <footer
            className="w-full border-t bg-gray-50 text-gray-700 py-4 px-6 flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-between text-sm"
        >
            {/* Left: Privacy Policy & About */}
            <div className="flex gap-4 items-center justify-center order-1 sm:order-none">
                <Link href="/privacy-policy" className="hover:underline">Privacy Policy</Link>
                <Link href="/about" className="hover:underline">About</Link>
            </div>

            {/* Center: Socials */}
            <div className="flex gap-6 items-center justify-center order-3 sm:order-none">
                <Link href="https://twitter.com/" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                    <Twitter className="w-5 h-5 hover:text-blue-400"/>
                </Link>
                <Link href="https://facebook.com/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                    <Facebook className="w-5 h-5 hover:text-blue-600"/>
                </Link>
                <Link href="https://instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                    <Instagram className="w-5 h-5 hover:text-pink-500"/>
                </Link>
                <Link href="https://github.com/alemoraru/modshop-frontend" target="_blank" rel="noopener noreferrer"
                      aria-label="GitHub">
                    <Github className="w-5 h-5 hover:text-gray-900"/>
                </Link>
            </div>

            {/* Right: Version & Info */}
            <div className="flex items-center gap-2 relative justify-center order-2 sm:order-none">
                <Link
                    href={`https://github.com/alemoraru/modshop-frontend${githubReleaseUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group hover:underline font-mono flex items-center gap-1"
                >
                    <span className="group-hover:text-blue-700 transition-colors duration-150">v{appVersion}</span>
                    <Info
                        className="w-4 h-4 text-gray-600 group-hover:text-blue-600 group-hover:scale-110
                        transition-all duration-150"
                    />
                </Link>
            </div>
        </footer>
    );
}
