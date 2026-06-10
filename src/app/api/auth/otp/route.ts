import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Mock in-memory OTP store for development
const otpStore = new Map<string, { code: string; expiresAt: number }>();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, email, otp } = body;

    if (action === "send") {
      // 1. Generate 6 digit OTP
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = Date.now() + 5 * 60 * 1000; // 5 mins

      otpStore.set(email, { code, expiresAt });
      console.log(`[DEBUG OTP CODE FOR TESTING]: ${code} for email ${email}`);

      // 2. Setup Nodemailer Transporter
      const { SMTP_EMAIL, SMTP_PASSWORD } = process.env;
      
      if (!SMTP_EMAIL || !SMTP_PASSWORD || SMTP_EMAIL === "email_anda@gmail.com") {
        console.error("Missing SMTP credentials in .env.local");
        return NextResponse.json({ success: false, error: "SMTP_CONFIG_ERROR", message: "Server email belum dikonfigurasi dengan benar oleh admin." }, { status: 500 });
      }

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: SMTP_EMAIL,
          pass: SMTP_PASSWORD,
        },
      });

      // 3. HTML Email Template
      const mailOptions = {
        from: `"RuangAksara Library" <${SMTP_EMAIL}>`,
        to: email,
        subject: "Kode OTP Pendaftaran RuangAksara",
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
          <h2 style="color: #2563eb; text-align: center; margin-bottom: 24px;">RuangAksara</h2>
          <p style="color: #334155; font-size: 16px;">Halo,</p>
          <p style="color: #334155; font-size: 16px; line-height: 1.5;">Anda sedang melakukan pendaftaran akun baru di sistem perpustakaan cerdas RuangAksara. Berikut adalah kode OTP Anda:</p>
          
          <div style="background-color: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 8px; padding: 16px; text-align: center; margin: 24px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #0f172a;">${code}</span>
          </div>
          
          <p style="color: #64748b; font-size: 14px; line-height: 1.5;">Kode ini berlaku selama <strong>5 menit</strong>. Jangan berikan kode ini kepada siapapun demi keamanan akun Anda.</p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
          <p style="color: #94a3b8; font-size: 12px; text-align: center;">Ini adalah email otomatis, mohon tidak membalas email ini.</p>
        </div>
        `
      };

      // 4. Send Email
      try {
        await transporter.sendMail(mailOptions);
        console.log(`[SMTP] Successfully sent OTP to ${email}`);
        return NextResponse.json({ success: true, message: "OTP sent" });
      } catch (emailError) {
        console.error("SMTP Send Error:", emailError);
        return NextResponse.json({ success: false, error: "SMTP_SEND_ERROR", message: "Gagal mengirim email. Pastikan alamat email aktif dan benar." }, { status: 500 });
      }
    }

    if (action === "verify") {
      const stored = otpStore.get(email);
      if (!stored) {
        return NextResponse.json({ success: false, error: "OTP_NOT_FOUND", message: "Silakan kirim ulang OTP" }, { status: 400 });
      }

      if (Date.now() > stored.expiresAt) {
        otpStore.delete(email);
        return NextResponse.json({ success: false, error: "OTP_EXPIRED", message: "Kode OTP telah kedaluwarsa" }, { status: 400 });
      }

      if (stored.code !== otp) {
        return NextResponse.json({ success: false, error: "OTP_INVALID", message: "Kode OTP salah" }, { status: 400 });
      }

      // Success
      otpStore.delete(email);
      return NextResponse.json({ success: true, message: "Email diverifikasi" });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("OTP Route Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
