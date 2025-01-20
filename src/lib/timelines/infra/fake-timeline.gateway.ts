import { GetUserTimelineResponse, TimelineGateway } from "../model/timeline.gateway";

export class FakeTimelineGateway implements TimelineGateway {
    timelinesByUser: Map<string, {
        user: string,
        messages: {
            text: string;
            author: string;
            publishedAt: string;
        }[],
    }> = new Map();

    getUserTimeline({ userId }: { userId: string; }): Promise<GetUserTimelineResponse> {
        const timeline = this.timelinesByUser.get(userId);
        if (!timeline) return Promise.reject();

        return Promise.resolve({timeline: timeline});
    }
}

export const timelineGateway = new FakeTimelineGateway();
