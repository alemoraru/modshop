import nextCoreWebVitals from "eslint-config-next/core-web-vitals"
import nextTypescript from "eslint-config-next/typescript"

/**
 * ESLint configuration for a Next.js project using TypeScript.
 * Combines core web vitals and TypeScript configurations from eslint-config-next.
 */
const eslintConfig = [
    ...nextCoreWebVitals,
    ...nextTypescript,
    {
        ignores: ["node_modules/**", ".next/**", "out/**", "build/**", "next-env.d.ts"],
    },
]

export default eslintConfig
