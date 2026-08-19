import type { APIRoute } from "astro";
import { Resend } from "resend";

const serverProcess = globalThis as typeof globalThis & {
  process?: {
    env?: Record<string, string | undefined>;
  };
};

type ContactPayload = {
  email?: unknown;
  fullName?: unknown;
  "full-name"?: unknown;
  full_name?: unknown;
  locale?: unknown;
  message?: unknown;
  name?: unknown;
  theme?: unknown;
};
type ContactLocale = "es" | "en";
type ContactTheme = "light" | "dark";

const DEFAULT_FROM_EMAIL = "Ricardo NM Portfolio <onboarding@resend.dev>";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CONTACT_MESSAGE_MAX_LENGTH = 1200;
const CONTROL_CHARS_PATTERN = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/;
const SUSPICIOUS_MESSAGE_PATTERN =
  /<\s*\/?\s*(script|iframe|object|embed|link|meta|style|form|input|button|textarea|svg|math|img|video|audio|source|base)\b|javascript\s*:|data\s*:\s*(text\/html|application\/javascript)|on[a-z]+\s*=/i;
const EMAIL_COPY = {
  es: {
    title: "Nuevo mensaje de contacto",
    subtitle: "Alguien escribió a través del formulario de tu portafolio.",
    fullNameLabel: "Nombre completo",
    emailLabel: "Correo electrónico",
    messageLabel: "Mensaje",
    replyLabel: "Responder a",
    footerPrefix:
      "Enviado automáticamente desde el formulario de contacto de tu",
    footerLink: "portafolio.",
    preview: "te escribió a través de tu portafolio",
    role: "Desarrollador Full Stack",
    textTitle: "Nuevo mensaje de contacto",
    textNameLabel: "Nombre",
    textMessageLabel: "Mensaje",
    subjectPrefix: "Nuevo mensaje de",
  },
  en: {
    title: "New contact message",
    subtitle: "Someone wrote through your portfolio contact form.",
    fullNameLabel: "Full name",
    emailLabel: "Email",
    messageLabel: "Message",
    replyLabel: "Reply to",
    footerPrefix: "Automatically sent from your",
    footerLink: "portfolio contact form.",
    preview: "wrote to you through your portfolio",
    role: "Full Stack Developer",
    textTitle: "New contact message",
    textNameLabel: "Name",
    textMessageLabel: "Message",
    subjectPrefix: "New message from",
  },
} as const;
const EMAIL_PALETTES = {
  light: {
    accent: "#be0000",
    background: "#f5f5f5",
    buttonBorder: "#170808",
    card: "#ffffff",
    divider: "#d9caca",
    footer: "#8c8c94",
    footerLink: "#5a5a64",
    label: "#8c8c94",
    messageBackground: "#f5f5f5",
    muted: "#5a5a64",
    text: "#170808",
    textSoft: "#170808",
  },
  dark: {
    accent: "#ff4d4d",
    background: "#0b0b0d",
    buttonBorder: "#fff6f6",
    card: "#0f0f12",
    divider: "#333338",
    footer: "#5a5a60",
    footerLink: "#b8b8c0",
    label: "#7a7a82",
    messageBackground: "#1f1f23",
    muted: "#b8b8c0",
    text: "#fff6f6",
    textSoft: "#fff6f6",
  },
} as const;

function emptyResponse(status = 204) {
  return new Response(null, { status });
}

function getEnvValue(key: string) {
  return serverProcess.process?.env?.[key];
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function getStringValue(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function getMessageValue(value: unknown) {
  return typeof value === "string" ? value.replace(/\r\n?/g, "\n").trim() : "";
}

function getFirstStringValue(...values: unknown[]) {
  for (const value of values) {
    const stringValue = getStringValue(value);

    if (stringValue) {
      return stringValue;
    }
  }

  return "";
}

async function parseContactPayload(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();

    return {
      email: formData.get("email"),
      fullName: formData.get("fullName"),
      "full-name": formData.get("full-name"),
      full_name: formData.get("full_name"),
      locale: formData.get("locale"),
      message: formData.get("message"),
      name: formData.get("name"),
      theme: formData.get("theme"),
    } satisfies ContactPayload;
  }

  const body = await request.text();

  if (contentType.includes("application/json")) {
    return JSON.parse(body) as ContactPayload;
  }

  const formData = new URLSearchParams(body);

  return {
    email: formData.get("email"),
    fullName: formData.get("fullName"),
    "full-name": formData.get("full-name"),
    full_name: formData.get("full_name"),
    locale: formData.get("locale"),
    message: formData.get("message"),
    name: formData.get("name"),
    theme: formData.get("theme"),
  } satisfies ContactPayload;
}

function getContactLocale(value: unknown): ContactLocale {
  return value === "en" ? "en" : "es";
}

function getContactTheme(value: unknown): ContactTheme {
  return value === "dark" ? "dark" : "light";
}

function isSafeContactMessage(message: string) {
  return (
    message.length > 0 &&
    message.length <= CONTACT_MESSAGE_MAX_LENGTH &&
    !CONTROL_CHARS_PATTERN.test(message) &&
    !SUSPICIOUS_MESSAGE_PATTERN.test(message)
  );
}

function createContactEmailHtml({
  email,
  locale,
  message,
  name,
  theme,
}: {
  email: string;
  locale: ContactLocale;
  message: string;
  name: string;
  theme: ContactTheme;
}) {
  const copy = EMAIL_COPY[locale];
  const palette = EMAIL_PALETTES[theme];
  const escapedName = escapeHtml(name);
  const escapedEmail = escapeHtml(email);
  const escapedMessage = escapeHtml(message).replaceAll("\n", "<br />");
  const colorScheme = theme === "dark" ? "dark" : "light";

  return `<!DOCTYPE html>
<html lang="${locale}" xmlns:v="urn:schemas-microsoft-com:vml">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="color-scheme" content="${colorScheme}">
<meta name="supported-color-schemes" content="${colorScheme}">
<title>${copy.title}</title>
<style>
  body, table, td, a {
    -webkit-text-size-adjust: 100%;
    -ms-text-size-adjust: 100%;
  }

  table, td {
    mso-table-lspace: 0pt;
    mso-table-rspace: 0pt;
  }

  table {
    border-collapse: separate;
  }

  body {
    margin: 0;
    padding: 0;
    width: 100% !important;
    background-color: ${palette.background};
  }

  a {
    text-decoration: none;
  }

  @media only screen and (max-width: 620px) {
    .outer-padding {
      padding: 24px 14px !important;
    }

    .card {
      width: 100% !important;
      max-width: 100% !important;
    }

    .px {
      padding-left: 22px !important;
      padding-right: 22px !important;
    }

    .header-padding {
      padding-top: 34px !important;
      padding-bottom: 34px !important;
    }

    .stack {
      display: block !important;
      width: 100% !important;
      padding-left: 0 !important;
      padding-right: 0 !important;
      border-right: 0 !important;
      border-bottom: 0 !important;
      text-align: left !important;
    }

    .stack + .stack {
      padding-top: 22px !important;
    }

    .message-box {
      border-radius: 8px !important;
    }

    .button {
      display: block !important;
      width: auto !important;
      max-width: 320px !important;
      margin: 0 auto !important;
      text-align: center !important;
    }
  }

</style>
</head>

<body style="margin:0;padding:0;background-color:${palette.background};">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all;">
    ${escapedName} ${copy.preview} &nbsp;&#8203;&#8203;&#8203;&#8203;&#8203;&#8203;&#8203;&#8203;&#8203;&#8203;
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="email-bg" bgcolor="${palette.background}" style="background-color:${palette.background};">
    <tr>
      <td align="center" class="outer-padding" style="padding:40px 16px;">
        <table role="presentation" class="card" width="600" cellpadding="0" cellspacing="0" bgcolor="${palette.card}" style="width:600px;max-width:600px;background-color:${palette.card};border:1px dashed ${palette.divider};border-radius:12px;">
          <tr>
            <td class="px header-padding" align="center" style="padding:34px 40px 34px 40px;">
              <div class="text-main" style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:${palette.text};font-size:19px;font-weight:700;letter-spacing:0.3px;">
                RICARDO NAVA MAYORAL
              </div>

              <div class="text-muted" style="font-family:'SFMono-Regular',Consolas,Menlo,'Liberation Mono',monospace;color:${palette.muted};font-size:13px;margin-top:4px;">
                ${copy.role}<span style="color:${palette.accent};">_</span>
              </div>
            </td>
          </tr>

          <tr>
            <td style="padding:0 40px;" class="px">
              <div class="divider" style="border-top:1px dashed ${palette.divider};font-size:1px;line-height:1px;">&nbsp;</div>
            </td>
          </tr>

          <tr>
            <td class="px" style="padding:30px 40px 4px 40px;">
              <div class="text-main" style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:${palette.text};font-size:23px;line-height:1.25;font-weight:700;">
                ${copy.title}
              </div>

              <div class="text-muted" style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:${palette.muted};font-size:14px;margin-top:6px;line-height:1.5;">
                ${copy.subtitle}
              </div>
            </td>
          </tr>

          <tr>
            <td class="px" style="padding:22px 40px 0 40px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td class="stack field-divider" width="50%" valign="top" style="padding:14px 20px 14px 0;border-right:1px dashed ${palette.divider};text-align:left;">
                    <div class="text-label" style="font-family:'SFMono-Regular',Consolas,Menlo,'Liberation Mono',monospace;color:${palette.label};font-size:11px;letter-spacing:1px;text-transform:uppercase;">
                      ${copy.fullNameLabel}
                    </div>

                    <div class="text-main" style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:${palette.text};font-size:16px;font-weight:600;margin-top:7px;word-break:break-word;">
                      ${escapedName}
                    </div>
                  </td>

                  <td class="stack" width="50%" valign="top" style="padding:14px 0 14px 20px;text-align:left;">
                    <div class="text-label" style="font-family:'SFMono-Regular',Consolas,Menlo,'Liberation Mono',monospace;color:${palette.label};font-size:11px;letter-spacing:1px;text-transform:uppercase;">
                      ${copy.emailLabel}
                    </div>

                    <div style="margin-top:7px;">
                      <a href="mailto:${escapedEmail}" style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:${palette.accent};font-size:16px;font-weight:600;text-decoration:none;word-break:break-word;">
                        ${escapedEmail}
                      </a>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td class="px" style="padding:22px 40px 0 40px;">
              <div class="divider" style="border-top:1px dashed ${palette.divider};font-size:1px;line-height:1px;">&nbsp;</div>
            </td>
          </tr>

          <tr>
            <td class="px" style="padding:22px 40px 6px 40px;">
              <div class="text-label" style="font-family:'SFMono-Regular',Consolas,Menlo,'Liberation Mono',monospace;color:${palette.label};font-size:11px;letter-spacing:1px;text-transform:uppercase;margin-bottom:10px;">
                ${copy.messageLabel}
              </div>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="message-box" bgcolor="${palette.messageBackground}" style="background-color:${palette.messageBackground};border-radius:6px;">
                <tr>
                  <td style="padding:16px 18px;border-left:3px solid ${palette.accent};">
                    <div class="text-soft" style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:${palette.textSoft};font-size:15px;line-height:1.6;">
                      ${escapedMessage}
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td class="px" align="center" style="padding:30px 40px 6px 40px;">
              <a href="mailto:${escapedEmail}" class="button" style="display:inline-block;border:1px solid ${palette.buttonBorder};border-radius:8px;color:${palette.text};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:14px;font-weight:600;text-decoration:none;padding:13px 30px;">
                ${copy.replyLabel} ${escapedName} &rarr;
              </a>
            </td>
          </tr>

          <tr>
            <td class="px" style="padding:30px 40px 0 40px;">
              <div class="divider" style="border-top:1px dashed ${palette.divider};font-size:1px;line-height:1px;">&nbsp;</div>
            </td>
          </tr>

          <tr>
            <td class="px" align="center" style="padding:22px 40px 34px 40px;">
              <div class="text-footer" style="font-family:'SFMono-Regular',Consolas,Menlo,'Liberation Mono',monospace;color:${palette.footer};font-size:11px;line-height:1.8;">
                ${copy.footerPrefix}
                <a href="https://rnm.com.mx/" class="footer-link" style="color:${palette.footerLink};text-decoration:underline;">
                  ${copy.footerLink}
                </a>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export const POST: APIRoute = async ({ request }) => {
  let payload: ContactPayload;

  try {
    payload = await parseContactPayload(request);
  } catch {
    return emptyResponse(400);
  }

  const name = getFirstStringValue(
    payload.name,
    payload.fullName,
    payload.full_name,
    payload["full-name"],
  );
  const email = getStringValue(payload.email);
  const locale = getContactLocale(payload.locale);
  const message = getMessageValue(payload.message);
  const theme = getContactTheme(payload.theme);

  if (
    !name ||
    name.length > 120 ||
    !isSafeContactMessage(message) ||
    !EMAIL_PATTERN.test(email) ||
    email.length > 254
  ) {
    return emptyResponse(400);
  }

  const resendApiKey = getEnvValue("RESEND_API_KEY");
  const toEmail = getEnvValue("CONTACT_TO_EMAIL");
  const fromEmail = getEnvValue("CONTACT_FROM_EMAIL") ?? DEFAULT_FROM_EMAIL;

  if (!resendApiKey || !toEmail) {
    return emptyResponse(500);
  }

  const resend = new Resend(resendApiKey);
  const copy = EMAIL_COPY[locale];

  const { error } = await resend.emails.send({
    from: fromEmail,
    html: createContactEmailHtml({ email, locale, message, name, theme }),
    replyTo: email,
    subject: `${copy.subjectPrefix} ${name}`,
    text: [
      copy.textTitle,
      "",
      `${copy.textNameLabel}: ${name}`,
      `Email: ${email}`,
      "",
      `${copy.textMessageLabel}:`,
      message,
    ].join("\n"),
    to: [toEmail],
  });

  if (error) {
    return emptyResponse(502);
  }

  return emptyResponse();
};
