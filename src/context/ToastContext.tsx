import { createContext, useContext, useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";

interface ToastOverview {}
const ToastContext = createContext<ToastOverview | undefined>(undefined);

export const useToastContext = () => {
	const toastContext = useContext(ToastContext);
	if (toastContext === undefined) {
		throw new Error("LoggingContext not defined");
	}
	return toastContext;
};

export const ToastContextProvider = ({ children }: { children: React.ReactNode }) => {
	return (
		<ToastContext.Provider value={{}}>
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
