const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");

const transport = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  secure: false,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

// function replaceContent(content, metaData) {
//   return Object.keys(metaData).reduce((updatedContent, key) => {
//     return updatedContent.replace(new RegExp(`#{${key}}`, "g"), metaData[key]);
//   }, content);
// }

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Regex is:
// a pattern language for text
// extremely powerful
// used in almost all programming languages
// perfect for searching & replacing text, validate text (email, phone number, password)
// extract specific parts

// new RegExp(`#{${key}}`, "g")
// This creates a pattern that matches:
// #{name}
// #{bookingId}

// “The g flag in RegExp stands for global, meaning it replaces all occurrences 
// of the pattern instead of stopping after the first match.”

// Other common regex flags (good to know)
// Flag	Meaning
// g	    Global (all matches)
// i	    Case-insensitive
// m	    Multiline
// s	    Dot matches newline
// u	    Unicode
// y	    Sticky

function replaceContent(content, metaData) {
  return Object.keys(metaData).reduce((updatedContent, key) => {

    const pattern = escapeRegExp(`#{${key}}`);
    const regex = new RegExp(pattern, "g");

    const replacement = metaData[key] == null ? "" : String(metaData[key]);
    
    return updatedContent.replace(regex, () => replacement);
  }, content);
}


// escapeRegExp()
// Escapes special characters so your placeholder can safely be used in a regex. => \{name\}

// replaceContent()
// Loops through each key in metaData => name, id

// Builds a safe regex to find #{key} 

// Converts the replacement value to a string

// Replaces all occurrences safely

// Returns the final filled-in email template


async function emailHelper(templateName, receiverEmail, metaData) {
//   templateName → name of the HTML file (e.g., "ticket.html")
//   receiverEmail → the email address to send the email to
//   metaData → dynamic values to fill inside the template (like name, booking ID)
  try {
    const templatePath = path.join(__dirname, "email_templates", templateName);

    let content = await fs.promises.readFile(templatePath, "utf-8");
    content = replaceContent(content, metaData);

    const emailDetails = {
      to: receiverEmail,
      from: process.env.GMAIL_USER,
      subject: "Mail from Sam's BookMyShow",
      html: content,
    };

    await transport.sendMail(emailDetails);
    console.log("email sent");
    
  } 
  catch (err) {
    if (err.code === "ENOENT") {
        // - error.code = ENOENT
        // - means no entry / no entity exist
      console.error("Template file not found:", err.message);
    } 
    else if (err.response && err.response.body) {
      console.error("Error sending email:", err.response.body);
    } 
    else {
      console.error("Error occurred:", err.message);
    }
  }
}

module.exports = emailHelper;

// We use user._id because _id is the real MongoDB ID, created automatically.
// user._email does not exist — only user.email exists.
// MongoDB does NOT add underscores to normal fields; _id is the only built-in field that starts with _.

// You can define _email in your schema, but it is not recommended.
// Only _id is meant to start with _, and using underscore prefixes for normal fields causes confusion and breaks conventions.