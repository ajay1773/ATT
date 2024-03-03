"use server";

import { TAddEmployeeFormSchema } from "~/components/custom/AddEmployeeForm";
import { TAddNewUserInputSchema } from "~/server/api/modules/user/schema";
import { api } from "~/trpc/server";

export async function addUser(params: TAddNewUserInputSchema) {
  const newUser = await api.user.addNewUser.mutate(params);
  return newUser;
}
