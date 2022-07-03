import { useEffect, useRef, useState } from "react";
import "./SkeletonText.css"

type SkeletonTextProp = {
    textLength: number,
    href?: string,
}

export const SkeletonText = ({ ...props }) => {
    const { textLength, href } = props;

    const skeletonRef = useRef<HTMLDivElement>(null)
    const [textContent, setTextContent] = useState<any>(null);

    useEffect(() => {
        // console.log('repeat', textLength)
        let dummy = 'a'.repeat(textLength);
        setTextContent({ '--textContent': `\"${dummy}\"` })
    }, [])

    return (
        <a href={href}><div ref={skeletonRef} className="skeleton" style={textContent}></div></a>
    )
}