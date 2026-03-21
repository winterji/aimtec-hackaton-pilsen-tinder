import type { Metadata } from "next";
import Link from "next/link";
import SignUpWithPassword from "./SignUpWithPassword";

export const metadata: Metadata = {
  title: "Sign Up",
};

export default function SignUp() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-2 dark:bg-[#020d1a]">
      <div className="w-full max-w-md rounded-[10px] bg-white p-8 shadow-1 dark:bg-gray-dark dark:shadow-card">
        <h1 className="mb-2 text-2xl font-bold text-dark dark:text-white">
          Create an Account
        </h1>
        <p className="mb-6 text-sm text-dark-4 dark:text-dark-6">
          Fill in the details below to register
        </p>

        <SignUpWithPassword />

        <div className="mt-6 text-center">
          <p>
            Already have an account?{" "}
            <Link href="/auth/sign-in" className="text-primary">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
