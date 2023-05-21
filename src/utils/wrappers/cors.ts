import type { NextApiRequest, NextApiResponse } from "next";
import Cors from "cors";

// Initializing the cors middleware
// You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
const ALLOW_LIST = ["https://jz-dot-meng.vercel.app", "https://jz-dot-meng.github.io"];
const cors = Cors({
	methods: ["POST", "GET", "HEAD"],
	origin: (requestOrigin, callback) => {
		if (!requestOrigin) {
			callback(new Error("No request origin, not allowed by CORS"));
			return;
		}
		const allowListMatch = ALLOW_LIST.indexOf(requestOrigin);
		if (allowListMatch === -1) {
			callback(new Error("Not allow-listed by CORS"));
		} else {
			callback(null, true);
		}
	},
});

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
function runMiddleware(req: NextApiRequest, res: NextApiResponse, fn: Function) {
	return new Promise((resolve, reject) => {
		fn(req, res, (result: any) => {
			if (result instanceof Error) {
				return reject(result);
			}

			return resolve(result);
		});
	});
}

export default async function corsWrapper(handler: any) {
	return async (req: NextApiRequest, res: NextApiResponse) => {
		// Run the middleware
		await runMiddleware(req, res, cors);
		// Rest of the API logic
		await handler(req, res);
	};
}
