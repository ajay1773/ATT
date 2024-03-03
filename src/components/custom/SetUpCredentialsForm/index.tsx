"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { addUser } from "~/actions/user";
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
import { useToast } from "~/components/ui/use-toast";
import { StepProps } from "~/hoc/withMultiStepForm";
import { TAddNewUserInputSchema } from "~/server/api/modules/user/schema";

type SetUpCredentialsFormProps = {};

const passwordSchema = z
  .string({ required_error: "Please Enter Password" })
  .min(8, "Password must be at least 8 characters long")
  .max(50, "Password must be less than 50 characters")
  .regex(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/, {
    message:
      "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character",
  });

const confirmPasswordSchema = z.string({
  required_error: "Please enter the Confirmed Password",
});

const passwordFormSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: confirmPasswordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type TSetUpCredentialsFormSchema = z.infer<typeof passwordFormSchema>;

export default function SetUpCredentialsForm({
  onPrev,
  formValues,
  updateMultiStepFormValues,
}: SetUpCredentialsFormProps & StepProps) {
  const { toast } = useToast();
  const form = useForm<TSetUpCredentialsFormSchema>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      password: undefined,
      confirmPassword: undefined,
    },
  });

  async function onSubmit(values: TSetUpCredentialsFormSchema) {
    try {
      const userFormValues = {
        ...formValues,
        ...values,
      } as TAddNewUserInputSchema;
      updateMultiStepFormValues(values);
      const response = await addUser(userFormValues);
      toast({
        title: `User created with name ${response.firstName} ${response.lastName}.`,
        className: "bg-green-500 text-white",
      });
    } catch (error) {
      toast({
        title: `Something went wrong.`,
        className: "bg-red-500 text-white",
      });
    }

    // onNext(values);
  }
  return (
    <Form {...form}>
      <form
        className="flex h-full flex-col justify-between"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="flex flex-col gap-4">
          <FormField
            name="password"
            control={form.control}
            render={({ field }) => (
              <FormItem className="w-2/4">
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter Password"
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
              <FormItem className="w-2/4">
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Confirm the Password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="!mt-4 flex w-full gap-4">
          <Button
            className="w-1/6"
            type="button"
            onClick={onPrev}
            variant={"secondary"}
          >
            Previous
          </Button>
          <Button className="w-1/6" type="submit">
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
}
