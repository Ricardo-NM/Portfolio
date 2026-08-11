import { AlertTriangle } from "lucide-react";
import type { RefObject } from "react";
import type { PreferenceLabels } from "./copy";

type ContactLeaveModalProps = {
  cancelRef: RefObject<HTMLButtonElement | null>;
  isClosing: boolean;
  isConfirming: boolean;
  isOpen: boolean;
  labels: PreferenceLabels;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function ContactLeaveModal({
  cancelRef,
  isClosing,
  isConfirming,
  isOpen,
  labels,
  onCancel,
  onConfirm,
}: ContactLeaveModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="contact-leave-backdrop"
      data-state={isConfirming ? "leaving" : isClosing ? "closing" : "open"}
      role="presentation"
    >
      <section
        aria-describedby="contact-leave-description"
        aria-labelledby="contact-leave-title"
        aria-modal="true"
        className="contact-leave-modal"
        role="dialog"
      >
        <div className="contact-leave-message">
          <span
            className="contact-leave-icon contact-warning-icon"
            aria-hidden="true"
          >
            <AlertTriangle size={22} strokeWidth={1.9} />
          </span>

          <div>
            <h2 id="contact-leave-title">{labels.contactLeaveTitle}</h2>
            <p id="contact-leave-description">
              {labels.contactLeaveDescription}
            </p>
          </div>
        </div>

        <div className="contact-leave-actions">
          <button
            className="contact-leave-button contact-leave-button-secondary"
            disabled={isConfirming || isClosing}
            onClick={onCancel}
            ref={cancelRef}
            type="button"
          >
            <span className="contact-leave-button-label">
              {labels.contactStayLabel}
            </span>
          </button>

          <button
            className="contact-leave-button contact-leave-button-primary"
            disabled={isConfirming || isClosing}
            onClick={onConfirm}
            type="button"
          >
            <span className="contact-leave-button-label">
              {labels.contactLeaveLabel}
            </span>
          </button>
        </div>
      </section>
    </div>
  );
}
