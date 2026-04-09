// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: '2025-01-01',
	devtools: { enabled: true },
	modules: ['@nuxtjs/tailwindcss'],
	css: ['~/assets/css/main.css'],
	app: {
		head: {
			script: [
				{
					src: `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.ADSENSE_ID || 'ca-pub-XXXXXXXXXXXXXXXX'}`,
					async: true,
					crossorigin: 'anonymous',
				},
			],
		},
	},
	runtimeConfig: {
		public: {
			oauthCallbackUrl: process.env.OAUTH_CALLBACK_URL || 'http://localhost:3030/callback',
			adsenseId: process.env.ADSENSE_ID || 'ca-pub-XXXXXXXXXXXXXXXX',
		},
	},
})
