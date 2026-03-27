import jwt from 'jsonwebtoken'

export function decodeToken(token: string): Record<string, unknown> | null {
	try {
		const decoded = jwt.decode(token, { complete: true })
		return decoded as Record<string, unknown> | null
	} catch {
		return null
	}
}

export function verifyToken(token: string, secret: string): Record<string, unknown> | null {
	try {
		const verified = jwt.verify(token, secret)
		return verified as Record<string, unknown>
	} catch {
		return null
	}
}
