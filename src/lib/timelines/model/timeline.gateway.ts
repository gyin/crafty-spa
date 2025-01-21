export type GetUserTimelineResponse = {
    timeline: {
        user: string,
        id: string,
        messages: {
            id: string,
            text: string;
            author: string;
            publishedAt: string;
        }[],
    }
}

export interface TimelineGateway {
    getUserTimeline({ userId }: { userId: string }) :
    Promise<GetUserTimelineResponse>
}