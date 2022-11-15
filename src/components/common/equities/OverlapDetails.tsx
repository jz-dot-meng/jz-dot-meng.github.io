import { useSelector } from "react-redux";
import { ReduxRootState } from "../../../redux/store";

import styles from "./OverlapDetails.module.css";

type OverlapDetailsProps = {
  overlappingHoldings: number;
  commonStocks: string[];
};

export const OverlapDetails: React.FunctionComponent<OverlapDetailsProps> = ({
  ...props
}) => {
  const { overlappingHoldings, commonStocks } = props;
  const holdings = useSelector(
    (state: ReduxRootState) => state.equities.etfOverlap.etfHoldings
  );

  return (
    <>
      {overlappingHoldings > 0 ? (
        <div className={styles.overlapDetailsContainer}>
          <div
            className={`${styles.overlapDetailsCard} ${styles.overlapDetailsBoldBorder}`}
          >
            <h4>{overlappingHoldings}</h4>
            <p>Number of overlapping holdings</p>
          </div>
          {Object.keys(holdings).map((etfTicker) => {
            const arrayOfHoldings = holdings[etfTicker].map(
              (stock) => stock.ticker
            );
            let noOfCommon = 0;
            let totalWeight = 0;
            commonStocks.forEach((ticker) => {
              if (arrayOfHoldings.indexOf(ticker) !== -1) {
                totalWeight += Number(
                  holdings[etfTicker][arrayOfHoldings.indexOf(ticker)].weight
                );
                noOfCommon += 1;
              }
            });
            // console.log({ etfTicker, arrayOfHoldings, noOfCommon })
            if (noOfCommon > 0) {
              return (
                <div
                  className={styles.overlapDetailsCard}
                  key={`${etfTicker}-count`}
                >
                  <h4>
                    {noOfCommon}{" "}
                    <span>
                      (
                      {((noOfCommon * 100) / arrayOfHoldings.length).toFixed(2)}
                      %, or {(totalWeight * 100).toFixed(2)}% by weight)
                    </span>
                  </h4>
                  <p>
                    of {etfTicker}'s {arrayOfHoldings.length} holdings in other
                    ETFs
                  </p>
                </div>
              );
            }
          })}
        </div>
      ) : (
        <></>
      )}
    </>
  );
};
