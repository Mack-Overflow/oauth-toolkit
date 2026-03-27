export default defineEventHandler(async (event) => {
	const body = await readBody<{ discoveryUrl: string }>(event)

	if (!body.discoveryUrl) {
		throw createError({ statusCode: 400, message: 'Discovery URL is required' })
	}

	const url = body.discoveryUrl.endsWith('/.well-known/openid-configuration')
		? body.discoveryUrl
		: `${body.discoveryUrl.replace(/\/$/, '')}/.well-known/openid-configuration`

	const response = await $fetch<Record<string, unknown>>(url)
	return response
})
