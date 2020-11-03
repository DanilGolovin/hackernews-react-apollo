export type Vote = {
    id: string,
    user: {
        id: string
    },
    link: Link,
}

export type Link = {
    createdAt: number,
    description: string,
    id: string,
    postedBy: {
        name: string
    },
    url: string,
    votes: Vote[],
}