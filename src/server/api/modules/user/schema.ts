import { Gender, RoleGroup, RoleNames } from "@prisma/client";
import { z } from "zod";

export const addNewUserInputSchema = z.object({
  firstName: z.string({ required_error: "First Name is required." }),
  email: z.string({ required_error: "Email is required." }).email(),
  address: z.string({ required_error: "Address is required." }),
  state: z.string({ required_error: "State is required." }),
  lastName: z.string().optional(),
  pincode: z.string({ required_error: "Pin Code is required." }),
  phoneNo: z.string({ required_error: "Phone No is required." }),
  dob: z.date({ required_error: "DOb is required" }),
  gender: z.nativeEnum(Gender),
  roleName: z.nativeEnum(RoleNames),
  roleGroup: z.nativeEnum(RoleGroup),
  password: z.string(),
  confirmPassword: z.string(),
  reportsTo: z.array(z.string()),
});

export const getUserProjectsInputSchema = z.object({
  id: z.string({ required_error: "User ID is required." }),
});

export const addNewGlobalSettingsRecord = z.object({
  id: z.string().optional(),
  latitude: z.number(),
  longitude: z.number(),
  shiftStartTime: z.string(),
  shiftEndTime: z.string(),
});

export type TGetUserProjectsInputSchema = z.infer<
  typeof getUserProjectsInputSchema
>;
export type TAddNewGlobalSettingsRecord = z.infer<
  typeof addNewGlobalSettingsRecord
>;
export type TAddNewUserInputSchema = z.infer<typeof addNewUserInputSchema>;
