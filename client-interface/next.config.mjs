/**
 * @type {import('next').NextConfig}
 */
const isGithubActions = process.env.GITHUB_ACTIONS || false;

let assetPrefix = "";
const basePath = "";

if (isGithubActions) {
    // trim off `<owner>/`
    assetPrefix = `./`;
}

const nextConfig = {
    assetPrefix: assetPrefix,
    basePath: basePath,
};

export default nextConfig;
