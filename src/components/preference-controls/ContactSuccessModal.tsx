import { MailCheck } from "lucide-react";
import type { RefObject } from "react";
import type { PreferenceLabels } from "./copy";

type ContactSuccessModalProps = {
  isOpen: boolean;
  labels: PreferenceLabels;
  modalRef: RefObject<HTMLElement | null>;
};

export default function ContactSuccessModal({
  isOpen,
  labels,
  modalRef,
}: ContactSuccessModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="contact-leave-backdrop contact-success-backdrop"
      role="presentation"
    >
      <section
        aria-describedby="contact-success-description"
        aria-labelledby="contact-success-title"
        aria-modal="true"
        className="contact-leave-modal contact-success-modal"
        ref={modalRef}
        role="dialog"
        tabIndex={-1}
      >
        <div className="contact-leave-message">
          <span
            className="contact-leave-icon contact-success-icon"
            aria-hidden="true"
          >
            <MailCheck size={24} strokeWidth={1.9} />
          </span>

          <div>
            <h2 id="contact-success-title">{labels.contactSuccessTitle}</h2>
            <p id="contact-success-description">
              {labels.contactSuccessDescription}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
