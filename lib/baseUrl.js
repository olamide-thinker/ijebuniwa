const baseUrl =
	process.env.NODE_ENV === 'production'
		? 'https://www.laptopwarehouseonline.net/'
		: 'http://localhost:3000'

export default baseUrl
