import nodemailer from "nodemailer";

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 6;

if (!globalThis.__washFixBookingRateLimit) {
  globalThis.__washFixBookingRateLimit = new Map();
}

const bookingRateLimitStore = globalThis.__washFixBookingRateLimit;

function sanitizeText(value, maxLength) {
  return String(value || "")
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .replace(/[<>`$]/g, "")
    .trim()
    .slice(0, maxLength);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function getClientIp(request) {
  const xForwardedFor = request.headers.get("x-forwarded-for") || "";
  const realIp = request.headers.get("x-real-ip") || "";
  const firstForwardedIp = xForwardedFor.split(",")[0].trim();

  return firstForwardedIp || realIp || "unknown";
}

function isAllowedOrigin(request) {
  const configured = String(process.env.ALLOWED_ORIGINS || "").trim();
  if (!configured) {
    return true;
  }

  const allowedOrigins = configured
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);

  const origin = request.headers.get("origin");
  if (!origin) {
    return true;
  }

  return allowedOrigins.includes(origin);
}

function isRateLimited(ip) {
  const now = Date.now();
  const current = bookingRateLimitStore.get(ip);

  if (!current || now - current.windowStart > RATE_LIMIT_WINDOW_MS) {
    bookingRateLimitStore.set(ip, { count: 1, windowStart: now });
    return false;
  }

  if (current.count >= RATE_LIMIT_MAX_REQUESTS) {
    return true;
  }

  current.count += 1;
  bookingRateLimitStore.set(ip, current);
  return false;
}

function buildOwnerTemplate({ name, phone, brand, email, source }) {
  const submittedAt = new Date().toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  });

  const safeBrand = brand || "Not selected";
  const safeEmail = email || "Not provided";

  const subject = `New Booking - ${name} (${phone})`;

  const text = [
    "New booking received from Wash Fix Service website",
    "",
    `Name: ${name}`,
    `Phone: ${phone}`,
    `Email: ${safeEmail}`,
    `Brand: ${safeBrand}`,
    `Source: ${source}`,
    `Submitted At: ${submittedAt}`,
  ].join("\n");

  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;line-height:1.5;color:#10233a;max-width:680px;margin:0 auto;">
      <h2 style="margin:0 0 10px 0;color:#0a5f6a;">New Booking Received</h2>
      <p style="margin:0 0 16px 0;">A new booking request was submitted on the Wash Fix Service website.</p>
      <table style="width:100%;border-collapse:collapse;background:#f9fcff;border:1px solid #d7e1ec;">
        <tr>
          <td style="padding:10px;border-bottom:1px solid #d7e1ec;"><strong>Name</strong></td>
          <td style="padding:10px;border-bottom:1px solid #d7e1ec;">${name}</td>
        </tr>
        <tr>
          <td style="padding:10px;border-bottom:1px solid #d7e1ec;"><strong>Phone</strong></td>
          <td style="padding:10px;border-bottom:1px solid #d7e1ec;">${phone}</td>
        </tr>
        <tr>
          <td style="padding:10px;border-bottom:1px solid #d7e1ec;"><strong>Email</strong></td>
          <td style="padding:10px;border-bottom:1px solid #d7e1ec;">${safeEmail}</td>
        </tr>
        <tr>
          <td style="padding:10px;border-bottom:1px solid #d7e1ec;"><strong>Brand</strong></td>
          <td style="padding:10px;border-bottom:1px solid #d7e1ec;">${safeBrand}</td>
        </tr>
        <tr>
          <td style="padding:10px;border-bottom:1px solid #d7e1ec;"><strong>Source</strong></td>
          <td style="padding:10px;border-bottom:1px solid #d7e1ec;">${source}</td>
        </tr>
        <tr>
          <td style="padding:10px;"><strong>Submitted At</strong></td>
          <td style="padding:10px;">${submittedAt}</td>
        </tr>
      </table>
    </div>
  `;

  return { subject, text, html };
}

function buildCustomerTemplate({ name, phone, brand }) {
  const safeBrand = brand || "Not selected";

  return {
    subject: "Booking Confirmation - Wash Fix Service Chennai",
    text: [
      `Hi ${name},`,
      "",
      "Your booking request is received.",
      "Our team will call you shortly to confirm the visit.",
      "",
      `Phone: ${phone}`,
      `Brand: ${safeBrand}`,
      "",
      "For urgent support call: +91 94459 59685",
      "Wash Fix Service Chennai",
    ].join("\n"),
    html: `
      <div style="font-family:Arial,Helvetica,sans-serif;line-height:1.55;color:#10233a;max-width:680px;margin:0 auto;">
        <h2 style="margin:0 0 12px 0;color:#0a5f6a;">Booking Confirmation</h2>
        <p style="margin:0 0 10px 0;">Hi ${name},</p>
        <p style="margin:0 0 14px 0;">Your booking request is received. Our team will call you shortly to confirm the visit.</p>
        <table style="width:100%;border-collapse:collapse;background:#f9fcff;border:1px solid #d7e1ec;">
          <tr>
            <td style="padding:10px;border-bottom:1px solid #d7e1ec;"><strong>Phone</strong></td>
            <td style="padding:10px;border-bottom:1px solid #d7e1ec;">${phone}</td>
          </tr>
          <tr>
            <td style="padding:10px;"><strong>Brand</strong></td>
            <td style="padding:10px;">${safeBrand}</td>
          </tr>
        </table>
        <p style="margin:14px 0 0 0;">Urgent support: <strong>+91 94459 59685</strong></p>
        <p style="margin:8px 0 0 0;">Wash Fix Service Chennai</p>
      </div>
    `,
  };
}

export async function POST(request) {
  try {
    if (!isAllowedOrigin(request)) {
      return Response.json(
        { ok: false, code: "ORIGIN_NOT_ALLOWED", message: "Request origin is blocked." },
        { status: 403 }
      );
    }

    const ip = getClientIp(request);
    if (isRateLimited(ip)) {
      return Response.json(
        { ok: false, code: "RATE_LIMITED", message: "Too many requests. Please try again shortly." },
        { status: 429 }
      );
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return Response.json(
        { ok: false, code: "INVALID_JSON", message: "Invalid request payload." },
        { status: 400 }
      );
    }

    const website = sanitizeText(body?.website, 120);
    if (website) {
      return Response.json({ ok: true, message: "Booking request received." });
    }

    const name = sanitizeText(body?.name, 80);
    const phone = sanitizeText(body?.phone, 20);
    const brand = sanitizeText(body?.brand, 60);
    const email = sanitizeText(body?.email, 120).toLowerCase();
    const source = sanitizeText(body?.source || "Website", 80);

    if (name.length < 2 || !/^[6-9][0-9]{9}$/.test(phone)) {
      return Response.json(
        { ok: false, message: "Invalid name or phone." },
        { status: 400 }
      );
    }

    if (email && !isValidEmail(email)) {
      return Response.json(
        { ok: false, message: "Invalid email address." },
        { status: 400 }
      );
    }

    const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
    const smtpPort = Number(process.env.SMTP_PORT || 465);
    const smtpSecure = process.env.SMTP_SECURE !== "false";
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpFrom = process.env.SMTP_FROM || smtpUser;
    const bookingTo = process.env.BOOKING_TO || "washfixchennai@gmail.com";
    const backupBookingTo = String(process.env.BACKUP_BOOKING_TO || "").trim();
    const shouldSendCustomerMail = process.env.SEND_CUSTOMER_CONFIRMATION !== "false";

    if (!smtpUser || !smtpPass || !smtpFrom) {
      return Response.json(
        { ok: false, code: "EMAIL_NOT_CONFIGURED", message: "Email server is not configured." },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const template = buildOwnerTemplate({ name, phone, brand, email, source });

    const ownerRecipients = backupBookingTo
      ? `${bookingTo},${backupBookingTo}`
      : bookingTo;

    await transporter.sendMail({
      from: smtpFrom,
      to: ownerRecipients,
      subject: template.subject,
      text: template.text,
      html: template.html,
      replyTo: email || undefined,
    });

    if (shouldSendCustomerMail && isValidEmail(email)) {
      const customerTemplate = buildCustomerTemplate({ name, phone, brand });
      await transporter.sendMail({
        from: smtpFrom,
        to: email,
        subject: customerTemplate.subject,
        text: customerTemplate.text,
        html: customerTemplate.html,
      });
    }

    return Response.json({ ok: true, message: "Booking email sent." });
  } catch {
    return Response.json(
      { ok: false, code: "EMAIL_SEND_FAILED", message: "Failed to send booking email." },
      { status: 500 }
    );
  }
}
