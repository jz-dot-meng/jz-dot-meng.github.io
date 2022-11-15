import Link from "next/link";
import { ULHorizontalLinkType } from "./ULlinks";

import styles from "./ULlinks.module.css";

type ULHorizontalInternalLinksProps = {
  linkMap: ULHorizontalLinkType[];
};

export const ULHorizontalInternalLinks: React.FunctionComponent<
  ULHorizontalInternalLinksProps
> = ({ ...props }) => {
  const { linkMap } = props;
  return (
    <ul className={styles.ullinkUl}>
      {linkMap.map((link: ULHorizontalLinkType, index) => (
        <li key={index}>
          <Link href={link.url} className={styles.link}>
            {link.name}
          </Link>
        </li>
      ))}
    </ul>
  );
};
