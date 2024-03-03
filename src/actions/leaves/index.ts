"use server";

import { TAddNewLeaveInputSchema } from "~/server/api/modules/leaves/schema";
import { api } from "~/trpc/server";

export async function applyNewLeave(params: TAddNewLeaveInputSchema) {
  const newUser = await api.leaves.applyNewLeave.mutate(params);
  return newUser;
}
