"use client";

import { useAppContext } from "@/contexts/AppContext";
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
const TEModalHeader = dynamic(
  () => import("tw-elements-react").then((res) => res.TEModalHeader),
  { ssr: false }
);
const TEModalBody = dynamic(
  () => import("tw-elements-react").then((res) => res.TEModalBody),
  { ssr: false }
);

export default function ConfirmModal() {
  const { deleteUser } = useAppContext();
  const { isConfirmOpen } = useSelector(modalsSelector);
  const dispatch = useDispatch();
  const { openConfirmModal, closeConfirmModal } = modalsReducers;

  const setShowConfirmModal = (show) =>
    show ? dispatch(openConfirmModal()) : dispatch(closeConfirmModal());

  return (
    <div className="modal">
      <TEModal show={isConfirmOpen} setShow={setShowConfirmModal}>
        <TEModalDialog theme={{ sizeDefault: "min-[576px]:max-w-[500px]" }}>
          <TEModalContent>
            <TEModalHeader className="relative">
              <h5 className="flex-1 text-xl font-medium leading-normal text-center text-neutral-800 dark:text-neutral-200">
                Biztos törölni akarod a fiókod?
              </h5>
              <button
                type="button"
                className="absolute top-0 right-0 box-content rounded-[25%] border-none hover:no-underline hover:opacity-75 focus:opacity-100 focus:shadow-none self-end pt-5 pr-5"
                onClick={() => dispatch(closeConfirmModal())}
                aria-label="Close"
              >
                {"\u2717"}
              </button>
            </TEModalHeader>
            <TEModalBody>
              <div className="flex flex-col gap-2 p-5">
                <div className="text-justify pb-4">
                  Ilyesmit általában nem lehet egy igazi e-commerce oldalon
                  megtenni, de ha úgy gondolod hogy nem szeretnéd az
                  adatbázisban hagyni az adataid akkor most ezt megteheted.
                </div>
                <div className="flex justify-around">
                  <button
                    className="text-amaranth hover:text-lightred"
                    onClick={() => {
                      deleteUser();
                      dispatch(closeConfirmModal());
                    }}
                  >
                    Törlés
                  </button>
                  <button
                    className="hover:opacity-75"
                    onClick={() => dispatch(closeConfirmModal())}
                  >
                    Mégse
                  </button>
                </div>
              </div>
            </TEModalBody>
          </TEModalContent>
        </TEModalDialog>
      </TEModal>
    </div>
  );
}
