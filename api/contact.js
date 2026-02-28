import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {

    const { name, email, company, service, message } = req.body;

    console.log("Incoming data:", { name, email, company, service, message });

    const missingFields = [];

    if (!name || name.trim() === "") missingFields.push("name");
    if (!email || email.trim() === "") missingFields.push("email");
    if (!service || service.trim() === "") missingFields.push("service");
    if (!message || message.trim() === "") missingFields.push("message");

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Missing required field(s): ${missingFields.join(", ")}`
      });
    }

    await resend.emails.send({
      from: "NanoRa <contact@nanoratech.com>",
      to: ["nanrevesoft@gmail.com"],
      reply_to: email,
      subject: `New Consultation Request from ${name}`,
      html: `
        <h2>🚀 New Free Consultation Request</h2>

        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Company:</strong> ${company && company.trim() !== "" ? company : "Not Provided"}</p>
        <p><strong>Service Needed:</strong> ${service}</p>

        <hr>

        <p><strong>Project Details:</strong></p>
        <p>${message}</p>

        <hr>

        <p>This request was submitted from NanoRa website.</p>
      `
    });

    return res.status(200).json({ success: true });

  } catch (error) {

    console.error("Resend ERROR:", error);

    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}