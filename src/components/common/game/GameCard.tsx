//styling
import styles from "./GameCard.module.css";

type GameCardProps = {
  cardTitle?: string;
  cardTitleStyle?: any;
  cardSubTitle?: string;
  cardSubTitleStyle?: any;
};

export const GameCard: React.FunctionComponent<GameCardProps> = ({
  ...props
}) => {
  const { cardTitle, cardTitleStyle, cardSubTitle, cardSubTitleStyle } = props;
  return (
    <>
      <div className={styles.gamecard}>
        <div className={styles.subtitle} style={cardSubTitleStyle}>
          {cardSubTitle}
        </div>
        <div className={styles.title} style={cardTitleStyle}>
          {cardTitle}
        </div>
      </div>
    </>
  );
};
