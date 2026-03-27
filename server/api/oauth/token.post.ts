export default defineEventHandler(async (event) => {
	const body = await readBody<{
		tokenEndpoint: string
		clientId: string
		clientSecret: string
		code: string
		redirectUri: string
		grantType?: string
	}>(event)

	if (!body.tokenEndpoint || !body.clientId || !body.code) {
		throw createError({ statusCode: 400, message: 'Missing required token parameters' })
	}

	const params = new URLSearchParams({
		grant_type: body.grantType || 'authorization_code',
		client_id: body.clientId,
		client_secret: body.clientSecret || '',
		code: body.code,
		redirect_uri: body.redirectUri || '',
	})

	const response = await $fetch<Record<string, unknown>>(body.tokenEndpoint, {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body: params.toString(),
	})

	return response
})
