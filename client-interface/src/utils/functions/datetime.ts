export const getTimeElapsed = (now: number, time: number) => {
	const msElapsed = now - time;
	const secElapsed = Math.floor(msElapsed / 1000);
	const dayElapsed = Math.floor(secElapsed / (24 * 60 * 60));
	const hourElapsed = Math.floor(
		(dayElapsed === 0 ? secElapsed : secElapsed - dayElapsed * 24 * 60 * 60) / (60 * 60)
	);
	const minElapsed = Math.floor(
		(dayElapsed === 0 && hourElapsed === 0
			? secElapsed
			: secElapsed - dayElapsed * 24 * 60 * 60 - hourElapsed * 60 * 60) / 60
	);
	const secRemainder = secElapsed % 60;
	return {
		dayElapsed,
		hourElapsed,
		minElapsed,
		secRemainder,
	};
};
