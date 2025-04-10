import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || "gmail",
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

interface MailOptions {
  to: string;
  subject: string;
  text: string;
}

export const sendEmail = async (options: MailOptions): Promise<void> => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    ...options,
  };

  await transporter.sendMail(mailOptions);
};
