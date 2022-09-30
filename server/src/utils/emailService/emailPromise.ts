import sgMail from '@sendgrid/mail';


sgMail.setApiKey(process.env.SENDGRID_API_KEY);


export const emailPromise = (data: any) => {
  return new Promise((resolve, reject) => {
    sgMail
      .send({
        to: data.email,
        from: 'luisacosta@carerely.com',
        subject: data.subject,
        html: data.html
      }).then(() => {
      resolve(true)
    }).catch(() => {
      reject(false)
    })
  })

}
