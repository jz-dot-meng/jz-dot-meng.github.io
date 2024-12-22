import { createContext, useContext } from "react";
import { ToastContainer } from "react-toastify";

const ToastContext = createContext<null>(null);

export const useToastContext = () => {
    const toastContext = useContext(ToastContext);
    if (toastContext === null) {
        throw new Error("LoggingContext not defined");
    }
    return toastContext;
};

export const ToastContextProvider = ({
    children,
}: {
    children: React.ReactElement | React.ReactNode;
}) => {
    return (
        <ToastContext.Provider value={null}>
            <ToastContainer
                position="bottom-right"
                className={"text-xs bg-no-repeat bg-right-bottom"}
                autoClose={5000}
                closeOnClick
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />
            {children}
        </ToastContext.Provider>
    );
};
