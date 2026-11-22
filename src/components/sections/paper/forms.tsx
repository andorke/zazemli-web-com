"use client";

import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { flushSync } from "react-dom";
import { reachGoal } from "@/lib/metrika";
import copy from "@/content/paper/launch-copy.json";
import { useLocalPreview } from "./cookie";
import { JourneyLink } from "./journey-link";
import { startPaperTransition } from "./motion";
import type { Format } from "@/content/paper/catalog";

type Purpose = "diary" | "waitlist";
type FormError = "network_error" | "server_error" | "email_unconfigured";
type Saved = {
  saved: true;
  mode: "live" | "preview";
  duplicate?: boolean;
  requestId?: string;
};
export type PlantRequest = { name: string; requestId: string };

class SubmissionError extends Error {
  constructor(readonly kind: FormError) {
    super(kind);
  }
}

async function save(
  path: string,
  payload: object,
  previewAllowed: boolean,
): Promise<Saved> {
  let response: Response;
  try {
    response = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10_000),
    });
  } catch {
    throw new SubmissionError("network_error");
  }
  const result = await response.json().catch(() => null);
  if (
    [404, 503].includes(response.status) &&
    (!result || result.error === "email_unconfigured")
  ) {
    throw new SubmissionError("email_unconfigured");
  }
  if (
    !response.ok ||
    result?.saved !== true ||
    !(result.mode === "live" || (previewAllowed && result.mode === "preview"))
  ) {
    throw new SubmissionError("server_error");
  }
  return result;
}

function errorMessage(error: unknown) {
  return copy.ui[
    `form.${error instanceof SubmissionError ? error.kind : "server_error"}`
  ];
}

export function EmailForm({
  purpose,
  plant,
  onClose,
  onResultTitle,
}: {
  purpose: Purpose;
  plant?: PlantRequest;
  onClose?: () => void;
  onResultTitle?: (id: string) => void;
}) {
  const preview = useLocalPreview();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<Saved | null>(null);
  const statusRef = useRef<HTMLParagraphElement>(null);
  const resultRef = useRef<HTMLHeadingElement>(null);
  const titleId = `result-title-${purpose}`;
  const isDiary = purpose === "diary";
  const pdn = "политики конфиденциальности";
  const [consentBefore, consentAfter] = copy.consents.pdn.split(pdn);
  const consentPdn = (
    <Consent name="consent_pdn">
      {consentBefore}
      <a href="/privacy">{pdn}</a>
      {consentAfter}
    </Consent>
  );
  const consentMail = (
    <Consent name="consent_mail">{copy.consents[purpose]}</Consent>
  );

  useEffect(() => {
    if (!result) return;
    onResultTitle?.(titleId);
    resultRef.current?.focus({ preventScroll: isDiary });
  }, [result, titleId, onResultTitle, isDiary]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const form = event.currentTarget;
    const fields = Array.from(form.elements).filter(
      (item): item is HTMLInputElement => item instanceof HTMLInputElement,
    );
    const invalid = fields.find((item) => !item.validity.valid);
    if (invalid) {
      setStatus(
        invalid.name === "email"
          ? copy.ui["form.invalid_email"]
          : invalid.name === "consent_pdn"
            ? copy.ui["form.missing_pdn"]
            : copy.ui[`${purpose}.missing_mail_consent`],
      );
      invalid.focus();
      invalid.setAttribute("aria-invalid", "true");
      return;
    }
    const address = email.trim();
    setEmail(address);
    setStatus("");
    setPending(true);
    try {
      const data = await save(
        isDiary ? "/api/diary/subscribe" : "/api/waitlist/email",
        {
          email: address,
          consent_pdn: true,
          consent_mail: true,
          consent_version: copy.version,
          ...(plant ? { requestId: plant.requestId } : {}),
        },
        preview,
      );
      const diaryMount = isDiary ? form.closest<HTMLElement>("[data-diary-mount]") : null;
      if (diaryMount) {
        const height = diaryMount.clientHeight;
        await startPaperTransition(() => {
          diaryMount.style.minBlockSize = `${height}px`;
          flushSync(() => setResult(data));
        }, "diary-result");
      } else {
        setResult(data);
      }
      if (data.mode === "live" && !data.duplicate)
        reachGoal(isDiary ? "diary_signup_submit" : "waitlist_submit");
    } catch (error) {
      setStatus(errorMessage(error));
      reachGoal(isDiary ? "diary_signup_error" : "waitlist_error", {
        reason: error instanceof SubmissionError ? error.kind : "server_error",
      });
      statusRef.current?.focus();
    } finally {
      setPending(false);
    }
  }

  if (result) {
    const local = result.mode === "preview";
    const emailKey = local
      ? "result.preview_email"
      : (`${purpose}.result_email` as const);
    const titleKey = local
      ? "result.preview_title"
      : (`${purpose}.${result.duplicate ? "result_repeat" : "result_title"}` as const);
    const [before, after] = copy.ui[emailKey].split("{email}");
    return (
      <section
        className="launch-result"
        data-launch-result={purpose}
        aria-labelledby={titleId}
      >
        <h2 id={titleId} ref={resultRef} tabIndex={-1}>
          {copy.ui[titleKey]}
        </h2>
        {plant && <p className="launch-result-plant">Растение: {plant.name}</p>}
        <p className="launch-result-detail">
          {before}
          <strong className="launch-result-email">{email}</strong>
          {after}
        </p>
        {local && (
          <p className="launch-preview">
            {
              copy.ui[
                result.duplicate
                  ? "result.preview_repeat"
                  : "result.preview_notice"
              ]
            }
          </p>
        )}
        {isDiary ? (
          <JourneyLink className="launch-result-link" href="/">
            {copy.ui["diary.result_close"]}
          </JourneyLink>
        ) : (
          <button
            className="launch-button launch-secondary"
            type="button"
            onClick={onClose}
          >
            {copy.ui["waitlist.result_close"]}
          </button>
        )}
      </section>
    );
  }

  return (
    <form
      className="launch-form"
      data-launch-form={purpose}
      noValidate
      onSubmit={submit}
      onInput={(event) =>
        (event.target as HTMLElement).removeAttribute("aria-invalid")
      }
    >
      <label className="launch-email-label" htmlFor={`launch-email-${purpose}`}>
        {copy.ui["form.email_label"]}
      </label>
      <input
        className="launch-email"
        type="email"
        name="email"
        autoComplete="email"
        required
        maxLength={254}
        placeholder={copy.ui["form.email_placeholder"]}
        id={`launch-email-${purpose}`}
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />
      {isDiary ? (
        <>
          {consentPdn}
          {consentMail}
        </>
      ) : (
        <>
          {consentMail}
          {consentPdn}
        </>
      )}
      <p className="launch-preview" data-preview-notice="" hidden={!preview}>
        {copy.ui["form.preview_notice"]}
      </p>
      <button className="launch-button" type="submit" disabled={pending}>
        {pending ? copy.ui["form.loading"] : copy.ui[`${purpose}.submit`]}
      </button>
      <p className="launch-status" ref={statusRef} role="status" tabIndex={-1}>
        {status}
      </p>
    </form>
  );
}

function Consent({ name, children }: { name: string; children: ReactNode }) {
  return (
    <label className="launch-consent">
      <input type="checkbox" name={name} required />
      <span>{children}</span>
    </label>
  );
}

export function PlantWish({
  format,
  hidden,
  onFind,
  onRequest,
}: {
  format: Format;
  hidden: boolean;
  onFind: (name: string) => boolean;
  onRequest: (request: PlantRequest, opener: HTMLElement) => void;
}) {
  const [status, setStatus] = useState("");
  const [pending, setPending] = useState(false);
  const preview = useLocalPreview();
  const inputRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const statusRef = useRef<HTMLParagraphElement>(null);
  const tracked = useRef(false);
  const id = format === "box" ? "box-wish" : "wish";

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending || !inputRef.current) return;
    const name = inputRef.current.value.trim().replace(/\s+/g, " ");
    if (
      name.length < 2 ||
      !/\p{L}/u.test(name) ||
      name.includes("@") ||
      name.includes("://")
    ) {
      inputRef.current.setCustomValidity(copy.ui["form.invalid_plant"]);
      inputRef.current.reportValidity();
      return;
    }
    if (onFind(name)) {
      setStatus(
        copy.ui[
          format === "box" ? "waitlist.known_box" : "waitlist.known_soil"
        ],
      );
      statusRef.current?.focus();
      return;
    }
    setPending(true);
    setStatus("");
    try {
      const result = await save(
        "/api/waitlist/plant",
        { plant: name },
        preview,
      );
      if (typeof result.requestId !== "string")
        throw new SubmissionError("server_error");
      setStatus(
        copy.ui[
          result.mode === "preview"
            ? "waitlist.plant_saved_preview"
            : "waitlist.plant_saved"
        ],
      );
      if (buttonRef.current)
        onRequest({ name, requestId: result.requestId }, buttonRef.current);
    } catch (error) {
      setStatus(errorMessage(error));
      statusRef.current?.focus();
      reachGoal("waitlist_error", {
        reason: error instanceof SubmissionError ? error.kind : "server_error",
      });
    } finally {
      setPending(false);
    }
  }

  return (
    <details
      className="plant-wish"
      id={format === "box" ? "box-wish" : "plant-wish"}
      data-format={format}
      hidden={hidden}
    >
      <summary>
        {copy.ui["waitlist.heading"]}
        <span className="wish-toggle" aria-hidden="true" />
      </summary>
      <form id={`${id}-form`} onSubmit={submit}>
        <p className="wish-intro" id={`wish-intro-${format}`}>
          {copy.ui["waitlist.invitation"]}
        </p>
        <label htmlFor={`${id}-name`}>{copy.ui["waitlist.plant_label"]}</label>
        <input
          ref={inputRef}
          id={`${id}-name`}
          name="plant"
          required
          maxLength={70}
          placeholder={copy.ui["waitlist.plant_placeholder"]}
          autoComplete="off"
          aria-describedby={`wish-intro-${format}`}
          onInput={(event) => {
            event.currentTarget.setCustomValidity("");
            setStatus("");
            if (!tracked.current && event.currentTarget.value.trim()) {
              tracked.current = true;
              reachGoal("waitlist_plant_input");
            }
          }}
        />
        <button ref={buttonRef} type="submit" disabled={pending}>
          {copy.ui["waitlist.next"]}
        </button>
      </form>
      <p role="status" ref={statusRef} id={`${id}-status`} tabIndex={-1}>
        {status}
      </p>
    </details>
  );
}

export function WishDialog({
  request,
  onDismiss,
}: {
  request: PlantRequest;
  onDismiss: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [resultTitle, setResultTitle] = useState("");
  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    if (!element.open) {
      element.showModal();
      element.querySelector<HTMLInputElement>("input[type=email]")?.focus();
      reachGoal("waitlist_form_open");
    }
  }, []);

  const close = () => dialog.current?.close();
  return (
    <dialog
      ref={dialog}
      className="launch-dialog"
      id="waitlist-dialog"
      aria-labelledby={resultTitle || "waitlist-question"}
      onClose={onDismiss}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return;
        const { left, right, top, bottom } =
          event.currentTarget.getBoundingClientRect();
        if (
          event.clientX < left ||
          event.clientX > right ||
          event.clientY < top ||
          event.clientY > bottom
        )
          close();
      }}
    >
      <button
        className="launch-close"
        type="button"
        aria-label={copy.ui["form.close"]}
        onClick={close}
      >
        ×
      </button>
      <h2 id="waitlist-question" data-waitlist-intro="" hidden={!!resultTitle}>
        {copy.ui["waitlist.modal_question"]}
      </h2>
      <p className="launch-plant" data-waitlist-intro="" hidden={!!resultTitle}>
        {request.name}
      </p>
      <p
        className="launch-modal-note"
        data-waitlist-intro=""
        hidden={!!resultTitle}
      >
        {copy.ui["waitlist.modal_note"]}
      </p>
      <EmailForm
        purpose="waitlist"
        plant={request}
        onClose={close}
        onResultTitle={setResultTitle}
      />
    </dialog>
  );
}
