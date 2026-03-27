export default defineEventHandler(async (event) => {
	const body = await readBody<{
		authorizationEndpoint: string
		clientId: string
		redirectUri: string
		scopes: string
		responseType?: string
		state?: string
	}>(event)

	if (!body.authorizationEndpoint || !body.clientId || !body.redirectUri) {
		throw createError({ statusCode: 400, message: 'Missing required authorization parameters' })
	}

	const params = new URLSearchParams({
		client_id: body.clientId,
		redirect_uri: body.redirectUri,
		response_type: body.responseType || 'code',
		scope: body.scopes || 'openid profile email',
		state: body.state || crypto.randomUUID(),
	})

	const authUrl = `${body.authorizationEndpoint}?${params.toString()}`

	return { authorizationUrl: authUrl, state: params.get('state') }
})
