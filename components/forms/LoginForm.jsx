"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import TEInput from "@/components/ui/TEInput";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/Form";
import { send } from "@/utils/FetchRequest";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";

const emailError = { message: "Írj be egy érvényes email címet" };
const passwordError = { message: "Ezt a jelszót nem használhatod" };

const formSchema = z.object({
  email: z.string().email(emailError),
  password: z.string().regex(/^((?!#GOOGLE).)*$/, passwordError),
  rememberMe: z.boolean(),
});
export default function LoginForm({
  title = "Bejelentkezés",
  minimal = false,
  onDismiss = null,
  redirectURL = null,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const hookForm = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  function dismiss() {
    if (onDismiss) onDismiss();
  }

  function handleGoogleSignIn() {
    signIn("google").then((result) => {
      if (!result?.error) {
        dismiss();
        if (redirectURL) router.replace(redirectURL);
        hookForm.reset({}, { keepErrors: true });
      } else {
        hookForm.setError("root.loginError", {
          message: "Sikertelen bejelentkezés.",
        });
      }
    });
  }

  async function handleRememberMe(email) {
    if (typeof window === "undefined" || !!localStorage.getItem("RememberMe"))
      return;
    send({
      url: `/api/rememberMe`,
      params: { userEmail: email },
      callback: (res) => {
        if (!res.error) localStorage.setItem("RememberMe", JSON.stringify(res));
      },
    });
  }

  function onSubmit(values) {
    setIsLoading(true);
    signIn("SolibrariumProvider", {
      redirect: false,
      email: values.email,
      password: values.password,
    })
      .then((result) => {
        if (!result.error) {
          if (values.rememberMe) handleRememberMe(values.email);
          dismiss();
          if (redirectURL) router.replace(redirectURL);
          hookForm.reset({}, { keepErrors: true });
        } else {
          hookForm.setError("root.loginError", {
            message: "Sikertelen bejelentkezés. Jól adtad meg az adataidat?",
          });
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  return (
    <div className="gap-6 flex h-full flex-wrap items-center justify-center lg:justify-between">
      {/* Left column with image */}
      {!minimal && (
        <div className="hidden shrink-1 mb-12 grow-0 basis-auto overflow-hidden md:flex md:mb-0 md:w-9/12 md:shrink-0 md:rounded-[10%] lg:w-6/12 xl:w-6/12">
          <Image
            src="/login_image.jpg"
            className="object-cover object-[0_75%] w-full max-h-[400px]"
            alt="Login image"
            width={340}
            height={489}
          />
        </div>
      )}

      {/* Right column */}
      <div
        className={`p-5 mb-12 md:mb-0 ${
          minimal ? "w-full" : "md:w-8/12 lg:w-5/12 xl:w-5/12"
        } rounded-lg dark:bg-neutral-700`}
      >
        {/* Sign in section */}
        <div className="flex items-center justify-center">
          <button className="flex" onClick={() => handleGoogleSignIn()}>
            <Image
              src="/google_icon.png"
              width={28}
              height={28}
              alt="google icon"
            />
            <p className={`"mb-0 ${minimal ? "text-sm" : "text-lg"}"`}>
              Jelentkezz be Google fiókkal
            </p>
          </button>
        </div>

        <div className="my-4 flex items-center before:mt-0.5 before:flex-1 before:border-t before:border-neutral-300 after:mt-0.5 after:flex-1 after:border-t after:border-neutral-300">
          <p className="mx-4 mb-0 text-center font-semibold">{title}</p>
        </div>

        <Form {...hookForm}>
          <form
            onSubmit={hookForm.handleSubmit(onSubmit)}
            className="space-y-8"
          >
            <FormField
              control={hookForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <TEInput
                      id="Email"
                      type="email"
                      placeholder="Email cím"
                      size="lg"
                      className="mb-6"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-amaranth" />
                </FormItem>
              )}
            />
            <FormField
              control={hookForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <TEInput
                      id="Password"
                      type="password"
                      placeholder="Jelszó"
                      size="lg"
                      className="mb-6"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-amaranth" />
                </FormItem>
              )}
            />
            <div className="mb-6 flex items-center justify-between">
              {/* Remember me checkbox */}
              {!minimal && (
                <div className="mb-[0.125rem] block min-h-[1.5rem] pl-[1.5rem]">
                  <FormField
                    control={hookForm.control}
                    name="rememberMe"
                    render={({ field: { value, ...field } }) => (
                      <FormItem>
                        <FormControl>
                          <div className="flex items-center">
                            <input
                              className="relative float-left -ml-[1.5rem] mr-[6px] mt-[0.15rem] h-[1.125rem] w-[1.125rem] appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-neutral-300 checked:border-green checked:bg-green checked:after:absolute checked:after:-mt-px checked:after:ml-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer focus:shadow-none focus:transition-[border-color_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:after:-mt-px checked:focus:after:ml-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent dark:border-neutral-500 dark:checked:border-green dark:checked:bg-green"
                              type="checkbox"
                              id="RememberMe"
                              checked={value}
                              {...field}
                            />
                            <label
                              className="inline-block pl-[0.15rem] hover:cursor-pointer text-sm lg:text-base"
                              htmlFor="RememberMe"
                            >
                              Jegyezz meg
                            </label>
                          </div>
                        </FormControl>
                        <FormMessage className="text-amaranth" />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {/* Forgot password link */}
              {!minimal && (
                <Link
                  href="/forgotPassword"
                  onClick={() => dismiss()}
                  className="text-sm w-1/2 text-end lg:text-base lg:w-[unset] hover:underline"
                >
                  Elfelejtetted jelszavadat?
                </Link>
              )}
            </div>

            {/* Login button */}
            <div className="text-center lg:text-left">
              <button
                type="submit"
                disabled={isLoading}
                className="flex justify-center w-full inline-block rounded green_btn px-7 pb-2.5 pt-3 text-sm font-medium uppercase leading-normal text-white enabled:shadow-[0_4px_9px_-4px_#639912] transition duration-150 ease-in-out enabled:hover:shadow-[0_8px_9px_-4px_rgba(99,153,18,0.3),0_4px_18px_0_rgba(99,153,18,0.2)] enabled:focus:bg-lightgreen enabled:focus:shadow-[0_8px_9px_-4px_rgba(99,153,18,0.3),0_4px_18px_0_rgba(99,153,18,0.2)] enabled:focus:outline-none enabled:focus:ring-0 enabled:active:bg-lightgreen enabled:active:shadow-[0_8px_9px_-4px_rgba(99,153,18,0.3),0_4px_18px_0_rgba(99,153,18,0.2)] dark:enabled:shadow-[0_4px_9px_-4px_rgba(99,153,18,0.5)] dark:enabled:hover:shadow-[0_8px_9px_-4px_rgba(99,153,18,0.2),0_4px_18px_0_rgba(99,153,18,0.1)] dark:enabled:focus:shadow-[0_8px_9px_-4px_rgba(99,153,18,0.2),0_4px_18px_0_rgba(99,153,18,0.1)] dark:enabled:active:shadow-[0_8px_9px_-4px_rgba(99,153,18,0.2),0_4px_18px_0_rgba(99,153,18,0.1)] disabled:bg-gray-400"
              >
                {isLoading ? (
                  <>
                    <img
                      src="/icons/spinner.gif"
                      width={20}
                      height={20}
                      alt=""
                    />
                    Egy pillanat...
                  </>
                ) : (
                  "Bejelentkezés"
                )}
              </button>

              {/* Login error message */}
              {hookForm.formState.errors?.root?.loginError?.message && (
                <div className="flex justify-center text-center text-amaranth">
                  {hookForm.formState.errors.root.loginError.message}
                </div>
              )}

              {/* Register link */}
              {!minimal && (
                <p className="flex justify-between mb-0 mt-2 pt-1 text-sm font-semibold">
                  Nincs még fiókod?
                  <Link
                    href="/register"
                    onClick={() => dismiss()}
                    className="text-green transition duration-150 ease-in-out hover:text-lightgreen hover:underline focus:text-lightgreen active:text-lightgreen"
                  >
                    Regisztrálok
                  </Link>
                </p>
              )}
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
