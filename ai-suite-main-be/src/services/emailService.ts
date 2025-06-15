import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: process.env.EMAIL_PORT === '465',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send an email using Nodemailer
export const sendEmail = async (to: string, subject: string, text: string, html?: string): Promise<void> => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
    html,
  };

  await transporter.sendMail(mailOptions);
};

// Send an email for the contact form
export const sendContactFormEmail = async (name: string, email: string, message: string): Promise<void> => {
  const subject = `Contact Form Submission(Portfolio AI Suite): from ${name}`;
  const text = `Name: ${name}\nEmail: ${email}\nMessage: ${message}`;
  const html = `<h1>Contact Form Submission</h1><p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong> ${message}</p>`;

  await sendEmail(process.env.EMAIL_USER || '', subject, text, html);
}; 