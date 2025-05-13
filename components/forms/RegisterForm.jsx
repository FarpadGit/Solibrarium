"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/contexts/AppContext";
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

const emailError = { message: "Írj be egy érvényes email címet" };
const emailMinError = {
  message: "Az email címnek legalább 6 karakterből kell állnia",
};
const emailMaxError = { message: "Az email cím legfeljebb 50 karakter lehet" };
const passwordMinError = {
  message: "A jelszónak legalább 5 karakterből kell állnia",
};
const passwordMaxError = { message: "A jelszó legfeljebb 20 karakter lehet" };
const weakPasswordError = {
  message: "A jelszóban lennie kell kis- és nagybetűknek is",
};

const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])((?!#GOOGLE).)*$/;
//for extra (perceived) password security, with digits and special chars:
//const strongPasswordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[-+_!@#$%^&*.,?])((?!#GOOGLE).)*$/;

const formSchema = z
  .object({
    email: z
      .string()
      .email(emailError)
      .min(6, emailMinError)
      .max(50, emailMaxError),
    password: z
      .string()
      .min(5, passwordMinError)
      .max(20, passwordMaxError)
      .regex(strongPasswordRegex, weakPasswordError),
    confirm: z
      .string()
      .min(5, passwordMinError)
      .max(20, passwordMaxError)
      .regex(strongPasswordRegex, weakPasswordError),
  })
  .refine((data) => data.password === data.confirm, {
    message: "A két jelszó mező nem egyezik meg",
    path: ["confirm"], // path of error
  });

export default function RegisterForm({
  title = "Regisztráció",
  emailField = "",
  overwrite = false,
}) {
  const { loginUser } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const hookForm = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: emailField,
      password: "",
      confirm: "",
    },
  });

  async function onSubmit(values) {
    setIsLoading(true);
    await send("/api/users/new", {
      data: {
        email: values.email,
        password: values.password,
        overwrite: overwrite,
      },
    }).then(async (res) => {
      if (res.error) setError();
      else {
        await loginUser({
          redirect: false,
          email: values.email,
          password: values.password,
        });
      }
      router.push("/");
    });

    setIsLoading(false);
  }

  function setError() {
    hookForm.setError("root.serverError", {
      message: "Sajnos hiba történt a szerveren, próbáld később!",
    });
    hookForm.reset({}, { keepErrors: true });
  }

  return (
    <div className="h-full w-full md:w-[unset] lg:w-4/5 xl:w-3/4">
      {/* Left column with image */}
      <div className="gap-6 flex h-full flex-wrap items-center justify-center lg:justify-between">
        <div className="hidden w-0 shrink-1 mb-12 grow-0 basis-auto overflow-hidden md:mb-0 md:w-9/12 md:shrink-0 md:flex md:rounded-[10%] lg:w-6/12 xl:w-6/12">
          <Image
            src="/register_image.jpg"
            className="object-contain w-full"
            alt="Register image"
            width={640}
            height={474}
          />
        </div>

        {/* Right column */}
        <div className="p-5 mb-12 w-10/12 md:mb-0 md:w-8/12 lg:w-5/12 xl:w-5/12 rounded-lg dark:bg-neutral-700">
          <div className="my-4 flex items-center before:mt-0.5 before:flex-1 before:border-t before:border-neutral-300 after:mt-0.5 after:flex-1 after:border-t after:border-neutral-300">
            <p className="mx-4 mb-0 text-center font-semibold">{title}</p>
          </div>
          <Form {...hookForm}>
            <form
              id="RegForm"
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
                        readOnly={emailField !== ""}
                        placeholder="Email cím"
                        size="lg"
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
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-amaranth" />
                  </FormItem>
                )}
              />
              <FormField
                control={hookForm.control}
                name="confirm"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <TEInput
                        id="confirm"
                        type="password"
                        placeholder="Jelszó ismét"
                        size="lg"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-amaranth" />
                  </FormItem>
                )}
              />
              {hookForm.formState.errors?.root?.serverError?.message && (
                <div className="flex justify-center text-amaranth">
                  {hookForm.formState.errors.root.serverError.message}
                </div>
              )}
              <div className="text-center lg:text-left">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex justify-center w-full rounded green_btn px-7 pb-2.5 pt-3 text-sm font-medium uppercase leading-normal text-white enabled:shadow-[0_4px_9px_-4px_#639912] transition duration-150 ease-in-out enabled:hover:shadow-[0_8px_9px_-4px_rgba(99,153,18,0.3),0_4px_18px_0_rgba(99,153,18,0.2)] enabled:focus:bg-lightgreen enabled:focus:shadow-[0_8px_9px_-4px_rgba(99,153,18,0.3),0_4px_18px_0_rgba(99,153,18,0.2)] enabled:focus:outline-none enabled:focus:ring-0 enabled:active:bg-lightgreen enabled:active:shadow-[0_8px_9px_-4px_rgba(99,153,18,0.3),0_4px_18px_0_rgba(99,153,18,0.2)] dark:enabled:shadow-[0_4px_9px_-4px_rgba(99,153,18,0.5)] dark:enabled:hover:shadow-[0_8px_9px_-4px_rgba(99,153,18,0.2),0_4px_18px_0_rgba(99,153,18,0.1)] dark:enabled:focus:shadow-[0_8px_9px_-4px_rgba(99,153,18,0.2),0_4px_18px_0_rgba(99,153,18,0.1)] dark:enabled:active:shadow-[0_8px_9px_-4px_rgba(99,153,18,0.2),0_4px_18px_0_rgba(99,153,18,0.1)] disabled:bg-gray-400"
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
                    "Regisztrálok"
                  )}
                </button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
