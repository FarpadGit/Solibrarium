"use client";

import Image from "next/image";
import { useState } from "react";
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

const emailError = { message: "Írjon be egy érvényes email címet" };
const emailMinError = {
  message: "Az email címnek legalább 6 karakterből kell állnia",
};
const emailMaxError = { message: "Az email cím legfeljebb 50 karakter lehet" };

const formSchema = z.object({
  email: z
    .string()
    .email(emailError)
    .min(6, emailMinError)
    .max(50, emailMaxError),
});

export default function ForgotPassForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const hookForm = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values) {
    setIsLoading(true);
    await send({
      url: " /api/forgotPassword",
      params: {
        email: values.email,
      },
      callback: async (res) => {
        if (res.error) setError(res.status);
        else setSuccess(true);
      },
    });
    setIsLoading(false);
  }

  function setError(errorStatus) {
    hookForm.setError("root.serverError", {
      message:
        errorStatus === 404
          ? "Ezt az email címet nem találjuk!"
          : "Hiba történt a szerveren, próbáld később!",
    });
    hookForm.reset({}, { keepErrors: true });
  }

  return (
    <div className="relative h-full w-full max-w-[840px] flex flex-col items-end rounded-[40px] overflow-hidden">
      <Image
        src="/forgotPassword_image.png"
        className="object-fill w-full h-full absolute bg-white dark:bg-neutral-500"
        alt="Register image"
        width={840}
        height={560}
      />

      {/* Top row */}
      <div className="pt-4 px-4 pb-9 text-white flex flex-col gap-2 w-[57%] lg:w-7/12 items-center z-[1]">
        <div className="flex items-center">
          <p className="text-center text-sm md:text-xl font-semibold">
            Elfelejtetted jelszavadat ?
          </p>
        </div>
        <p className="text-center text-xs md:text-sm">
          Add meg az email címed és mi küldeni fogunk rá egy linket amin
          keresztül újra beállíthatsz egy új jelszót. <br />
          (Az email címednek természetesen szerepelnie kell az adatbázisunkban.)
        </p>
      </div>

      {/* Form input */}
      <div className="p-5 mb-5 w-7/12 lg:pr-20 rounded-lg z-[1]">
        <Form {...hookForm}>
          <form onSubmit={hookForm.handleSubmit(onSubmit)} className="">
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
                      className="bg-white dark:bg-neutral-500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-600" />
                </FormItem>
              )}
            />
            <div className="h-64 pt-8">
              {!success &&
                hookForm.formState.errors?.root?.serverError?.message && (
                  <div className="flex text-center justify-center text-red-600">
                    {hookForm.formState.errors.root.serverError.message}
                  </div>
                )}
              {success &&
                !hookForm.formState.errors?.root?.serverError?.message && (
                  <div className="flex text-center justify-center text-lime-600">
                    A levelet sikeresen elküldtük. Nézd meg a fiókodban, hogy
                    megkaptad-e.
                  </div>
                )}
            </div>
            <div className="text-center lg:text-left">
              {!success && (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex justify-center w-full inline-block rounded bg-primary px-7 pb-2.5 pt-3 text-sm font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out enabled:hover:bg-primary-600 enabled:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] enabled:focus:bg-primary-600 enabled:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] enabled:focus:outline-none enabled:focus:ring-0 enabled:active:bg-primary-700 enabled:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:enabled:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:enabled:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:enabled:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:enabled:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] disabled:bg-gray-400"
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
                    "Küldés"
                  )}
                </button>
              )}
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
