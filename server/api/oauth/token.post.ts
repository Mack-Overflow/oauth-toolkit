export default defineEventHandler(async (event) => {
	const body = await readBody<{
		tokenEndpoint: string
		clientId: string
		clientSecret: string
		code: string
		redirectUri: string
		grantType?: string
		codeVerifier?: string
		basicAuth?: boolean
	}>(event)

	if (!body.tokenEndpoint || !body.clientId || !body.code) {
		throw createError({ statusCode: 400, message: 'Missing required token parameters' })
	}

	const params = new URLSearchParams({
		grant_type: body.grantType || 'authorization_code',
		code: body.code,
		redirect_uri: body.redirectUri || '',
	})

	// If using basic auth, credentials go in the header, not the body
	const headers: Record<string, string> = {
		'Content-Type': 'application/x-www-form-urlencoded',
	}

	if (body.basicAuth) {
		const credentials = Buffer.from(`${body.clientId}:${body.clientSecret || ''}`).toString('base64')
		headers['Authorization'] = `Basic ${credentials}`
	} else {
		params.set('client_id', body.clientId)
		if (body.clientSecret) {
			params.set('client_secret', body.clientSecret)
		}
	}

	if (body.codeVerifier) {
		params.set('code_verifier', body.codeVerifier)
	}

	const response = await $fetch<Record<string, unknown>>(body.tokenEndpoint, {
		method: 'POST',
		headers,
		body: params.toString(),
	})

	return response
})
