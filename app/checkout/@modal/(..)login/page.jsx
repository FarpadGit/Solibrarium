"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import LoginForm from "@/components/forms/LoginForm";
const TEModal = dynamic(
  () => import("tw-elements-react").then((res) => res.TEModal),
  { ssr: false }
);
const TEModalDialog = dynamic(
  () => import("tw-elements-react").then((res) => res.TEModalDialog),
  { ssr: false }
);
const TEModalContent = dynamic(
  () => import("tw-elements-react").then((res) => res.TEModalContent),
  { ssr: false }
);
const TEModalBody = dynamic(
  () => import("tw-elements-react").then((res) => res.TEModalBody),
  { ssr: false }
);

export default function Login() {
  const [show, setShow] = useState(true);
  const router = useRouter();
  // mostly to guard against react strict mode so I dont't have to turn it off in dev :|
  const ranOnce = useRef(false);

  return (
    <TEModal
      show={show}
      setShow={setShow}
      onHide={() => {
        if (!ranOnce.current) {
          // use back instead of push/replace to unmount component and reset properties
          router.back();
          ranOnce.current = true;
        }
      }}
    >
      <TEModalDialog theme={{ sizeDefault: "min-[576px]:max-w-[300px]" }}>
        <TEModalContent>
          <TEModalBody>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                className="box-content rounded-none border-none hover:no-underline hover:opacity-75 focus:opacity-100 focus:shadow-none focus:outline-none self-end pt-5 pr-5"
                onClick={() => {
                  setShow(false);
                }}
                aria-label="Close"
              >
                {/* X button */}
                {"\u2717"}
              </button>
              <LoginForm
                minimal
                title="A tovább lépéshez be kell jelentkezned!"
                onDismiss={() => {
                  setShow(false);
                }}
              />
            </div>
          </TEModalBody>
        </TEModalContent>
      </TEModalDialog>
    </TEModal>
  );
}
