import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const { firstName, lastName, email, subject, message } = await req.json();

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: `"Reptile Global" <${process.env.SMTP_USER}>`,
      to: 'marcus@reptileglobal.site',
      replyTo: email,
      subject: `New Contact Form Submission: ${subject}`,
      text: `
        New message from ${firstName} ${lastName} (${email})
        
        Subject: ${subject}
        Message:
        ${message}
      `,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>From:</strong> ${firstName} ${lastName} (${email})</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    };

    const userMailOptions = {
      from: `"Reptile Global" <${process.env.SMTP_USER}>`,
      to: email,
      subject: `We received your inquiry: ${subject}`,
      text: `
        Hello ${firstName},
        
        Thank you for contacting Reptile Global. We have received your message and will get back to you as soon as possible.
        
        Your message details:
        Subject: ${subject}
        Message: ${message}
      `,
      html: `
        <h3>Thank you for contacting Reptile Global</h3>
        <p>Hello ${firstName},</p>
        <p>Thank you for your inquiry. We have received your message and will get back to you as soon as possible.</p>
        <hr />
        <p><strong>Your message details:</strong></p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    };

    await Promise.all([
      transporter.sendMail(mailOptions),
      transporter.sendMail(userMailOptions)
    ]);

    return NextResponse.json({ message: 'Email sent successfully' }, { status: 200 });
  } catch (error) {
    console.error('Email error:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
