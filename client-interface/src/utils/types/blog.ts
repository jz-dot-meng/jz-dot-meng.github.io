export type BlogData = {
    title: string;
    secondaryTitle?: string;
    description: string;
    firstDrafted: Date;
    lastEdited?: Date;
    tags: string[];
};
