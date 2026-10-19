import nodemailer from "nodemailer";

// ─── Transporter (Gmail App Password) ────────────────────────────────────────
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

// ─── Types ────────────────────────────────────────────────────────────────────
interface QuoteEmailData {
  fullName: string;
  companyName?: string;
  phoneNumber: string;
  email?: string;
  requiredService: string;
  message: string;
}

// ─── Thank-You email to the client ───────────────────────────────────────────
async function sendClientThankYou(data: QuoteEmailData) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Thank You — Lenux</title>
    </head>
    <body style="margin:0;padding:0;background:#0a0a0a;font-family:'Segoe UI',Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 0;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0"
              style="background:#111111;border-radius:20px;overflow:hidden;border:1px solid #1f2937;max-width:600px;width:100%;">

              <!-- Header -->
              <tr>
                <td style="background:linear-gradient(135deg,#0d1f17 0%,#092e1f 100%);padding:40px 40px 30px;text-align:center;border-bottom:1px solid #1f2937;">
                  <p style="margin:0 0 12px;font-size:13px;color:#34d399;font-weight:700;letter-spacing:3px;text-transform:uppercase;">✦ Lenux Production</p>
                  <h1 style="margin:0;font-size:28px;font-weight:800;color:#ffffff;line-height:1.3;">
                    Thank You, ${data.fullName}! 🎉
                  </h1>
                  <p style="margin:12px 0 0;font-size:15px;color:#9ca3af;">
                    We have received your quote request.
                  </p>
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding:36px 40px;">
                  <p style="margin:0 0 20px;font-size:15px;color:#d1d5db;line-height:1.7;">
                    Hi <strong style="color:#fff;">${data.fullName}</strong>,<br/>
                    Your quotation request for <strong style="color:#34d399;">${data.requiredService}</strong> has been 
                    received successfully. Our team will review your requirements and get back to you shortly.
                  </p>

                  <!-- Summary box -->
                  <table width="100%" cellpadding="0" cellspacing="0"
                    style="background:#0d0d0d;border:1px solid #1f2937;border-radius:12px;margin:20px 0;">
                    <tr>
                      <td style="padding:24px 28px;">
                        <p style="margin:0 0 14px;font-size:11px;color:#34d399;font-weight:700;letter-spacing:2px;text-transform:uppercase;">Request Summary</p>
                        <table width="100%" cellpadding="0" cellspacing="0">
                          <tr>
                            <td style="padding:6px 0;font-size:13px;color:#6b7280;width:40%;">Name</td>
                            <td style="padding:6px 0;font-size:13px;color:#e5e7eb;font-weight:600;">${data.fullName}</td>
                          </tr>
                          ${data.companyName ? `
                          <tr>
                            <td style="padding:6px 0;font-size:13px;color:#6b7280;">Company</td>
                            <td style="padding:6px 0;font-size:13px;color:#e5e7eb;font-weight:600;">${data.companyName}</td>
                          </tr>` : ""}
                          <tr>
                            <td style="padding:6px 0;font-size:13px;color:#6b7280;">Service</td>
                            <td style="padding:6px 0;font-size:13px;color:#34d399;font-weight:700;">${data.requiredService}</td>
                          </tr>
                          <tr>
                            <td style="padding:6px 0;font-size:13px;color:#6b7280;">Phone</td>
                            <td style="padding:6px 0;font-size:13px;color:#e5e7eb;font-weight:600;">${data.phoneNumber}</td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>

                  <p style="margin:20px 0 28px;font-size:14px;color:#9ca3af;line-height:1.7;">
                    ⏱ We typically respond within <strong style="color:#fff;">24 – 48 hours</strong>. 
                    In the meantime, feel free to explore more of what we offer.
                  </p>

                  <!-- CTA Button -->
                  ${siteUrl ? `
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td align="center">
                        <a href="${siteUrl}"
                          style="display:inline-block;background:#16a34a;color:#ffffff;padding:14px 36px;border-radius:10px;font-size:14px;font-weight:700;text-decoration:none;letter-spacing:1px;text-transform:uppercase;">
                          Visit Our Website →
                        </a>
                      </td>
                    </tr>
                  </table>` : ""}
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background:#0d0d0d;padding:24px 40px;border-top:1px solid #1f2937;text-align:center;">
                  <p style="margin:0 0 4px;font-size:12px;color:#4b5563;">
                    © ${new Date().getFullYear()} Lenux Production. All rights reserved.
                  </p>
                  ${siteUrl ? `<p style="margin:0;font-size:12px;color:#374151;">
                    <a href="${siteUrl}" style="color:#34d399;text-decoration:none;">${siteUrl.replace(/https?:\/\//, "")}</a>
                  </p>` : ""}
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: `"Lenux Production" <${process.env.GMAIL_USER}>`,
    to: data.email,
    subject: `✅ Quote Request Received — ${data.requiredService} | Lenux Production`,
    html,
  });
}

// ─── Internal notification to business inbox ─────────────────────────────────
async function sendBusinessNotification(data: QuoteEmailData, businessEmail: string) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <body style="margin:0;padding:0;background:#0a0a0a;font-family:'Segoe UI',Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 0;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0"
              style="background:#111111;border-radius:16px;overflow:hidden;border:1px solid #1f2937;max-width:600px;width:100%;">

              <tr>
                <td style="background:#0d1f17;padding:28px 36px;border-bottom:1px solid #1f2937;">
                  <p style="margin:0 0 4px;font-size:12px;color:#34d399;font-weight:700;letter-spacing:2px;text-transform:uppercase;">🔔 New Quote Request</p>
                  <h2 style="margin:0;font-size:22px;color:#fff;font-weight:800;">${data.fullName}</h2>
                  <p style="margin:4px 0 0;font-size:13px;color:#9ca3af;">wants a quote for <strong style="color:#34d399;">${data.requiredService}</strong></p>
                </td>
              </tr>

              <tr>
                <td style="padding:28px 36px;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr><td style="padding:7px 0;font-size:13px;color:#6b7280;width:35%;">Full Name</td><td style="padding:7px 0;font-size:13px;color:#e5e7eb;">${data.fullName}</td></tr>
                    ${data.companyName ? `<tr><td style="padding:7px 0;font-size:13px;color:#6b7280;">Company</td><td style="padding:7px 0;font-size:13px;color:#e5e7eb;">${data.companyName}</td></tr>` : ""}
                    <tr><td style="padding:7px 0;font-size:13px;color:#6b7280;">Phone</td><td style="padding:7px 0;font-size:13px;color:#e5e7eb;">${data.phoneNumber}</td></tr>
                    <tr><td style="padding:7px 0;font-size:13px;color:#6b7280;">Email</td><td style="padding:7px 0;font-size:13px;color:#e5e7eb;">${data.email || "—"}</td></tr>
                    <tr><td style="padding:7px 0;font-size:13px;color:#6b7280;">Service</td><td style="padding:7px 0;font-size:13px;color:#34d399;font-weight:700;">${data.requiredService}</td></tr>
                  </table>

                  <div style="background:#0d0d0d;border:1px solid #1f2937;border-radius:10px;padding:18px 20px;margin-top:16px;">
                    <p style="margin:0 0 8px;font-size:11px;color:#34d399;font-weight:700;letter-spacing:2px;text-transform:uppercase;">Message</p>
                    <p style="margin:0;font-size:14px;color:#d1d5db;line-height:1.7;">${data.message}</p>
                  </div>

                  ${siteUrl ? `
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;">
                    <tr>
                      <td align="center">
                        <a href="${siteUrl}/admin/quotes"
                          style="display:inline-block;background:#16a34a;color:#fff;padding:12px 32px;border-radius:8px;font-size:13px;font-weight:700;text-decoration:none;letter-spacing:1px;text-transform:uppercase;">
                          View in Admin Panel →
                        </a>
                      </td>
                    </tr>
                  </table>` : ""}
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: `"Lenux Quote System" <${process.env.GMAIL_USER}>`,
    to: businessEmail,
    subject: `🆕 New Quote Request — ${data.requiredService} from ${data.fullName}`,
    html,
  });
}

// ─── Main exported function ───────────────────────────────────────────────────
export async function sendQuoteEmails(data: QuoteEmailData, businessEmail?: string): Promise<void> {
  const promises: Promise<void>[] = [];

  // Client thank-you — email address thiyenama vitharai
  if (data.email) {
    promises.push(sendClientThankYou(data));
  }

  // Business notification — DB email or GMAIL_TO env fallback
  const recipient = businessEmail || process.env.GMAIL_TO;
  if (recipient) {
    promises.push(sendBusinessNotification(data, recipient));
  }

  // Parallel send — one fails වුනත් other affect නොකරයි
  await Promise.allSettled(promises);
}
