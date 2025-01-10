export function EmailTemplate({ firstName, shortUrl }) {
  console.log("Short URL: ", shortUrl);
  return `
      <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
        <div style="text-align: center; padding: 20px; background-color: #f9f9f9;">
          <h1 style="margin: 20px 0; color: #333;">
            Welcome to <span style="color: #FF6363;">CloudShare</span>, ${firstName}!
          </h1>
        </div>
        <div style="padding: 20px; background-color: #ffffff; border: 1px solid #ddd;">
          <p>Hello ${firstName},</p>
          <p>We’re excited to share your file! You can use the link below to access it:</p>
          <div style="text-align: center; margin: 20px 0;">
            <a
              href="${shortUrl}"
              style="
                padding: 10px 20px;
                background-color: #FF6363;
                color: #fff;
                text-decoration: none;
                border-radius: 5px;
                font-weight: bold;
              "
            >
              Access Your File
            </a>
          </div>
          <p>
            If you encounter any issues, please reply to this email or contact us directly at 
            <a href="mailto:rahuul2001@gmail.com" style="color: #FF6363;">
              rahuul2001@gmail.com
            </a>.
          </p>
          <p>Thank you for using <span style="color: #FF6363;">CloudShare</span>!</p>
        </div>
        <div style="text-align: center; padding: 20px; font-size: 12px; color: #999;">
          <p>© ${new Date().getFullYear()} <span style="color: #FF6363;">CloudShare</span>. All rights reserved.</p>
        </div>
      </div>
    `;
}
