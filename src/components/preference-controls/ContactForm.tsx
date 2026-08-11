import { Send } from "lucide-react";
import type { PreferenceLabels } from "./copy";
import type { ContactSubmitStatus } from "./types";

type ContactFormValue = {
  email: string;
  message: string;
  name: string;
};

type ContactFormProps = {
  contactForm: ContactFormValue;
  contactMessageLength: number;
  isContactFormValid: boolean;
  isContactMessageUnsafe: boolean;
  isContactSubmitting: boolean;
  labels: PreferenceLabels;
  maxLength: number;
  onSubmit: (event: { preventDefault: () => void }) => void;
  onUpdateValue: (field: keyof ContactFormValue, value: string) => void;
  submitStatus: ContactSubmitStatus;
};

export default function ContactForm({
  contactForm,
  contactMessageLength,
  isContactFormValid,
  isContactMessageUnsafe,
  isContactSubmitting,
  labels,
  maxLength,
  onSubmit,
  onUpdateValue,
  submitStatus,
}: ContactFormProps) {
  return (
    <form className="contact-form route-section" onSubmit={onSubmit}>
      <div className="contact-field-row">
        <div className="contact-field">
          <label htmlFor="contact-name">
            {labels.contactFullNameLabel} <span aria-hidden="true">*</span>
          </label>
          <input
            autoComplete="name"
            id="contact-name"
            name="name"
            onChange={(event) => onUpdateValue("name", event.currentTarget.value)}
            placeholder={labels.contactFullNamePlaceholder}
            required
            type="text"
            value={contactForm.name}
          />
        </div>

        <div className="contact-field">
          <label htmlFor="contact-email">
            {labels.contactEmailLabel} <span aria-hidden="true">*</span>
          </label>
          <input
            autoComplete="email"
            id="contact-email"
            inputMode="email"
            name="email"
            onChange={(event) =>
              onUpdateValue("email", event.currentTarget.value)
            }
            placeholder={labels.contactEmailPlaceholder}
            required
            type="email"
            value={contactForm.email}
          />
        </div>
      </div>

      <div className="contact-field">
        <label htmlFor="contact-message">
          {labels.contactMessageLabel} <span aria-hidden="true">*</span>
        </label>
        <textarea
          aria-describedby={
            isContactMessageUnsafe
              ? "contact-message-counter contact-message-safety"
              : "contact-message-counter"
          }
          id="contact-message"
          maxLength={maxLength}
          name="message"
          onChange={(event) =>
            onUpdateValue("message", event.currentTarget.value)
          }
          placeholder={labels.contactMessagePlaceholder}
          required
          rows={6}
          value={contactForm.message}
        />
        <div className="contact-message-meta">
          <span className="contact-message-counter" id="contact-message-counter">
            {contactMessageLength}/{maxLength}{" "}
            {labels.contactMessageCounterLabel}
          </span>

          {isContactMessageUnsafe && (
            <span
              className="contact-message-safety"
              id="contact-message-safety"
              role="alert"
            >
              {labels.contactUnsafeMessage}
            </span>
          )}
        </div>
      </div>

      <div className="contact-actions">
        <button
          className="contact-submit"
          aria-busy={isContactSubmitting}
          disabled={!isContactFormValid || isContactSubmitting}
          type="submit"
        >
          <Send aria-hidden="true" size={17} strokeWidth={2} />
          <span>
            {isContactSubmitting
              ? labels.contactSendingLabel
              : labels.contactSendLabel}
          </span>
        </button>
      </div>

      {submitStatus === "error" && (
        <p className="contact-error" role="alert">
          {labels.contactErrorMessage}
        </p>
      )}
    </form>
  );
}
