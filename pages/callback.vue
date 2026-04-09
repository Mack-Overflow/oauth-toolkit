<script setup lang="ts">
const route = useRoute()
const { state, addLog } = useOAuthStore()

const code = computed(() => {
	const c = route.query.code
	return typeof c === 'string' ? c : ''
})

const error = computed(() => {
	const e = route.query.error
	return typeof e === 'string' ? e : ''
})

const errorDescription = computed(() => {
	const d = route.query.error_description
	return typeof d === 'string' ? d : ''
})

const returnState = computed(() => {
	const s = route.query.state
	return typeof s === 'string' ? s : ''
})

const allParams = computed(() => {
	const params: Record<string, string> = {}
	for (const [k, v] of Object.entries(route.query)) {
		if (typeof v === 'string') params[k] = v
	}
	return params
})

const autoApplied = ref(false)

onMounted(() => {
	addLog('info', 'OAuth Callback', allParams.value)

	if (code.value && !autoApplied.value) {
		state.value.authorizationCode = code.value
		autoApplied.value = true
		addLog('response', 'Auth Code Received', { code: code.value, state: returnState.value })
	}

	if (error.value) {
		addLog('error', 'Auth Callback Error', { error: error.value, description: errorDescription.value })
	}
})

function goBack() {
	navigateTo('/')
}
</script>

<template>
  <div class="min-h-screen">
    <div class="pointer-events-none fixed inset-0 bg-gradient-to-b from-cyan-500/[0.02] via-transparent to-indigo-500/[0.02]" />

    <div class="relative mx-auto max-w-xl px-4 py-16">
      <!-- Success -->
      <div v-if="code" class="card text-center">
        <div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>
        <h1 class="mb-1 text-lg font-bold text-smoke-100">Authorization Successful</h1>
        <p class="mb-6 text-sm text-smoke-400">The authorization code has been captured and applied automatically.</p>

        <div class="mb-6 rounded-lg border border-smoke-800/80 bg-smoke-925 p-4 text-left">
          <div class="mb-3">
            <span class="section-label">Authorization Code</span>
            <div class="mt-1 break-all font-mono text-xs text-cyan-400">{{ code }}</div>
          </div>
          <div v-if="returnState">
            <span class="section-label">State</span>
            <div class="mt-1 break-all font-mono text-xs text-smoke-400">{{ returnState }}</div>
          </div>
        </div>

        <button class="btn-primary" @click="goBack">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m12 19-7-7 7-7" /><path d="M19 12H5" />
          </svg>
          Continue to Token Exchange
        </button>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="card text-center">
        <div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10" /><path d="m15 9-6 6" /><path d="m9 9 6 6" />
          </svg>
        </div>
        <h1 class="mb-1 text-lg font-bold text-smoke-100">Authorization Failed</h1>
        <p class="mb-2 text-sm text-red-400">{{ error }}</p>
        <p v-if="errorDescription" class="mb-6 text-sm text-smoke-400">{{ errorDescription }}</p>

        <div v-if="Object.keys(allParams).length > 2" class="mb-6 rounded-lg border border-smoke-800/80 bg-smoke-925 p-4 text-left">
          <span class="section-label">All Parameters</span>
          <pre class="pre-block mt-2">{{ JSON.stringify(allParams, null, 2) }}</pre>
        </div>

        <button class="btn-ghost" @click="goBack">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m12 19-7-7 7-7" /><path d="M19 12H5" />
          </svg>
          Back to Toolkit
        </button>
      </div>

      <!-- No params -->
      <div v-else class="card text-center">
        <div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-smoke-800">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-smoke-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" />
          </svg>
        </div>
        <h1 class="mb-1 text-lg font-bold text-smoke-100">OAuth Callback</h1>
        <p class="mb-6 text-sm text-smoke-400">No authorization code or error received. This page is the redirect target for OAuth flows.</p>

        <button class="btn-ghost" @click="goBack">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m12 19-7-7 7-7" /><path d="M19 12H5" />
          </svg>
          Back to Toolkit
        </button>
      </div>
    </div>
  </div>
</template>
