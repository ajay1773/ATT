import { zodResolver } from "@hookform/resolvers/zod";
import { Project, RoleGroup, RoleNames, User } from "@prisma/client";
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
import { MultiSelect } from "~/components/ui/multi-select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { StepProps } from "~/hoc/withMultiStepForm";
import { removeUnderscore } from "~/lib/utils";
import { api } from "~/trpc/react";

const employeeRoleInfoFormSchema = z.object({
  roleName: z.nativeEnum(RoleNames),
  roleGroup: z.nativeEnum(RoleGroup),
  reportsTo: z
    .array(z.string())
    .nonempty({ message: "At Least one value required" }),
  projects: z
    .array(z.string())
    .nonempty({ message: "At Least one value required" }),
});

type EmployeeRoleInfoFormSchemaType = z.infer<
  typeof employeeRoleInfoFormSchema
>;

type EmployeeRoleInfoFormProps = {};

export default function EmployeeRoleInfoForm({
  onNext,
  onPrev,
  formValues,
}: EmployeeRoleInfoFormProps & StepProps) {
  const form = useForm<EmployeeRoleInfoFormSchemaType>({
    resolver: zodResolver(employeeRoleInfoFormSchema),
    defaultValues: {
      roleGroup: formValues.roleGroup ? formValues.roleGroup : undefined,
      roleName: formValues.roleName ? formValues.roleName : undefined,
      reportsTo: formValues.reportsTo ? formValues.reportsTo : [],
      projects: formValues.projects ? formValues.projects : [],
    },
  });

  const { data: users, isLoading: isUsersLoading } =
    api.user.getAllUsers.useQuery<User[]>(undefined, {
      refetchOnWindowFocus: false,
    });

  const { data: projects, isLoading: isProjectsLoading } =
    api.project.getAllProjects.useQuery<Project[]>(undefined, {
      refetchOnWindowFocus: false,
    });

  let userOptions: { name: string; label: string; value: User }[] = [];
  if (users && users.length) {
    userOptions = users?.map((_u) => ({
      name: _u.id,
      label: `${_u.firstName} ${_u.lastName}`,
      value: _u,
    }));
  }

  let projectOptions: { name: string; label: string; value: Project }[] = [];
  if (projects && projects.length) {
    projectOptions = projects?.map((_p) => ({
      name: _p.id,
      label: _p.name,
      value: _p,
    }));
  }

  function onSubmit(values: EmployeeRoleInfoFormSchemaType) {
    onNext(values);
  }
  return (
    <Form {...form}>
      <form
        className="flex h-full flex-col justify-between gap-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
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
                    disabled={isUsersLoading}
                    loading={isUsersLoading}
                    values={value}
                    options={userOptions}
                    onChange={onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          ></FormField>
          <FormField
            control={form.control}
            name="projects"
            render={({ field: { onChange, value } }) => (
              <FormItem className="flex w-1/3 flex-col justify-end">
                <FormLabel>Projects</FormLabel>
                <FormControl>
                  <MultiSelect
                    disabled={isProjectsLoading}
                    loading={isProjectsLoading}
                    values={value}
                    options={projectOptions}
                    onChange={onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          ></FormField>
        </div>
        <div className="!mt-4 flex w-full gap-4">
          <Button className="w-1/6" onClick={onPrev} variant={"secondary"}>
            Previous
          </Button>
          <Button className="w-1/6" type="submit">
            Next
          </Button>
        </div>
      </form>
    </Form>
  );
}
