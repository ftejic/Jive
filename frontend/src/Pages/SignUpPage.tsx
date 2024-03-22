import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../Components/ui/form";
import { Input } from "../Components/ui/input";
import { Button } from "../Components/ui/button";

function SignUpPage() {
  const navigate = useNavigate();

  const formSchema = z
    .object({
      username: z.string().min(4, {
        message: "Username must be at least 4 characters.",
      }),
      email: z.string().email({
        message: "Email is not in valid form",
      }),
      password: z
        .string()
        .min(8, "Password must be at least 8 characters long")
        .regex(
          /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
          {
            message:
              "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
          }
        ),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ["confirmPassword"],
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function handleSubmit(values: z.infer<typeof formSchema>) {
    const { username, email, password } = values;
    try {
      await axios.post(
        "http://localhost:5000/api/user/sign-up",
        { username, email, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      navigate("/sign-in");
    } catch (error) {
      console.log(`Signup Failed: ${error}`);
    }
  }

  return (
    <div className="SignUpPage flex lg:items-center min-h-screen">
      <div className="container max-w-md mx-auto flex flex-col sm:gap-5 mt-28 lg:mt-0">
        <div className="sm:border px-5 py-5">
          <h1 className="text-4xl font-bold mb-10 text-center text-foreground">
            Sign Up
          </h1>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
              autoComplete="off"
            >
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter your username"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter your email"
                        {...field}
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
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Create strong password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Confirm Password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Sign Up
              </Button>
            </form>
          </Form>
        </div>
        <div className="flex justify-center gap-1 sm:border sm:border-border px-5 sm:py-5">
          <p className="text-foreground">Already have an account?</p>
          <Link to="/sign-in" className="text-muted-foreground">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SignUpPage;
