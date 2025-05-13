"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import RegisterForm from "@/components/forms/RegisterForm";
import { send } from "@/utils/FetchRequest";

export default function Register({ params }) {
  const { token, key } = use(params);
  const [email, setEmail] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const validate = async () => {
      const response = await send(
        `/api/forgotPassword?token=${token}&key=${key}`
      );
      if (!response.error) setEmail(response);
      else {
        setEmail("error");
        setTimeout(() => {
          router.push("/");
        }, 5000);
      }
    };
    validate();
  }, []);

  if (!email || email === "error")
    return <div>Hibás validáció! Most átirányítunk a kezdőoldalra...</div>;

  return (
    email && (
      <RegisterForm
        title="Jelszó megváltoztatása"
        emailField={email}
        overwrite={true}
      />
    )
  );
}
