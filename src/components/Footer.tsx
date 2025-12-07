"use client"

import Link from "next/link"
import { Github, Info, Twitter, Facebook, Instagram, Linkedin } from "lucide-react"
import { appVersion } from "@/lib/constants"

const githubReleaseUrl = `/releases/tag/v${appVersion}`

/**
 * Footer component with links, social icons, and app version info.
 */
export default function Footer() {
    return (
        <footer className="w-full border-t bg-gray-50 text-gray-700 py-6 px-6">
            <div className="mx-auto flex flex-col gap-4 sm:grid sm:grid-cols-3 sm:items-center sm:justify-between text-sm px-0">
                {/* Left: Links */}
                <div className="flex gap-4 justify-center sm:justify-start order-1 pl-0 sm:pl-2">
                    <Link href="/privacy-policy" className="hover:underline">
                        Privacy Policy
                    </Link>
                    <Link href="/about" className="hover:underline">
                        About
                    </Link>
                </div>

                {/* Center: Socials */}
                <div className="flex gap-5 justify-center order-2">
                    <Link
                        href="https://twitter.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Twitter"
                    >
                        <Twitter className="w-5 h-5 hover:text-blue-400 transition-colors" />
                    </Link>
                    <Link
                        href="https://facebook.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Facebook"
                    >
                        <Facebook className="w-5 h-5 hover:text-blue-600 transition-colors" />
                    </Link>
                    <Link
                        href="https://instagram.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Instagram"
                    >
                        <Instagram className="w-5 h-5 hover:text-pink-500 transition-colors" />
                    </Link>
                    <Link
                        href="https://linkedin.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="LinkedIn"
                    >
                        <Linkedin className="w-5 h-5 hover:text-blue-700 transition-colors" />
                    </Link>
                    <Link
                        href="https://github.com/amoraru/modshop"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="GitHub"
                    >
                        <Github className="w-5 h-5 hover:text-gray-900 transition-colors" />
                    </Link>
                </div>

                {/* Right: Version */}
                <Link
                    href={`https://github.com/alemoraru/modshop${githubReleaseUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group font-mono flex items-center gap-1 hover:underline order-3 justify-center sm:justify-end pr-0 sm:pr-2"
                >
                    <span className="group-hover:text-blue-700 transition-colors duration-150">
                        v{appVersion}
                    </span>
                    <Info className="w-4 h-4 text-gray-600 group-hover:text-blue-600 group-hover:scale-110 transition-all duration-150" />
                </Link>
            </div>
        </footer>
    )
}
