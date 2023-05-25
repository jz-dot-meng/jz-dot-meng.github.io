import Link from "next/link";
import React from "react";

export const DevFooter: React.FunctionComponent = () => {
    return (
        <footer className="pt-4 flex gap-6 md:gap-12 items-center justify-center text-xs">
            <Link href="/minigame/memory">minigames</Link>
            <Link href="/tools/lowercase-me">tools</Link>
        </footer>
    );
};
