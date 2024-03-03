"use client";
import { zodResolver } from "@hookform/resolvers/zod";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Calendar } from "~/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { RiCalendar2Line } from "react-icons/ri";
import { Textarea } from "~/components/ui/textarea";
import moment from "moment";
import { map, values } from "lodash";
import { LeaveType, Project, RoleNames, User } from "@prisma/client";
import { api } from "~/trpc/react";
import { MultiSelect } from "~/components/ui/multi-select";
import { useSession } from "next-auth/react";
import { removeUnderscore } from "~/lib/utils";
import { applyNewLeave } from "~/actions/leaves";
import { useTransition } from "react";
import { LoadingSpinner } from "~/components/ui/spinner";
import { useToast } from "~/components/ui/use-toast";

const applyLeaveFormSchema = z
  .object({
    leaveType: z.nativeEnum(LeaveType),
    projects: z
      .array(z.string())
      .nonempty({ message: "At Least one value required" }),
    peopleToInform: z
      .array(z.string())
      .nonempty({ message: "At Least one value required" }),
    timePeriod: z.object({
      from: z.date({ required_error: "Please select from date." }),
      to: z.date({ required_error: "Please select to date." }),
    }),
    remarks: z.string({ required_error: "Please add remarks." }),
  })
  .superRefine(({ peopleToInform }, ctx) => {
    if (!peopleToInform.length) {
      ctx.addIssue({
        code: "custom",
        message: "At least one associate required.",
        path: ["peopleToInform"],
      });
    }
  });

type TApplyLeaveFormSchema = z.infer<typeof applyLeaveFormSchema>;

type TApplyLeaveFormProps = {
  onFormSubmission: () => void;
};

export default function ApplyLeaveForm({
  onFormSubmission,
}: TApplyLeaveFormProps) {
  const { data: session } = useSession();
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const { data: users, isLoading } = api.user.getAllUsers.useQuery<User[]>(
    undefined,
    {
      refetchOnWindowFocus: false,
    },
  );

  const { data: projects, isLoading: isProjectsBeingLoaded } =
    api.user.getSingleUsersProjects.useQuery(
      { id: session?.user.id as string },
      {
        refetchOnWindowFocus: false,
      },
    );

  let projectOptions: { name: string; label: string; value: Project }[] = [];
  if (projects && projects.length) {
    projectOptions = projects?.map((_p) => ({
      name: _p.id,
      label: _p.name,
      value: _p,
    }));
  }

  const form = useForm<TApplyLeaveFormSchema>({
    resolver: zodResolver(applyLeaveFormSchema),
    defaultValues: {
      leaveType: undefined,
      peopleToInform: [],
      projects: [],
      timePeriod: {
        from: moment().toDate(),
        to: moment().add("day", 1).toDate(),
      },
      remarks: undefined,
    },
  });

  async function onSubmit(values: TApplyLeaveFormSchema) {
    startTransition(async () => {
      try {
        await applyNewLeave({
          type: values.leaveType,
          timePeriod: {
            from: values.timePeriod.from,
            to: values.timePeriod.to,
          },
          peopleToInform: values.peopleToInform,
          applicantId: session?.user.id as string,
          description: values.remarks,
          forProjects: values.projects,
        });
        toast({
          title: "Leave applied successfully.",
          className: "bg-green-500 text-white",
        });
        onFormSubmission();
      } catch (error) {
        console.error(error);
      }
    });
  }

  let userOptions: { name: string; label: string; value: User }[] = [];
  if (users && users.length) {
    userOptions = users?.map((_u) => ({
      name: _u.id,
      label: `${_u.firstName} ${_u.lastName}`,
      value: _u,
    }));
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex gap-6">
          <FormField
            control={form.control}
            name="leaveType"
            render={({ field }) => (
              <FormItem className="flex w-[50%] flex-col">
                <FormLabel>Leave Type</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger
                      className={`w-full ${!field.value ? "text-gray-500" : "font-medium text-black"}`}
                    >
                      <SelectValue placeholder="Select Leave Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {map(values(LeaveType), (_lt) => (
                        <SelectItem value={_lt}>
                          {removeUnderscore(_lt)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          ></FormField>
          <FormField
            control={form.control}
            name="peopleToInform"
            render={({ field: { onChange, value } }) => (
              <FormItem className="flex w-[50%] flex-col">
                <FormLabel>People to Inform</FormLabel>
                <FormControl>
                  <MultiSelect
                    loading={isLoading}
                    values={value}
                    options={userOptions}
                    onChange={onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          ></FormField>
        </div>
        <div className="flex gap-6">
          <FormField
            control={form.control}
            name="timePeriod"
            render={({ field }) => (
              <FormItem className="flex w-[50%] flex-col">
                <FormLabel>Time Period</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className="w-full font-normal"
                      >
                        <RiCalendar2Line className="mr-2 text-lg " />
                        <span>{`${moment(field.value.from).format("l")} - ${moment(field.value.to).format("l")}`}</span>
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="range"
                      selected={field.value}
                      onSelect={field.onChange}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          ></FormField>
          <FormField
            name="projects"
            control={form.control}
            render={({ field: { onChange, value } }) => (
              <FormItem className="flex w-[50%] flex-col">
                <FormLabel>Project/s</FormLabel>
                <FormControl>
                  <MultiSelect
                    loading={isProjectsBeingLoaded}
                    values={value}
                    options={projectOptions}
                    onChange={onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          name="remarks"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Remarks</FormLabel>
              <FormControl>
                <Textarea placeholder="Add remarks....." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="!mt-9 flex w-full gap-4">
          <Button className="w-1/2" variant={"secondary"}>
            Cancel
          </Button>
          <Button className="w-1/2" type="submit" disabled={isPending}>
            {isPending ? <LoadingSpinner size={15} color="#fff" /> : "Apply"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
