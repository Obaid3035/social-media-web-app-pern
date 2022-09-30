import sgMail from '@sendgrid/mail';
import { emailPromise } from './emailPromise';


sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const emailConfirmationMail = async (email: string, token: string) => {
  try {
    const html = `<h3>Please click on the link below to verify your email</h3><br/>
			<a href="http://localhost:3000/mail-confirmation/${token}">Click Here</a>`
    const subject = "Verify Email"
    await emailPromise({ email: email, html, subject })
    return true
  } catch (e) {
    return false
  }
};


export const reportMail = async (email: string, report: string) => {
  try {
    const html = `<h3>${report}</h3>`
    const subject = "Report"
    await emailPromise({ email: email, html, subject })
    return true
  } catch (e) {
    return false
  }
};
