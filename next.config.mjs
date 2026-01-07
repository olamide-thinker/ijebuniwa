/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'firebasestorage.googleapis.com',
			},
		],
	},
	webpack: (config) => {
		// Enable WebAssembly experiments
		config.experiments = {
			...config.experiments,
			asyncWebAssembly: true,
			// missingSuspenseWithCSRBailout: false,
		}

		// Add module rules for handling .wasm files
		config.module.rules.push({
			test: /\.wasm$/,
			type: 'webassembly/async',
		})

		// Alias 'net' to an empty module
		config.resolve = {
			...config.resolve,
			fallback: {
				...config.resolve?.fallback,
				net: false, // Disable or mock the 'net' module
			},
		}

		return config
	},
}

export default nextConfig
