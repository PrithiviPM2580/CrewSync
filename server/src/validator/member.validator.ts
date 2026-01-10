import { z } from "zod";

export const joinWorkspaceSchema = {
  params: z.object({
    inviteCode: z.string().min(6).max(16),
  }),
};

export type JoinWorkspaceType = z.infer<typeof joinWorkspaceSchema.params>;
