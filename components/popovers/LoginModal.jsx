"use client";

import LoginForm from "@/components/forms/LoginForm";
import { useSelector, useDispatch } from "react-redux";
import {
  selector as modalsSelector,
  reducers as modalsReducers,
} from "@/redux/features/modals/modalsSlice";
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
  const { isLoginOpen } = useSelector(modalsSelector);
  const dispatch = useDispatch();
  const { openLoginModal, closeLoginModal } = modalsReducers;

  const setShowLoginModal = (show) =>
    show ? dispatch(openLoginModal()) : dispatch(closeLoginModal());

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
                  onClick={() => dispatch(closeLoginModal())}
                  aria-label="Close"
                >
                  {"\u2717"}
                </button>
                <LoginForm onDismiss={() => dispatch(closeLoginModal())} />
              </div>
            </TEModalBody>
          </TEModalContent>
        </TEModalDialog>
      </TEModal>
    </div>
  );
}
