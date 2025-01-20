import { timelineGateway } from "../infra/fake-timeline.gateway";
import { authGateway } from "@/lib/auth/infra/fake-auth.gateway";
import { createAppAsyncThunk } from "../../create-app-thunk";

export const getAuthUserTimeline = createAppAsyncThunk("timelines/getAuthUserTimeline",
    async (_, { extra: { authGateway, timelineGateway }} ) => {
        
        const authUser = authGateway.getAuthUser();
        const { timeline } = await timelineGateway.getUserTimeline({ userId: authUser});
        
        return timeline;
    }
)