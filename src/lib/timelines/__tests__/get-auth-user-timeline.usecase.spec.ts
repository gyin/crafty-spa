import { createStore } from "@/lib/create-store";
import { expect, describe, test } from "vitest";
import { getAuthUserTimeline } from "../usecases/get-auth-user-timeline.usecase";
import { FakeTimelineGateway } from "../infra/fake-timeline.gateway";
import { FakeAuthGateway } from "@/lib/auth/infra/fake-auth.gateway";
import { selectMessage } from "../slices/messages.slice";
import { selectUserTimeline } from "../slices/timelines.slice";

describe("Feature: Retrieving authenticated user's timeline", () => {
    test("Example: Alice is authenticated and can see her timeline", async () => {
        givenAuthenticatedUserIs("Alice");
        givenExistingTimeline({
            id: "alice-timeline",
            user: "Alice",
            messages: [
                {
                    id: "msg1-id",
                    text: "Hello it's Bob", author: "Bob", publishedAt: "2023-05-16T12:06:00.000Z",
                },
                {
                    id: "msg2-id",
                    text: "Hello it's Alice", author: "Alice", publishedAt: "2023-05-16T12:05:00.000Z",
                },
            ]
        }
        );

        await whenRetrievingAuthenticatedUserTimeline();

        thenTheReceivedTimelineShouldBe({
            user: "Alice",
            id: "alice-timeline",
            messages: [
                {
                    id: "msg1-id",
                    text: "Hello it's Bob",
                    author: "Bob", publishedAt: "2023-05-16T12:06:00.000Z"
                },
                { id: "msg2-id", text: "Hello it's Alice", author: "Alice", publishedAt: "2023-05-16T12:05:00.000Z" },
            ]
        })
    })
});

const authGateway = new FakeAuthGateway();
const timelineGateway = new FakeTimelineGateway();
const store = createStore({ authGateway, timelineGateway });

function givenAuthenticatedUserIs(user: string) {
    authGateway.authUser = user;
}

function givenExistingTimeline(timeline: {
    user: string,
    id: string,
    messages: {
        id: string,
        text: string;
        author: string;
        publishedAt: string;
    }[],
}) {
    timelineGateway.timelinesByUser.set("Alice", timeline);
}

async function whenRetrievingAuthenticatedUserTimeline() {
    await store.dispatch(getAuthUserTimeline());
}

function thenTheReceivedTimelineShouldBe(expectedTimeLine: {
    user: string,
    id: string,
    messages: {
        id: string,
        text: string;
        author: string;
        publishedAt: string;
    }[],
}) {
    const authUserTimeline = selectUserTimeline(
    expectedTimeLine.id,
    store.getState()
  );

    expect(authUserTimeline).toEqual({
        id: expectedTimeLine.id,
        user: expectedTimeLine.user,
        messages: expectedTimeLine.messages.map((m) => m.id),
    });

    expectedTimeLine.messages.forEach((msg) => {
        expect(selectMessage(msg.id, store.getState())).toEqual(msg);
    })
}