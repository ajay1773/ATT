"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "~/components/ui/button";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { TLoginFormSchema, loginFormSchema } from "./schema";
import { type SignInResponse, signIn } from "next-auth/react";
import { useToast } from "~/components/ui/use-toast";

export default function LoginPage() {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<TLoginFormSchema>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onLoginFormSubmit = async (values: TLoginFormSchema) => {
    const data: SignInResponse | undefined = await signIn("credentials", {
      ...values,
      redirect: false,
    });
    if (data?.error && data.status === 401) {
      toast({
        title: "Wrong credentials.",
        className: "h-8",
        variant: "destructive",
      });
    } else {
      router.push("/calendar");
    }
  };

  return (
    <div className="flex min-h-full items-center justify-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => onLoginFormSubmit(data))}
          className="space-y-6"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="johndoe@demo.com"
                    {...form.register("email")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="asd*231***EWQ*"
                    {...form.register("password")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="w-full" type="submit">
            Login
          </Button>
        </form>
      </Form>
    </div>
  );
}
