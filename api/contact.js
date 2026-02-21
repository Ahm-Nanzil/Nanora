import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

console.log("Loaded API KEY:", process.env.RESEND_API_KEY);

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {

  console.log("Function triggered");

  if (req.method !== "POST") {
    console.log("Wrong method:", req.method);
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {

    console.log("Request body:", req.body);

    const { name, email, subject, message } = req.body;

    console.log("Sending email via Resend...");

    const result = await resend.emails.send({

      from: "onboarding@resend.dev",

      to: ["nanrevesoft@gmail.com"],

      subject: subject || "Test email",

      html: `
        <h2>Test Email</h2>
        <p>Name: ${name}</p>
        <p>Email: ${email}</p>
        <p>Message: ${message}</p>
      `

    });

    console.log("Resend SUCCESS:", result);

    return res.status(200).json({ success: true });

  } catch (error) {

    console.error("Resend ERROR:", error);

    return res.status(500).json({
      success: false,
      error: error.message
    });

  }

}