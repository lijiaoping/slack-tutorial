"use client";
import { useState } from "react";
import { SignInFlow } from "../types";
import { SignInCard } from "@/app/features/auth/components/sign-in-card";
import { SignUpCard } from "@/app/features/auth/components/sign-up-card";
const AuthScreen = () => {
  const [state, setState] = useState<SignInFlow>("signin");
  return (
    <div className="h-full flex items-center justify-center bg-[#5C3B58]">
      <div className="md:h-auto md:w-[420px]">
        {state === "signin" ? (
          <SignInCard setState={setState} />
        ) : (
          <SignUpCard setState={setState} />
        )}
      </div>
    </div>
  );
};

export default AuthScreen;
