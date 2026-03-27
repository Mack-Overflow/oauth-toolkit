export default defineEventHandler(async (event) => {
	const body = await readBody<{
		userinfoEndpoint: string
		accessToken: string
	}>(event)

	if (!body.userinfoEndpoint || !body.accessToken) {
		throw createError({ statusCode: 400, message: 'Userinfo endpoint and access token are required' })
	}

	const response = await $fetch<Record<string, unknown>>(body.userinfoEndpoint, {
		headers: { Authorization: `Bearer ${body.accessToken}` },
	})

	return response
})
