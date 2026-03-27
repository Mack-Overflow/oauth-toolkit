import { decodeToken } from '~/server/utils/jwt'

export default defineEventHandler(async (event) => {
	const body = await readBody<{ token: string }>(event)

	if (!body.token) {
		throw createError({ statusCode: 400, message: 'Token is required' })
	}

	const decoded = decodeToken(body.token)

	if (!decoded) {
		throw createError({ statusCode: 400, message: 'Invalid token format' })
	}

	const payload = (decoded as any).payload || decoded
	const header = (decoded as any).header || null

	const now = Math.floor(Date.now() / 1000)
	const isExpired = payload.exp ? payload.exp < now : false

	return {
		header,
		payload,
		isExpired,
		expiresAt: payload.exp ? new Date(payload.exp * 1000).toISOString() : null,
		issuedAt: payload.iat ? new Date(payload.iat * 1000).toISOString() : null,
	}
})
