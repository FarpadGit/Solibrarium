"use client";

import { useAppContext } from "@/contexts/AppContext";
import LoginForm from "@/components/forms/LoginForm";
import dynamic from "next/dynamic";
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

export default function LoginModal() {
  const { isLoginOpen, openLoginModal, closeLoginModal } = useAppContext();
  const setShowLoginModal = (show) =>
    show ? openLoginModal() : closeLoginModal();
  return (
    <div className="modal">
      <TEModal show={isLoginOpen} setShow={setShowLoginModal}>
        <TEModalDialog theme={{ sizeDefault: "min-[576px]:max-w-[1000px]" }}>
          <TEModalContent>
            <TEModalBody>
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  className="box-content rounded-[25%] border-none hover:no-underline hover:opacity-75 focus:opacity-100 focus:shadow-none self-end pt-5 pr-5"
                  onClick={() => closeLoginModal()}
                  aria-label="Close"
                >
                  {"\u2717"}
                </button>
                <LoginForm onDismiss={() => closeLoginModal()} />
              </div>
            </TEModalBody>
          </TEModalContent>
        </TEModalDialog>
      </TEModal>
    </div>
  );
}
