import crypto from 'node:crypto'

export function generateCodeVerifier(length = 64): string {
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~'
	const bytes = crypto.randomBytes(length)
	return Array.from(bytes).map(b => chars[b % chars.length]).join('')
}

export function generateCodeChallenge(verifier: string): string {
	const hash = crypto.createHash('sha256').update(verifier).digest()
	return hash.toString('base64url')
}

export function generateNonce(length = 16): string {
	return crypto.randomBytes(length).toString('base64url')
}
