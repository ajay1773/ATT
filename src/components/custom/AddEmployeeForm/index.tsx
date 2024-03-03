import { zodResolver } from "@hookform/resolvers/zod";
import { Gender, RoleGroup, RoleNames, User } from "@prisma/client";
import { Select } from "@radix-ui/react-select";
import { map, values } from "lodash";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";
import { removeUnderscore } from "~/lib/utils";
import { api } from "~/trpc/react";
import { addUser } from "~/actions/user";
import { useTransition } from "react";
import { MultiSelect } from "~/components/ui/multi-select";
import { TAddNewUserInputSchema } from "~/server/api/modules/user/schema";

const addEmployeeFormSchema = z
  .object({
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
    password: z.string({ required_error: "Password is required." }),
    confirmPassword: z.string({
      required_error: "Confirm Password is required.",
    }),
    reportsTo: z
      .array(z.string())
      .nonempty({ message: "At Least one value required" }),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: "custom",
        message: "Passwords do no match.",
        path: ["confirmPassword"],
      });
    }
  });

export type TAddEmployeeFormSchema = z.infer<typeof addEmployeeFormSchema>;

export default function AddEmployeeForm() {
  const [isPending, startTransition] = useTransition();
  const form = useForm<TAddEmployeeFormSchema>({
    resolver: zodResolver(addEmployeeFormSchema),
    defaultValues: {
      firstName: undefined,
      lastName: undefined,
      email: undefined,
      phoneNo: undefined,
      address: undefined,
      state: undefined,
      pincode: undefined,
      password: undefined,
      confirmPassword: undefined,
      roleGroup: undefined,
      roleName: undefined,
      reportsTo: [],
    },
  });

  async function onSubmit(values: TAddNewUserInputSchema) {
    startTransition(async () => {
      try {
        const data = await addUser(values);
        console.log(data);
      } catch (error) {
        console.error(error);
      }
    });
  }

  const { data: users, isLoading } = api.user.getAllUsers.useQuery<User[]>(
    undefined,
    {
      refetchOnWindowFocus: false,
    },
  );

  let userOptions: { name: string; label: string; value: User }[] = [];
  if (users && users.length) {
    userOptions = users?.map((_u) => ({
      name: _u.id,
      label: `${_u.firstName} ${_u.lastName}`,
      value: _u,
    }));
  }

  return (
    <div className="flex w-full flex-col">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full flex-col gap-4"
        >
          <div className="flex w-full flex-col flex-wrap gap-2">
            <h2 className="text-lg font-semibold">Personal Details</h2>
            <div className="flex w-full gap-4">
              <FormField
                name="firstName"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="w-1/4">
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="lastName"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="w-1/4">
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="w-1/4">
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="jk**$A321**"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="confirmPassword"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="w-1/4">
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="jk**$A321**"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="flex w-full flex-col flex-wrap gap-2">
            <h2 className="text-lg font-semibold">Contact and Address Info</h2>
            <div className="flex w-full gap-4">
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="w-1/4">
                    <FormLabel>Email:</FormLabel>
                    <FormControl>
                      <Input placeholder="user@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="phoneNo"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="w-1/4">
                    <FormLabel>Phone no:</FormLabel>
                    <FormControl>
                      <Input placeholder="87213*12*1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="state"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="w-1/4">
                    <FormLabel>State</FormLabel>
                    <FormControl>
                      <Input placeholder="Los Angles" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="pincode"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="w-1/4">
                    <FormLabel>Pin Code</FormLabel>
                    <FormControl>
                      <Input placeholder="123123" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="w-1/2">
              <FormField
                name="address"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="123 Street, Bee Street, LA"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="flex w-full flex-col flex-wrap gap-2">
            <h2 className="text-lg font-semibold">Associates and Role Info</h2>
            <div className="flex w-full gap-4">
              <FormField
                control={form.control}
                name="roleName"
                render={({ field }) => (
                  <FormItem className="w-1/3">
                    <FormLabel>Role</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Role" />
                        </SelectTrigger>
                        <SelectContent>
                          {map(values(RoleNames), (role) => (
                            <SelectItem value={role}>
                              {removeUnderscore(role)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="roleGroup"
                render={({ field }) => (
                  <FormItem className="w-1/3">
                    <FormLabel>Role Group</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Role Group" />
                        </SelectTrigger>
                        <SelectContent>
                          {map(values(RoleGroup), (role) => (
                            <SelectItem value={role}>
                              {removeUnderscore(role)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="reportsTo"
                render={({ field: { onChange, value } }) => (
                  <FormItem className="flex w-1/3 flex-col justify-end">
                    <FormLabel>Associates</FormLabel>
                    <FormControl>
                      <MultiSelect
                        loading={isLoading}
                        values={value}
                        options={userOptions}
                        onChange={onChange}
                      />
                    </FormControl>
                    <FormMessage />
                    {/* <DropdownMenu {...field}>
                    <DropdownMenuTrigger asChild>
                      <FormControl>
                        <Button variant="outline" disabled={isLoading}>
                          {isLoading ? (
                            <LoadingSpinner size={15} />
                          ) : (
                            <>
                              {field.value?.length
                                ? `${users?.find((user) => user.id === field.value[0])?.firstName} ${field.value?.length > 1 ? field.value?.length - 1 : ""}`
                                : "Select Associates"}
                            </>
                          )}
                        </Button>
                      </FormControl>
                    </DropdownMenuTrigger>
                    <FormMessage />
                    <DropdownMenuContent>
                      {map(users, (user) => (
                        <DropdownMenuCheckboxItem
                          checked={field.value?.includes(user.id)}
                          onCheckedChange={(val) => {
                            if (val) {
                              field.onChange([...field.value, user.id]);
                            } else {
                              field.onChange([
                                ...field.value.filter((val) => val !== user.id),
                              ]);
                            }
                          }}
                        >
                          {`${user.firstName}  ${user.lastName}`}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu> */}
                  </FormItem>
                )}
              ></FormField>
            </div>
          </div>
          <div className="!mt-6 flex w-full gap-4">
            <Button className="w-1/6" variant={"secondary"}>
              Cancel
            </Button>
            <Button disabled={isPending} className="w-1/6" type="submit">
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
