import { generateCodeVerifier, generateCodeChallenge, generateNonce } from '~/server/utils/pkce'

export default defineEventHandler(async (event) => {
	const body = await readBody<{
		authorizationEndpoint: string
		clientId: string
		redirectUri: string
		scopes: string
		responseType?: string
		state?: string
		pkce?: boolean
		nonce?: boolean
	}>(event)

	if (!body.authorizationEndpoint || !body.clientId || !body.redirectUri) {
		throw createError({ statusCode: 400, message: 'Missing required authorization parameters' })
	}

	const params = new URLSearchParams()
	params.set('client_id', body.clientId)

	let codeVerifier: string | null = null

	if (body.pkce !== false) {
		codeVerifier = generateCodeVerifier()
		const codeChallenge = generateCodeChallenge(codeVerifier)
		params.set('code_challenge', codeChallenge)
		params.set('code_challenge_method', 'S256')
	}

	if (body.nonce !== false) {
		params.set('nonce', generateNonce())
	}

	params.set('response_type', body.responseType || 'code')
	params.set('scope', body.scopes || 'openid profile email')
	params.set('state', body.state || crypto.randomUUID())
	params.set('redirect_uri', body.redirectUri)

	const authUrl = `${body.authorizationEndpoint}?${params.toString()}`

	return {
		authorizationUrl: authUrl,
		state: params.get('state'),
		codeVerifier,
		nonce: params.get('nonce'),
	}
})
