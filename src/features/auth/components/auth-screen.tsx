"use client";

import { SignInCard } from "./sign-in-card";
import { SignUpCard } from "./sign-up-card";

import { useState } from "react";

import { SignInFlow } from "../types";

export const AuthScreen = () => {
  const [state, setState] = useState<SignInFlow>("signIn");

  return (
    <>
      <div className="flex h-full w-full items-center justify-center bg-[#5C3B58]">
        <div className="md:h-auto md:w-[420px]">
          {state === "signIn" ? (
            <SignInCard setState={setState} />
          ) : (
            <SignUpCard setState={setState} />
          )}
        </div>
      </div>
    </>
  );
};
