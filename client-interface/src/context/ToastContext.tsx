import { ReactNode, createContext, useContext } from "react";
import { ToastContainer } from "react-toastify";

const ToastContext = createContext<undefined>(undefined);

export const useToastContext = () => {
    const toastContext = useContext(ToastContext);
    if (toastContext === undefined) {
        throw new Error("LoggingContext not defined");
    }
    return toastContext;
};

export const ToastContextProvider = ({ children }: { children: ReactNode }) => {
    return (
        <ToastContext.Provider value={undefined}>
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
