"use client";

import { useEffect, useState } from "react";
import RegisterForm from "@/components/forms/RegisterForm";
import { send } from "@/utils/FetchRequest";

export default function Register({ params }) {
  const [email, setEmail] = useState(null);

  useEffect(() => {
    const validate = async () => {
      const response = await send({
        url: `/api/forgotPassword?token=${params.token}&key=${params.key}`,
      });
      if (!response.error) setEmail(response);
      else setEmail("error");
    };
    validate();
  }, []);
  if (!email || email === "error") return <div>Hibás validáció!</div>;

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
