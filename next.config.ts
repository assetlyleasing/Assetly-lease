import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The repository maintains its own CLAUDE.md contributor guide; stop Next.js
  // from generating and overwriting AGENTS.md / CLAUDE.md on dev server start.
  agentRules: false,
};

export default nextConfig;
