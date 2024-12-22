import Link from "next/link";
import React from "react";
import { Profile } from "./Profile";

export const Header: React.FunctionComponent = () => {
    return (
        <h4 className="flex">
            <div className="flex flex-1">
                <Link className="flex items-center" href="/">
                    @jz-dot-meng
                </Link>
            </div>
            <Profile />
        </h4>
    );
};
