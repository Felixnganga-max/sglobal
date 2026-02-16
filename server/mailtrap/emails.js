const { VERIFICATION_EMAIL_TEMPLATE } = require("./emailTemplates.js");
const { mailtrapClient, sender } = require("./mailtrap.config.js");

const sendVerificationEmail = async (email, verificationToken) => {
  const recipient = [{ email }]; // Ensure `email` is structured correctly

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Verify your email",
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        "{verificationCode}",
        verificationToken
      ),
      category: "Email Verification",
    });

    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error(`Error while sending email: ${error.message}`);
  }
};

const sendWelcomeEmail = async (email, name) => {
  const recipient = [{ email }]; // Ensure `email` is structured correctly

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      template_uuid: "db6ebbd8-86ff-4720-a260-a82d4fac0142",
      template_variables: {
        company_info_name: "Serenity Technologies",
        name: name,
      },
    });

    console.log("Welcome email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = { sendVerificationEmail, sendWelcomeEmail };
