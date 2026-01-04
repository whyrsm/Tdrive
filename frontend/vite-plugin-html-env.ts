import type { Plugin } from 'vite'

export function htmlEnvPlugin(): Plugin {
    return {
        name: 'html-transform',
        transformIndexHtml(html) {
            return html.replace(
                /%(\w+)%/g,
                (match, p1) => {
                    const value = process.env[p1]
                    // Only inject if the env var exists and is not empty
                    if (value && value !== 'G-XXXXXXXXXX') {
                        return value
                    }
                    // Return empty string if GA ID is not configured
                    return ''
                }
            )
        },
    }
}
