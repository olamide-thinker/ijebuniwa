'use server'
import nodemailer from 'nodemailer'

export const sendOrderUpdateEmail = async (email, status, orderId) => {
	console.log('first:::::>', email, status, orderId)
	const orderDate = new Date().toLocaleDateString('en-US', { dateStyle: 'full' })

	// Create a transporter
	const transporter = nodemailer.createTransport({
		host: process.env.EMAIL_HOST,
		port: process.env.EMAIL_PORT,
		secure: true, // true for 465, false for other ports
		auth: {
			user: process.env.EMAIL_USER,
			pass: process.env.EMAIL_PASS,
		},
	})

	// Define the email content
	const mailOptions = {
		from: `"Your Store" <${process.env.EMAIL_USER}>`, // Sender address
		to: email, // List of receivers
		subject: `Order #${orderId} Status Update`, // Subject line
		text: `Your order status has been updated to: ${status}.`, // Plain text body
		html: `
  <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
    <div style="background-color: #f5f5f5; padding: 20px;">
      <h2 style="color: #1a73e8; text-align: center;">Sync Sales</h2>
    </div>
    <div style="padding: 20px; border: 1px solid #eaeaea; background-color: #ffffff;">
      <p>Dear Customer,</p>
      <p>We’re pleased to inform you that the status of your order has been updated:</p>
      <p style="font-size: 1.1em; color: #1a73e8;">
        <strong>Order Status: ${status}</strong>
      </p>
      <p>Thank you for choosing us. We are committed to providing you with the best service and are here to help if you have any questions.</p>
      <p>You can review your order details and stay updated on any further changes by logging into your account.</p>
      <br/>
      <h3 style="margin-top: 0;">Order Details</h3>
      <ul>
        <li><strong>Order ID:</strong> ${orderId}</li>
        <li><strong>Order Date:</strong> ${orderDate}</li>
      </ul>
    </div>
    <footer style="background-color: #f5f5f5; padding: 20px; text-align: center; font-size: 0.9em; color: #555;">
      <p>Sync Sales NG</p>
      <p>12, Oremeji Street, Computer Village, Ikeja</p>
      <p>Phone: (123) 456-7890 | Email: support@yourcompany.com</p>
      <p>&copy; ${new Date().getFullYear()} Your Company Name. All rights reserved.</p>
    </footer>
  </div>
`,
	}

	// Send the email
	try {
		await transporter.sendMail(mailOptions)
		console.log('Email sent successfully')
	} catch (error) {
		console.error('Error sending email:', error)
	}
}
