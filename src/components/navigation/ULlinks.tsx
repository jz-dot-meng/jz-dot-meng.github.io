import React from "react"

//styling
import './ULlinks.css'

export type ULlinkType = {
    url: string,
    name: string
}

type ULlinkProps = {
    linkMap: ULlinkType[]
}

export const ULlinks: React.FunctionComponent<ULlinkProps> = ({ ...props }) => {
    const { linkMap } = props;
    return (
        <ul className="ullink-ul">
            {linkMap.map((link: ULlinkType, index) => (
                <li key={index}><a href={link.url}>{link.name}</a></li>
            ))}
        </ul>
    )
}

