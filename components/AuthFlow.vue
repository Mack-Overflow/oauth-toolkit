<script setup lang="ts">
const { state, endpoints, addLog } = useOAuthStore()
const loading = ref(false)
const isAutoMode = computed(() => state.value.discoveryMode === 'auto')
const hasEndpoints = computed(() => !!endpoints.value)

const activeStep = ref<string | null>(
  state.value.tokenResponse ? null
    : state.value.authorizationCode ? 'token'
    : hasEndpoints.value ? 'authorize'
    : 'discover'
)

async function discover() {
	activeStep.value = 'discover'
	loading.value = true
	try {
		addLog('request', 'Discovery', { url: state.value.config.discoveryUrl })
		const result = await $fetch('/api/oauth/discover', {
			method: 'POST',
			body: { discoveryUrl: state.value.config.discoveryUrl },
		})
		state.value.discoveryResult = result
		addLog('response', 'Discovery', result)
	} catch (err: any) {
		addLog('error', 'Discovery', err.data || err.message)
	} finally {
		loading.value = false
		activeStep.value = null
	}
}

async function authorize() {
	if (!endpoints.value) return
	activeStep.value = 'authorize'
	loading.value = true
	try {
		const ep = endpoints.value as any
		const payload = {
			authorizationEndpoint: ep.authorization_endpoint,
			clientId: state.value.config.clientId,
			redirectUri: state.value.config.redirectUri,
			scopes: state.value.config.scopes,
			pkce: state.value.pkce,
			nonce: true,
		}
		addLog('request', 'Authorize', payload)
		const result = await $fetch('/api/oauth/authorize', {
			method: 'POST',
			body: payload,
		})
		const res = result as any
		if (res.codeVerifier) {
			state.value.codeVerifier = res.codeVerifier
		}
		addLog('response', 'Authorize', {
			authorizationUrl: res.authorizationUrl,
			state: res.state,
			nonce: res.nonce,
			pkce: !!res.codeVerifier,
		})
		window.location.href = res.authorizationUrl
	} catch (err: any) {
		addLog('error', 'Authorize', err.data || err.message)
	} finally {
		loading.value = false
		activeStep.value = null
	}
}

async function exchangeToken() {
	if (!state.value.authorizationCode || !endpoints.value) return
	activeStep.value = 'token'
	loading.value = true
	try {
		const ep = endpoints.value as any
		const payload: Record<string, unknown> = {
			tokenEndpoint: ep.token_endpoint,
			clientId: state.value.config.clientId,
			clientSecret: state.value.config.clientSecret,
			code: state.value.authorizationCode,
			redirectUri: state.value.config.redirectUri,
		}
		if (state.value.codeVerifier) {
			payload.codeVerifier = state.value.codeVerifier
		}
		if (state.value.basicAuth) {
			payload.basicAuth = true
		}
		addLog('request', 'Token Exchange', payload)
		const result = await $fetch('/api/oauth/token', {
			method: 'POST',
			body: payload,
		})
		state.value.tokenResponse = result
		addLog('response', 'Token Exchange', result)
	} catch (err: any) {
		addLog('error', 'Token Exchange', err.data || err.message)
	} finally {
		loading.value = false
		activeStep.value = null
	}
}
</script>

<template>
  <div class="card">
    <div class="mb-5 flex items-center gap-2">
      <div class="flex h-6 w-6 items-center justify-center rounded-md bg-cyan-500/10 text-cyan-400">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="m5 12 7-7 7 7" /><path d="M12 19V5" />
        </svg>
      </div>
      <h2 class="text-sm font-semibold text-smoke-100">Authorization Flow</h2>
      <span
        class="badge ml-auto"
        :class="isAutoMode ? 'bg-cyan-500/10 text-cyan-400' : 'bg-violet-500/10 text-violet-400'"
      >
        {{ isAutoMode ? 'auto-discover' : 'manual' }}
      </span>
    </div>

    <!-- Step 1: Discovery (auto) or Ready check (manual) -->
    <div class="relative mb-1 flex gap-4">
      <div class="flex flex-col items-center">
        <div
          class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-bold transition-colors"
          :class="hasEndpoints
            ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400'
            : 'border-smoke-700 bg-smoke-800 text-smoke-400'"
        >
          <svg v-if="hasEndpoints" xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
          <span v-else>1</span>
        </div>
        <div class="mt-1 w-px flex-1 bg-gradient-to-b from-smoke-700/80 to-smoke-800/30" />
      </div>
      <div class="flex-1 pb-6">
        <template v-if="isAutoMode">
          <div class="mb-2 text-xs font-semibold text-smoke-300">Discover Endpoints</div>
          <button
            :disabled="!state.config.discoveryUrl || loading"
            class="btn-primary"
            @click="discover"
          >
            <svg v-if="activeStep === 'discover' && loading" class="h-3.5 w-3.5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" /><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
            Fetch OIDC Config
          </button>
          <div v-if="state.discoveryResult" class="mt-2 flex items-center gap-1.5 text-[0.7rem] font-medium text-emerald-400">
            <span class="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse-slow" />
            {{ Object.keys(state.discoveryResult).length }} endpoints discovered
          </div>
        </template>
        <template v-else>
          <div class="mb-2 text-xs font-semibold text-smoke-300">Endpoints Ready</div>
          <div v-if="hasEndpoints" class="flex items-center gap-1.5 text-[0.7rem] font-medium text-emerald-400">
            <span class="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse-slow" />
            Manual config applied — ready to authorize
          </div>
          <div v-else class="text-[0.7rem] text-smoke-500">
            Apply your JSON config above to continue
          </div>
        </template>
      </div>
    </div>

    <!-- Step 2 -->
    <div class="relative mb-1 flex gap-4">
      <div class="flex flex-col items-center">
        <div
          class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-bold transition-colors"
          :class="state.authorizationCode
            ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400'
            : 'border-smoke-700 bg-smoke-800 text-smoke-400'"
        >
          <svg v-if="state.authorizationCode" xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
          <span v-else>2</span>
        </div>
        <div class="mt-1 w-px flex-1 bg-gradient-to-b from-smoke-700/80 to-smoke-800/30" />
      </div>
      <div class="flex-1 pb-6">
        <div class="mb-2 text-xs font-semibold text-smoke-300">Authorize</div>
        <button
          :disabled="!hasEndpoints || !state.config.clientId || loading"
          class="btn-primary"
          @click="authorize"
        >
          <svg v-if="activeStep === 'authorize' && loading" class="h-3.5 w-3.5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" /><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
          Open Auth URL
        </button>
      </div>
    </div>

    <!-- Step 3 -->
    <div class="relative flex gap-4">
      <div class="flex flex-col items-center">
        <div
          class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-bold transition-colors"
          :class="state.tokenResponse
            ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400'
            : 'border-smoke-700 bg-smoke-800 text-smoke-400'"
        >
          <svg v-if="state.tokenResponse" xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
          <span v-else>3</span>
        </div>
      </div>
      <div class="flex-1">
        <div class="mb-2 text-xs font-semibold text-smoke-300">Exchange Code for Token</div>
        <div class="mb-3">
          <label for="auth-code" class="section-label">Authorization Code</label>
          <input
            id="auth-code"
            v-model="state.authorizationCode"
            type="text"
            placeholder="Paste authorization code here..."
            class="input-field"
          />
        </div>
        <button
          :disabled="!state.authorizationCode || !hasEndpoints || loading"
          class="btn-primary"
          @click="exchangeToken"
        >
          <svg v-if="activeStep === 'token' && loading" class="h-3.5 w-3.5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" /><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
          Exchange Token
        </button>
        <div v-if="state.tokenResponse" class="mt-2 flex items-center gap-1.5 text-[0.7rem] font-medium text-emerald-400">
          <span class="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse-slow" />
          Token acquired
        </div>
      </div>
    </div>
  </div>
</template>
