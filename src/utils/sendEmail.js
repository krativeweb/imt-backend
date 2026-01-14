import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false, // 🔥 REQUIRED on VPS / cloud
  },
});

const CATEGORY_EMAIL_MAP = {
  admissions: "sayanasansol.1995@gmail.com",
  cro: "sayankolkata.1995@gmail.com",
};

const sendContactEmail = async ({
  firstName,
  lastName,
  email,
  phone,
  category,
  message,
}) => {
  const to = CATEGORY_EMAIL_MAP[category];

  if (!to) {
    throw new Error("Invalid category value");
  }

  await transporter.sendMail({
    from: process.env.MAIL_USER, // 🔥 MUST MATCH GMAIL
    to,
    replyTo: email,
    subject: `New Contact Query - ${category.toUpperCase()}`,
    html: `
      <h3>New Contact Form Submission</h3>
      <p><b>Name:</b> ${firstName} ${lastName || ""}</p>
      <p><b>Email:</b> ${email}</p>
      <p><b>Phone:</b> ${phone || "N/A"}</p>
      <p><b>Category:</b> ${category}</p>
      <p><b>Message:</b><br/>${message}</p>
    `,
  });
};

export default sendContactEmail;
