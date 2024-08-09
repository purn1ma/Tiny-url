import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useState } from "react";
import { useCookies } from "react-cookie";
import { toast } from "sonner";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [_, setCookies] = useCookies(["jwt"])

  const onSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setIsLoading(true)
      if (email === "" && password === "") {
        toast.error("Enter Email & Password to Sign In");
        return;
      }
      const { data } = await axios.post("https://tinyurl-8d0g.onrender.com/api/user/signin", {
        email,
        password,
      });

      localStorage.setItem("userId", data.userId);
      setCookies("jwt", data.token, {
        secure: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
        sameSite: 'strict',
      })

      toast.success("SignIn Successfull");
      window.location.pathname = "/";
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false)
    }
  };
  return (
    <div className="min-h-screen container mx-auto pl-52 pr-52 flex w-full flex-col justify-center space-y-6">
      <div className="container pr-40 pl-40 flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Welcome Back</h1>
        <form onSubmit={onSignIn} className="text-left space-y-6">
          <div className="font-medium text-lg">
            <label htmlFor="">Email</label>
            <Input
              type="email"
              placeholder="eg:- xyz@random.com"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="font-medium text-lg">
            <label htmlFor="">Password</label>
            <Input
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button type="submit" isLoading={isLoading} disabled={isLoading}>Sign In</Button>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
