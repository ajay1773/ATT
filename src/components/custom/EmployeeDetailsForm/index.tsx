import { zodResolver } from "@hookform/resolvers/zod";
import { Gender, RoleGroup, RoleNames } from "@prisma/client";
import classNames from "classnames";
import { map, values } from "lodash";
import { CalendarIcon } from "lucide-react";
import moment from "moment";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";
import { StepProps } from "~/hoc/withMultiStepForm";
import { removeUnderscore } from "~/lib/utils";

const employeeDetailsFormSchema = z.object({
  firstName: z.string({
    required_error: "First Name is required",
    invalid_type_error: "First Name must be string",
  }),
  lastName: z.string({
    required_error: "Last Name is required",
    invalid_type_error: "Last Name must be string",
  }),
  gender: z.nativeEnum(Gender),
  dob: z.date({ required_error: "Date of Birth is required" }),
  email: z.string({ required_error: "Email is required." }).email(),
  phoneNo: z.string({ required_error: "Phone No is required." }),
  state: z.string({
    required_error: "State is required",
  }),
  address: z.string({
    required_error: "Address is required",
  }),
  pincode: z.string({ required_error: "Pin Code is required." }),
});

type EmployeeDetailsFormSchemaType = z.infer<typeof employeeDetailsFormSchema>;

type EmployeeDetailsFormProps = {};

export default function EmployeeDetailsForm({
  onNext,
  formValues,
}: EmployeeDetailsFormProps & StepProps) {
  const form = useForm<EmployeeDetailsFormSchemaType>({
    resolver: zodResolver(employeeDetailsFormSchema),
    defaultValues: {
      firstName: formValues.firstName ? formValues.firstName : undefined,
      lastName: formValues.lastName ? formValues.lastName : undefined,
      dob: formValues.dob ? formValues.dob : undefined,
      email: formValues.email ? formValues.email : undefined,
      gender: formValues.gender ? formValues.gender : Gender["MALE"],
      phoneNo: formValues.phoneNo ? formValues.phoneNo : undefined,
      address: formValues.address ? formValues.address : undefined,
      state: formValues.state ? formValues.state : undefined,
      pincode: formValues.pincode ? formValues.pincode : undefined,
    },
  });
  function onSubmit(values: EmployeeDetailsFormSchemaType) {
    onNext(values);
  }
  return (
    <Form {...form}>
      <form
        className="flex h-full flex-col gap-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="flex h-full w-full flex-col gap-4">
          <div className="flex w-full gap-4">
            <FormField
              name="firstName"
              control={form.control}
              render={({ field }) => (
                <FormItem className="w-1/3">
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
                <FormItem className="w-1/3">
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dob"
              render={({ field }) => (
                <FormItem className="flex w-1/3 flex-col justify-end">
                  <FormLabel>Date of birth</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={classNames(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value ? (
                            moment(field.value).format("DD/MM/YYYY")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex w-full gap-4">
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem className="w-1/3">
                  <FormLabel>Gender</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Gender" />
                      </SelectTrigger>
                      <SelectContent>
                        {map(values(Gender), (gender) => (
                          <SelectItem key={gender} value={gender}>
                            {removeUnderscore(gender)}
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
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem className="w-1/3">
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
                <FormItem className=" w-1/3">
                  <FormLabel>Phone no:</FormLabel>
                  <FormControl>
                    <Input placeholder="87213*12*1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex w-full gap-4">
            <FormField
              name="address"
              control={form.control}
              render={({ field }) => (
                <FormItem className="w-1/2">
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
            <FormField
              name="state"
              control={form.control}
              render={({ field }) => (
                <FormItem className="w-1/2">
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
                <FormItem className="w-1/2">
                  <FormLabel>Pin Code</FormLabel>
                  <FormControl>
                    <Input placeholder="123123" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="!mt-4 flex w-full gap-4">
          <Button disabled className="w-1/6" variant={"secondary"}>
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
