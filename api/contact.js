import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed"
    });
  }

  try {
    const {
      fullName,
      company,
      email,
      phone,
      subject,
      budget,
      serviceInterest,
      message
    } = req.body;

    console.log("Incoming contact form:", {
      fullName,
      company,
      email,
      phone,
      subject,
      budget,
      serviceInterest,
      message
    });

    // Validate required fields
    const missingFields = [];

    if (!fullName || fullName.trim() === "") {
      missingFields.push("fullName");
    }

    if (!email || email.trim() === "") {
      missingFields.push("email");
    }

    if (!subject || subject.trim() === "") {
      missingFields.push("subject");
    }

    if (!message || message.trim() === "") {
      missingFields.push("message");
    }

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Missing required field(s): ${missingFields.join(", ")}`
      });
    }

    await resend.emails.send({
    from: "NanoRa Support <support@nanoratech.com>",
    to: ["ahmnanzilofficial@gmail.com"],
    reply_to: email,
    subject: `New Consultation Request: ${subject}`,

      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #222;">

          <h2 style="color: #0d6efd;">
            🚀 New Free Consultation Request
          </h2>

          <hr>

          <h3>Contact Information</h3>

          <p>
            <strong>Full Name:</strong><br>
            ${fullName}
          </p>

          <p>
            <strong>Email:</strong><br>
            ${email}
          </p>

          <p>
            <strong>Phone:</strong><br>
            ${phone && phone.trim() !== "" ? phone : "Not Provided"}
          </p>

          <p>
            <strong>Company:</strong><br>
            ${company && company.trim() !== "" ? company : "Not Provided"}
          </p>

          <hr>

          <h3>Project Information</h3>

          <p>
            <strong>Project Title:</strong><br>
            ${subject}
          </p>

          <p>
            <strong>Estimated Budget:</strong><br>
            ${budget || "Not Provided"}
          </p>

          <p>
            <strong>Service Interested In:</strong><br>
            ${serviceInterest || "Not Provided"}
          </p>

          <p>
            <strong>Project Details:</strong>
          </p>

          <div style="
            background: #f5f5f5;
            padding: 15px;
            border-radius: 8px;
            white-space: pre-wrap;
          ">
            ${message}
          </div>

          <hr>

          <p style="color: #777; font-size: 13px;">
            This consultation request was submitted from the NanoRa website.
          </p>

        </div>
      `
    });

    return res.status(200).json({
      success: true
    });

  } catch (error) {

    console.error("Resend ERROR:", error);

    return res.status(500).json({
      success: false,
      error: error.message || "Failed to send email"
    });
  }
}