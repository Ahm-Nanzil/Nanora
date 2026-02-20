import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {

    const { name, email, subject, message } = req.body;

    await resend.emails.send({

      from: "Website Contact <onboarding@resend.dev>",

      to: ["nanrevesoft@email.com"], // CHANGE THIS

      subject: subject,

      html: `
        <h2>New Contact Message</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Message:</b><br>${message}</p>
      `

    });

    return res.status(200).json({ success: true });

  } catch (error) {

    return res.status(500).json({ error: error.message });

  }

}