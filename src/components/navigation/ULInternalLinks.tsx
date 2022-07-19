import { Link } from "react-router-dom"
import { ULHorizontalLinkType } from "./ULlinks"

type ULHorizontalInternalLinksProps = {
    linkMap: ULHorizontalLinkType[]
}

export const ULHorizontalInternalLinks: React.FunctionComponent<ULHorizontalInternalLinksProps> = ({ ...props }) => {
    const { linkMap } = props
    return (
        <ul className="ullink-ul">
            {linkMap.map((link: ULHorizontalLinkType, index) => (
                <li key={index}><Link to={link.url} className='link'
                >{link.name}</Link></li>
            ))}
        </ul>
    )
}