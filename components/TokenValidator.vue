<script setup lang="ts">
const { state, addLog } = useOAuthStore()
const loading = ref(false)

const tokenToValidate = computed(() => {
	if (!state.value.tokenResponse) return ''
	const resp = state.value.tokenResponse as any
	return resp.id_token || resp.access_token || ''
})

async function validate() {
	if (!tokenToValidate.value) return
	loading.value = true
	try {
		addLog('request', 'Validate Token', { token: tokenToValidate.value.slice(0, 20) + '...' })
		const result = await $fetch('/api/oauth/validate', {
			method: 'POST',
			body: { token: tokenToValidate.value },
		})
		state.value.validationResult = result
		addLog('response', 'Validate Token', result)
	} catch (err: any) {
		addLog('error', 'Validate Token', err.data || err.message)
	} finally {
		loading.value = false
	}
}
</script>

<template>
  <div class="card">
    <div class="mb-4 flex items-center gap-2">
      <div class="flex h-6 w-6 items-center justify-center rounded-md bg-amber-500/10 text-amber-400">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
        </svg>
      </div>
      <h2 class="text-sm font-semibold text-smoke-100">Token Inspector</h2>
    </div>

    <button
      :disabled="!tokenToValidate || loading"
      class="btn-primary"
      @click="validate"
    >
      <svg v-if="loading" class="h-3.5 w-3.5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" /><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
      Decode &amp; Inspect
    </button>

    <div v-if="state.validationResult" class="mt-4 space-y-3">
      <div class="flex items-center gap-2">
        <span
          class="badge"
          :class="(state.validationResult as any).isExpired
            ? 'bg-red-500/15 text-red-400'
            : 'bg-emerald-500/15 text-emerald-400'"
        >
          <span
            class="h-1.5 w-1.5 rounded-full"
            :class="(state.validationResult as any).isExpired ? 'bg-red-400' : 'bg-emerald-400 animate-pulse-slow'"
          />
          {{ (state.validationResult as any).isExpired ? 'Expired' : 'Valid' }}
        </span>
        <span v-if="(state.validationResult as any).expiresAt" class="font-mono text-[0.65rem] text-smoke-500">
          exp: {{ (state.validationResult as any).expiresAt }}
        </span>
      </div>
      <pre class="pre-block">{{ JSON.stringify(state.validationResult, null, 2) }}</pre>
    </div>
  </div>
</template>
