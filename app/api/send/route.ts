import { NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';
import { EmailTemplate } from '../../_components/email-template';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function POST(request: Request) {
  try {
    const { email, shortUrl, firstName } = await request.json();

    const htmlContent = EmailTemplate({ firstName, shortUrl });

    const msg = {
      to: email,
      from: 'CloudShare <rahuul2001@gmail.com>', // Replace with your verified sender
      subject: 'Your CloudShare file link is ready!',
      html: htmlContent,
    };

    await sgMail.send(msg);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error('Error sending email:', error.response);
    return NextResponse.json(
      { success: false, message: error.message.body.errors || 'Failed to send email.' },
      { status: 500 }
    );
  }
}
