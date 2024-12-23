import Cors from "cors";
import type { NextApiRequest, NextApiResponse } from "next";

// Initializing the cors middleware
// You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
const ALLOW_LIST = ["https://jz-dot-meng.vercel.app", "https://jz-dot-meng.github.io"];
if (process.env.NODE_ENV === "development") {
    ALLOW_LIST.push("http://localhost:3000");
}

const cors = Cors({
    methods: ["POST", "GET", "HEAD"],
    origin: (requestOrigin, callback) => {
        if (!requestOrigin) {
            callback(null, true);
            return;
        }
        const allowListMatch = ALLOW_LIST.findIndex((allowedDomain) =>
            requestOrigin.includes(allowedDomain)
        );
        if (allowListMatch === -1) {
            callback(new Error("Not allow-listed by CORS"));
        } else {
            callback(null, true);
        }
    },
});

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
function runMiddleware(
    req: NextApiRequest,
    res: NextApiResponse,
    fn: (req: NextApiRequest, res: NextApiResponse, resolve: (result: unknown) => void) => void
) {
    return new Promise((resolve, reject) => {
        fn(req, res, (result: unknown) => {
            if (result instanceof Error) {
                console.error(result);
                return reject(result);
            }
            return resolve(result);
        });
    });
}

export default function corsWrapper(
    handler: (req: NextApiRequest, res: NextApiResponse) => Promise<unknown>
) {
    return async (req: NextApiRequest, res: NextApiResponse) => {
        try {
            // Run the middleware
            console.log(req.headers);
            await runMiddleware(req, res, cors);
            // Rest of the API logic
            await handler(req, res);
        } catch (err: unknown) {
            let error: string;
            if (typeof err === "string") error = err;
            if (err instanceof Error) error = err.message;
            else error = JSON.stringify(err, Object.getOwnPropertyNames(err));
            console.warn(`Error with the middleware: ${error}`);
            return res.status(403).json({ success: false, error });
        }
    };
}
