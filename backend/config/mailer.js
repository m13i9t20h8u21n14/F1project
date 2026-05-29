const nodemailer = require('nodemailer');

let transporterPromise = (async () => {
  // If credentials are provided in env, use them
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    console.log('[Mailer] Using SMTP Configuration from environment variables.');
    
    const config = {
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT) || 587,
      secure: process.env.EMAIL_PORT === '465', // true for 465, false for others
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    };
    
    // Support EMAIL_SERVICE directly if provided (e.g. 'gmail')
    if (process.env.EMAIL_SERVICE) {
      config.service = process.env.EMAIL_SERVICE;
    }
    
    return nodemailer.createTransport(config);
  } else {
    // Fallback: Create Ethereal test account automatically
    console.log('[Mailer] No SMTP credentials. Creating Ethereal Test Account...');
    try {
      const testAccount = await nodemailer.createTestAccount();
      console.log(`[Mailer] Ethereal Account Created: User: ${testAccount.user}`);
      
      return nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    } catch (err) {
      console.error('[Mailer] Error creating Ethereal account: ', err);
      // Stub transporter so application doesn't crash
      return {
        sendMail: async (options) => {
          console.log('--- EMAIL SEND STUB ---');
          console.log(`To: ${options.to}`);
          console.log(`Subject: ${options.subject}`);
          console.log(`Text: ${options.text}`);
          console.log('------------------------');
          return { messageId: 'stub-id' };
        }
      };
    }
  }
})();

const sendEmail = async (options) => {
  try {
    const transporter = await transporterPromise;
    const mailOptions = {
      from: process.env.EMAIL_FROM || '"Secure Auth" <no-reply@example.com>',
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    };

    const info = await transporter.sendMail(mailOptions);
    
    // If using Ethereal, print the test message URL for previewing
    if (nodemailer.getTestMessageUrl) {
      const url = nodemailer.getTestMessageUrl(info);
      if (url) {
        console.log(`\n======================================================`);
        console.log(`✉️  EMAIL SENT SUCCESSFULLY!`);
        console.log(`🔗  Preview Email URL: ${url}`);
        console.log(`======================================================\n`);
        // We'll also attach the preview URL to the result so the backend can return it in test/dev modes
        info.previewUrl = url;
      }
    }
    return info;
  } catch (error) {
    console.error('Error sending email: ', error);
    throw new Error('Email sending failed');
  }
};

module.exports = sendEmail;
