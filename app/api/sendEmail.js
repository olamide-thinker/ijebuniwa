import nodemailer from 'nodemailer'

export default async function handler(req, res) {
	if (req.method === 'POST') {
		const { email, orderId, status } = req.body
		const transporter = nodemailer.createTransport({
			service: 'gmail', // or another email service
			auth: {
				user: process.env.GMAIL_USER,
				pass: process.env.GMAIL_PASS,
			},
		})

		const mailOptions = {
			from: process.env.GMAIL_USER,
			to: email,
			subject: `Order Status Updated - ${orderId}`,
			text: `Hello,\n\nYour order with ID ${orderId} has been updated to ${status}.\n\nThank you for shopping with us!`,
		}

		try {
			await transporter.sendMail(mailOptions)
			return res.status(200).json({ message: 'Email sent successfully' })
		} catch (error) {
			console.error('Error sending email:', error)
			return res.status(500).json({ message: 'Failed to send email', error })
		}
	} else {
		res.setHeader('Allow', ['POST'])
		return res.status(405).end(`Method ${req.method} Not Allowed`)
	}
}
