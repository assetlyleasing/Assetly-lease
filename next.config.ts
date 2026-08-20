import type { NextConfig } from "next";
import { fileURLToPath } from "node:url";

const nextConfig: NextConfig = {
  // The repository maintains its own CLAUDE.md contributor guide; stop Next.js
  // from generating and overwriting AGENTS.md / CLAUDE.md on dev server start.
  agentRules: false,
  turbopack: {
    // Pin the workspace root. Without this Turbopack walks up past the repo and
    // picks up an unrelated package-lock.json from the user's home directory.
    root: fileURLToPath(new URL(".", import.meta.url)),
  },
};

export default nextConfig;
