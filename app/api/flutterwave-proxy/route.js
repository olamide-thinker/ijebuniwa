import axios from 'axios'

export async function POST(req) {
	try {
		const body = await req.json() // Parse the incoming request body
		const { payload } = body

		const response = await axios.post('https://api.flutterwave.com/v3/payments', payload, {
			headers: {
				Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
				'Content-Type': 'application/json',
			},
		})

		return new Response(JSON.stringify(response.data), { status: 200 })
	} catch (error) {
		console.error('Error with Flutterwave Proxy:', error.response?.data || error.message)
		return new Response(
			JSON.stringify(error.response?.data || { message: 'Internal Server Error' }),
			{ status: error.response?.status || 500 },
		)
	}
}
