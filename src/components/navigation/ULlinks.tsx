import React from "react";

//styling
import styles from "./ULlinks.module.css";

export type ULHorizontalLinkType = {
  url: string;
  name: string;
};

type ULHorizontalLinkProps = {
  linkMap: ULHorizontalLinkType[];
};

export const ULHorizontalLinks: React.FunctionComponent<
  ULHorizontalLinkProps
> = ({ ...props }) => {
  const { linkMap } = props;
  return (
    <ul className={styles.ullinkUl}>
      {linkMap.map((link: ULHorizontalLinkType, index) => (
        <li key={index}>
          <a href={link.url}>{link.name}</a>
        </li>
      ))}
    </ul>
  );
};
