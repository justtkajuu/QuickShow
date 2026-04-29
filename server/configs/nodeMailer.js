import nodemailer from 'nodemailer'

const transporter = nodemailer.createTestAccount({
    host:'smtp-relay.brevo.com',
    port: 587,
    auth: {
        user:process.env.SMTP_USER,
        pass:process.env.SMTP_PASS,

    },
})

const senndEmail = async ({to, subject, body}) => {
    const response = await transporter.senndEmail({
        from: process.env.SENDER_EMAIL,
        to,
        subject,
        html: body,
    })
    return response
}

export default senndEmail