export const convertSnakeCaseToCamelCase = (str: string) => {
    // ex: create_item_collection -> createItemCollection
    return str.replace(/_([a-z])/g, (g) => g[1].toUpperCase())
}