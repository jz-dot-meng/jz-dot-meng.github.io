export const addEllipses = (address: string, firstHalfOnly?: boolean) => {
    if (address.length < 12) {
        return address;
    }
    const sixthFromEnd = address.length - 6
    if (firstHalfOnly) {
        return `${address.substring(0, 6)}...`
    }
    return `${address.substring(0, 6)}...${address.substring(sixthFromEnd)}`
}