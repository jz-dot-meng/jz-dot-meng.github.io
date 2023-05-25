import { ReactNode, forwardRef, useEffect, useImperativeHandle, useMemo, useState } from "react";

export type CarouselRef = {
    next: () => void;
    prev: () => void;
};
interface CarouselProps {
    children: ReactNode[];
    itemsToShow: number;
    childrenLength: number;
}
export const Carousel = forwardRef<CarouselRef, CarouselProps>(
    ({ children, itemsToShow, childrenLength }, ref) => {
        const [currentIndex, setCurrentIndex] = useState<number>(0);
        useEffect(() => {
            setCurrentIndex(childrenLength);
        }, [childrenLength]);

        const isRepeating = useMemo(() => {
            return childrenLength > itemsToShow;
        }, [childrenLength, itemsToShow]);
        const [transitionEnabled, setTransitionEnabled] = useState<boolean>(true);

        useImperativeHandle(ref, () => ({
            next: () => handleNext(),
            prev: () => handlePrev(),
        }));

        useEffect(() => {
            if (isRepeating && !transitionEnabled) {
                if (currentIndex >= childrenLength || currentIndex <= 2 * childrenLength - 1) {
                    // console.log("set transition true");
                    setTimeout(() => setTransitionEnabled(true), 50);
                }
            }
        }, [currentIndex, isRepeating, childrenLength]);

        const handleTransitionEnd = () => {
            if (isRepeating) {
                if (currentIndex === 0) {
                    setTransitionEnabled((prev) => false);
                    setCurrentIndex(childrenLength);
                    // console.log(`jumping currInd to ${Math.floor(childrenLength / 2)}`);
                } else if (currentIndex === 3 * childrenLength - 1) {
                    setTransitionEnabled((prev) => false);
                    setCurrentIndex(2 * childrenLength - 1);
                    // console.log(`jumping currInd to ${2 * childrenLength - 1}`);
                }
            }
        };

        const handleNext = () => {
            if (isRepeating || currentIndex < childrenLength - itemsToShow) {
                // console.log("next: setting current state", currentIndex + 1);
                setCurrentIndex((prevState) => prevState + 1);
            }
        };

        const handlePrev = () => {
            if (isRepeating || currentIndex > 0) {
                // console.log("prev: setting current state", currentIndex - 1);
                setCurrentIndex((prevState) => prevState - 1);
            }
        };

        const totalItems = useMemo(() => {
            return childrenLength * 3;
        }, [childrenLength]);

        const widthPercent = 100 * totalItems;
        const transformXPercent = (-1 * (currentIndex * 100)) / totalItems;

        // console.log({ widthPercent, transformXPercent });

        return (
            <div className="w-full overflow-hidden h-full">
                <div
                    className={`flex no-scrollbar transition-all flex overflow-y-hidden h-full`}
                    style={{
                        width: `calc(${widthPercent}%)`,
                        transform: `translateX(${transformXPercent}%)`,
                        transition: !transitionEnabled ? "none" : undefined,
                    }}
                    onTransitionEnd={() => handleTransitionEnd()}
                >
                    {children}
                    {children}
                    {children}
                </div>
            </div>
        );
    }
);
Carousel.displayName = "Carousel";
