"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { SignInFlow } from "../types";
import { TriangleAlert } from "lucide-react";
import { useAuthActions } from "@convex-dev/auth/react";

interface SignUpCardProps {
  setState: (state: SignInFlow) => void;
}

export const SignUpCard = ({ setState }: SignUpCardProps) => {
  const { signIn } = useAuthActions();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const onPasswordSignUp = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setPending(true);
    signIn("password", { name, email, password, flow: "signUp" })
      .catch(() => {
        setError("Something went wrong.");
      })
      .finally(() => {
        setPending(pending);
      });
  };

  const onProviderSignUp = (value: "github" | "google") => {
    setPending(true);
    signIn(value).finally(() => {
      setPending(pending);
    });
  };

  return (
    <>
      <Card className="h-full w-full p-8">
        <CardHeader className="px-0 pt-0">
          <CardTitle>Sign up to continue</CardTitle>
          <CardDescription>
            User your email or another service to continue
          </CardDescription>
        </CardHeader>
        {!!error && (
          <div className="mb-6 flex items-center gap-x-2 rounded-md bg-destructive/15 p-3 text-sm text-destructive">
            <TriangleAlert className="size-4" />
            <p>{error}</p>
          </div>
        )}
        <CardContent className="space-y-5 px-0 pb-0">
          <form className="space-y-2.5" onSubmit={onPasswordSignUp}>
            <Input
              disabled={pending}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Email"
              type="email"
              required
            />
            <Input
              disabled={pending}
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Full name"
              required
            />
            <Input
              disabled={pending}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Password"
              type="password"
              required
            />
            <Input
              disabled={pending}
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Confirm password"
              type="password"
              required
            />
            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={pending}
            >
              Continue
            </Button>
          </form>
          <Separator />
          <div className="flex flex-col gap-y-2.5">
            <Button
              disabled={pending}
              onClick={() => onProviderSignUp("google")}
              variant="outline"
              size="lg"
              className="relative w-full"
            >
              <FcGoogle className="absolute left-2.5 top-3 size-5" />
              Continue with Google
            </Button>
            <Button
              disabled={pending}
              onClick={() => onProviderSignUp("github")}
              variant="outline"
              size="lg"
              className="relative w-full"
            >
              <FaGithub className="absolute left-2.5 top-3 size-5" />
              Continue with Github
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Already have an account? &nbsp;
            <span
              onClick={() => setState("signIn")}
              className="cursor-pointer text-sky-700 hover:underline"
            >
              Sign in
            </span>
          </p>
        </CardContent>
      </Card>
    </>
  );
};
