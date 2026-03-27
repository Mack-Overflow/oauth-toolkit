<script setup lang="ts">
const { state, endpoints, addLog } = useOAuthStore()
const loading = ref(false)

async function fetchUserInfo() {
	if (!state.value.tokenResponse || !endpoints.value) return
	loading.value = true
	try {
		const ep = endpoints.value as any
		const tokens = state.value.tokenResponse as any
		const payload = {
			userinfoEndpoint: ep.userinfo_endpoint,
			accessToken: tokens.access_token,
		}
		addLog('request', 'UserInfo', payload)
		const result = await $fetch('/api/oauth/userinfo', {
			method: 'POST',
			body: payload,
		})
		state.value.userInfo = result
		addLog('response', 'UserInfo', result)
	} catch (err: any) {
		addLog('error', 'UserInfo', err.data || err.message)
	} finally {
		loading.value = false
	}
}
</script>

<template>
  <div class="card">
    <div class="mb-4 flex items-center gap-2">
      <div class="flex h-6 w-6 items-center justify-center rounded-md bg-violet-500/10 text-violet-400">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
        </svg>
      </div>
      <h2 class="text-sm font-semibold text-smoke-100">User Info</h2>
    </div>

    <button
      :disabled="!state.tokenResponse || !endpoints || loading"
      class="btn-primary"
      @click="fetchUserInfo"
    >
      <svg v-if="loading" class="h-3.5 w-3.5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" /><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
      Fetch UserInfo
    </button>

    <div v-if="state.userInfo" class="mt-4">
      <pre class="pre-block">{{ JSON.stringify(state.userInfo, null, 2) }}</pre>
    </div>
  </div>
</template>
