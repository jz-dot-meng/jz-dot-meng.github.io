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

export type TimeElapsed = ReturnType<typeof getTimeElapsed>;

const getDaysAgo = (days: number) => `${days} day${days > 1 ? "s" : ""}`;
const getHoursAgo = (hours: number) => `${hours} hr${hours > 1 ? "s" : ""}`;

export const formatTimeElapsed = (elapsed: TimeElapsed, verbose = false) =>
    elapsed.dayElapsed > 0
        ? `${getDaysAgo(elapsed.dayElapsed)}${
              verbose ? ` ${getHoursAgo(elapsed.hourElapsed)} ${elapsed.minElapsed} min` : ""
          } ago`
        : elapsed.hourElapsed > 0
        ? `${getHoursAgo(elapsed.hourElapsed)}${
              verbose ? ` ${elapsed.minElapsed} min ${elapsed.secRemainder} sec` : ""
          } ago`
        : `${elapsed.minElapsed} min${verbose ? ` ${elapsed.secRemainder} sec` : ""} ago`;
