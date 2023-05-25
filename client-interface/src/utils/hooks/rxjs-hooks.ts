import { useEffect, useRef, useState } from "react";
import { BehaviorSubject, Observable, Subscription } from "rxjs";

export const useObservableState = <T>(
	subject: BehaviorSubject<T> | Observable<T> | undefined,
	initialValue: T
): T => {
	/* eslint-disable react-hooks/rules-of-hooks */
	const [state, setState] = useState<T>(initialValue);
	const subscription = useRef<Subscription>();

	useEffect(() => {
		subscription.current?.unsubscribe();
		const newSubscription = subject?.subscribe(setState);
		subscription.current = newSubscription;
		return () => subscription.current?.unsubscribe();
	}, [subject]);

	return state;
};
