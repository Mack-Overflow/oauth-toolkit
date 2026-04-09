interface OAuthConfig {
	discoveryUrl: string
	clientId: string
	clientSecret: string
	redirectUri: string
	scopes: string
}

interface OAuthState {
	config: OAuthConfig
	discoveryMode: 'auto' | 'manual'
	manualEndpoints: Record<string, unknown> | null
	manualEndpointsRaw: string
	discoveryResult: Record<string, unknown> | null
	authorizationCode: string | null
	codeVerifier: string | null
	pkce: boolean
	basicAuth: boolean
	tokenResponse: Record<string, unknown> | null
	validationResult: Record<string, unknown> | null
	userInfo: Record<string, unknown> | null
	logs: LogEntry[]
}

interface LogEntry {
	timestamp: Date
	type: 'request' | 'response' | 'error' | 'info'
	label: string
	data: unknown
}

// Map common non-standard key names to OIDC-canonical names
const KEY_ALIASES: Record<string, string> = {
	authorize_url: 'authorization_endpoint',
	auth_url: 'authorization_endpoint',
	auth_uri: 'authorization_endpoint',
	authorization_url: 'authorization_endpoint',
	token_url: 'token_endpoint',
	token_uri: 'token_endpoint',
	user_info_url: 'userinfo_endpoint',
	userinfo_url: 'userinfo_endpoint',
	user_info_uri: 'userinfo_endpoint',
	userinfo_uri: 'userinfo_endpoint',
	jwks_url: 'jwks_uri',
}

function normalizeEndpoints(raw: Record<string, unknown>): Record<string, unknown> {
	const result: Record<string, unknown> = {}
	for (const [key, value] of Object.entries(raw)) {
		const canonical = KEY_ALIASES[key] ?? key
		// Don't overwrite if the canonical key was already provided explicitly
		if (!(canonical in result)) {
			result[canonical] = value
		}
	}
	return result
}

export const useOAuthStore = () => {
	const state = useState<OAuthState>('oauth', () => ({
		config: {
			discoveryUrl: '',
			clientId: '',
			clientSecret: '',
			redirectUri: 'http://localhost:3030/callback',
			scopes: 'openid profile email',
		},
		discoveryMode: 'auto',
		manualEndpoints: null,
		manualEndpointsRaw: '',
		discoveryResult: null,
		authorizationCode: null,
		codeVerifier: null,
		pkce: true,
		basicAuth: false,
		tokenResponse: null,
		validationResult: null,
		userInfo: null,
		logs: [],
	}))

	const endpoints = computed<Record<string, unknown> | null>(() => {
		if (state.value.discoveryMode === 'auto') {
			return state.value.discoveryResult
		}
		// Re-derive from the raw JSON string so Vue tracks the reactive dependency
		const raw = state.value.manualEndpointsRaw
		if (!raw) return null
		try {
			const parsed = JSON.parse(raw)
			const normalized = normalizeEndpoints(parsed)
			if (normalized.authorization_endpoint || normalized.token_endpoint) {
				return normalized
			}
		} catch {
			// invalid JSON — treat as no endpoints
		}
		return null
	})

	function addLog(type: LogEntry['type'], label: string, data: unknown) {
		state.value.logs.unshift({
			timestamp: new Date(),
			type,
			label,
			data,
		})
	}

	function clearLogs() {
		state.value.logs = []
	}

	function resetFlow() {
		state.value.discoveryResult = null
		state.value.authorizationCode = null
		state.value.codeVerifier = null
		state.value.tokenResponse = null
		state.value.validationResult = null
		state.value.userInfo = null
	}

	function applyManualJson(json: string): string | null {
		try {
			const parsed = JSON.parse(json)
			if (typeof parsed !== 'object' || parsed === null) {
				return 'Must be a JSON object'
			}
			const normalized = normalizeEndpoints(parsed)
			state.value.manualEndpoints = normalized
			state.value.manualEndpointsRaw = JSON.stringify(parsed, null, 2)

			// Auto-fill client config fields from the JSON if present
			if (parsed.client_id && !state.value.config.clientId) {
				state.value.config.clientId = String(parsed.client_id)
			}
			if (parsed.client_secret && !state.value.config.clientSecret) {
				state.value.config.clientSecret = String(parsed.client_secret)
			}
			if (parsed.scopes && !state.value.config.scopes) {
				state.value.config.scopes = String(parsed.scopes)
			}
			if (typeof parsed.pkce === 'boolean') {
				state.value.pkce = parsed.pkce
			}
			if (typeof parsed.basic_auth === 'boolean') {
				state.value.basicAuth = parsed.basic_auth
			}

			addLog('info', 'Manual Config', {
				endpoints: Object.keys(normalized).length,
				applied: true,
				normalized: Object.keys(normalized).filter(k => k !== Object.keys(parsed).find(pk => pk === k)),
			})
			return null
		} catch (e: any) {
			return e.message
		}
	}

	return {
		state,
		endpoints,
		addLog,
		clearLogs,
		resetFlow,
		applyManualJson,
	}
}
