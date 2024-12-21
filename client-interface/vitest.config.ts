import { defineConfig } from "vite";

export default defineConfig(async () => {
    const tsconfigPaths = (await import("vite-tsconfig-paths")).default;
    return {
        plugins: [tsconfigPaths()],
        test: {
            // Other Vitest options here
        },
    };
});
