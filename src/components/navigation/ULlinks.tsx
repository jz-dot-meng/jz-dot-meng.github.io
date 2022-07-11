import React from "react"

//styling
import './ULlinks.css'

export type ULHorizontalLinkType = {
    url: string,
    name: string
}

type ULHorizontalLinkProps = {
    linkMap: ULHorizontalLinkType[]
}

export const ULHorizontalLinks: React.FunctionComponent<ULHorizontalLinkProps> = ({ ...props }) => {
    const { linkMap } = props;
    return (
        <ul className="ullink-ul">
            {linkMap.map((link: ULHorizontalLinkType, index) => (
                <li key={index}><a href={link.url}>{link.name}</a></li>
            ))}
        </ul>
    )
}

