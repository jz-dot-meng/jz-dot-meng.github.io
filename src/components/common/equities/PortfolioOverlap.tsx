import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setStockOverlap,
  TickerOverlapPayload,
} from "../../../redux/equities/actions/etfOverlapActions";
import { ReduxRootState } from "../../../redux/store";
import { DisplayCommonStocks } from "./DisplayCommonStocks";
import { OverlapDetails } from "./OverlapDetails";

type PortfolioOverlapProps = {};

export const PortfolioOverlap: React.FunctionComponent<
  PortfolioOverlapProps
> = ({ ...props }) => {
  const overlaps = useSelector(
    (state: ReduxRootState) => state.equities.etfOverlap.overlap
  );
  const holdings = useSelector(
    (state: ReduxRootState) => state.equities.etfOverlap.etfHoldings
  );

  const dispatch = useDispatch();

  const [overlappingHoldings, setOverlappingHoldings] = useState<number>(0);

  const [commonStocks, setCommonStocks] = useState<string[]>([]);

  useEffect(() => {
    const stocks: TickerOverlapPayload = {};
    const etfs = Object.keys(holdings);
    etfs.forEach((currentEtf) => {
      const etfHoldings = holdings[currentEtf];
      etfHoldings.forEach((stock) => {
        if (stocks[stock.ticker] === undefined) {
          stocks[stock.ticker] = {
            sedol: stock.sedol,
            name: stock.name,
            etfs: {
              [currentEtf]: Number(stock.weight),
            },
          };
        } else {
          stocks[stock.ticker].etfs[currentEtf] = Number(stock.weight);
        }
      });
    });
    dispatch(setStockOverlap(stocks));
  }, [holdings]);

  useEffect(() => {
    let overlapping = 0;
    const common: string[] = [];
    const stocks = Object.keys(overlaps);
    stocks.forEach((stock) => {
      const isCash = overlaps[stock].sedol === "";
      if (Object.keys(overlaps[stock].etfs).length > 1 && !isCash) {
        common.push(stock);
        overlapping += 1;
      }
    });
    setCommonStocks(common);
    setOverlappingHoldings(overlapping);
  }, [overlaps]);

  return (
    <>
      <div style={{ display: "flex" }}>
        <OverlapDetails
          overlappingHoldings={overlappingHoldings}
          commonStocks={commonStocks}
        />
        <DisplayCommonStocks
          overlappingHoldings={overlappingHoldings}
          commonStocks={commonStocks}
        />
      </div>
    </>
  );
};
