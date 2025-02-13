"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import RegisterForm from "@/components/forms/RegisterForm";
import { send } from "@/utils/FetchRequest";

export default function Register({ params }) {
  const [email, setEmail] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const validate = async () => {
      const response = await send(
        `/api/forgotPassword?token=${params.token}&key=${params.key}`
      );
      if (!response.error) setEmail(response);
      else setEmail("error");
    };
    validate();
  }, []);

  useEffect(() => {
    if (email === "error")
      setTimeout(() => {
        router.push("/");
      }, 5000);
  }, [email]);

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
