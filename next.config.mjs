/**
 * @type {import('next').NextConfig}
 */
const isGithubActions = process.env.GITHUB_ACTIONS || false;

let assetPrefix = "";
let basePath = "";

if (isGithubActions) {
	// trim off `<owner>/`
	assetPrefix = `./`;
	basePath = `/`;
}

const nextConfig = {
	assetPrefix: assetPrefix,
	basePath: basePath,
};

export default nextConfig;
