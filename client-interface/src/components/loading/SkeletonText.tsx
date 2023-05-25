import React, { useEffect, useRef, useState } from "react";
import styles from "./SkeletonText.module.css";

type SkeletonTextProp = {
    textLength: number;
    href?: string;
};

export const SkeletonText: React.FunctionComponent<SkeletonTextProp> = ({ ...props }) => {
    const { textLength, href } = props;

    const skeletonRef = useRef<HTMLDivElement>(null);
    const [textContent, setTextContent] = useState<any>(null);

    useEffect(() => {
        // console.log('repeat', textLength)
        const dummy = "a".repeat(textLength);
        setTextContent({ "--textContent": `"${dummy}"` });
    }, [textLength]);

    return (
        <a href={href}>
            <div ref={skeletonRef} className={styles.skeleton} style={textContent}></div>
        </a>
    );
};
