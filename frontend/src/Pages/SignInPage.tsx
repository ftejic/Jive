import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../Components/ui/form";
import { Input } from "../Components/ui/input";
import { Button } from "../Components/ui/button";

function SignInPage(props: any) {
  const navigate = useNavigate();

  const formSchema = z.object({
    email: z.string().email({
      message: "Email is not in valid form",
    }),
    password: z.string(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function handleSubmit(values: z.infer<typeof formSchema>) {
    const { email, password } = values;
    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/user/sign-in",
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      props.setCookie("jive.session-token", data.sessionToken, {
        maxAge: 8 * 60 * 60,
      });

      navigate("/");
    } catch (error) {
      console.log(`Login Failed: ${error}`);
    }
  }

  return (
    <div className="SignInPage flex lg:items-center min-h-screen">
      <div className="container max-w-md mx-auto flex flex-col sm:gap-5 mt-28 lg:mt-0">
        <div className="sm:border sm:border-border px-5 py-5">
          <h1 className="text-4xl font-bold mb-10 text-center">Welcome Back</h1>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
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
                        placeholder="Enter your password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Sign In
              </Button>
            </form>
          </Form>
        </div>
        <div className="flex justify-center gap-1 sm:border sm:border-border px-5 sm:py-5">
          <p className="text-foreground">Don't have an account?</p>
          <Link to="/sign-up" className="font-medium text-muted-foreground">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SignInPage;
