"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import { useCookies } from "react-cookie";

// interface SignUpProps {}

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [_, setCookies] = useCookies(["jwt"])

  const navigate = useNavigate();

  const onSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setIsLoading(true)
      if (
        name === "" &&
        email === "" &&
        password === "" &&
        confirmPassword === ""
      ) {
        toast.error("Enter your details to Sign Up");
        return;
      }

      if (password !== confirmPassword) {
        toast.error("Password do not match");
      }
      const { data } = await axios.post("https://tinyurl-8d0g.onrender.com/api/user/signup", {
        name,
        email,
        password,
      });

      setCookies("jwt", data.token, {
        secure: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
        sameSite: 'strict',
      })
      localStorage.setItem("userId", data.userId);

      toast.success("Sign Up Successfull! ");
      navigate("/");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false)
    }
  };

  return (
    <div className="min-h-screen container mx-auto pl-52 pr-52 flex w-full flex-col justify-center space-y-6">
      <div className="container pr-40 pl-40 flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Welcome</h1>
        <form onSubmit={onSignUp} className="text-left space-y-6">
          <div className="font-medium text-lg">
            <label htmlFor="">First Name</label>
            <Input
              type="text"
              placeholder="First Name"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
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
              placeholder="Confirm Password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="font-medium text-lg">
            <label htmlFor="">Confirm Password</label>
            <Input
              type="password"
              placeholder="Password"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <Button type="submit" variant={"default"} isLoading={isLoading} disabled={isLoading}>
            Sign Up
          </Button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
