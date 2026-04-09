<script setup lang="ts">
const { state, endpoints, defaultCallbackUrl, addLog, applyManualJson } = useOAuthStore()

const showSecret = ref(false)
const jsonError = ref<string | null>(null)

function onApplyJson() {
	jsonError.value = applyManualJson(state.value.manualEndpointsRaw)
}

function onSwitchMode(mode: 'auto' | 'manual') {
	state.value.discoveryMode = mode
	addLog('info', 'Discovery Mode', { mode })
}
</script>

<template>
  <div class="card">
    <div class="mb-4 flex items-center gap-2">
      <div class="flex h-6 w-6 items-center justify-center rounded-md bg-indigo-500/10 text-indigo-400">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" />
        </svg>
      </div>
      <h2 class="text-sm font-semibold text-smoke-100">Configuration</h2>
    </div>

    <!-- Discovery mode toggle -->
    <div class="mb-4">
      <label class="section-label">Endpoint Source</label>
      <div class="flex gap-1 rounded-lg bg-smoke-850 p-1">
        <button
          class="flex-1 rounded-md px-3 py-1.5 text-xs font-semibold transition-all"
          :class="state.discoveryMode === 'auto'
            ? 'bg-smoke-700/80 text-smoke-100 shadow-sm'
            : 'text-smoke-500 hover:text-smoke-300'"
          @click="onSwitchMode('auto')"
        >
          <span class="flex items-center justify-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10" /><path d="m16 12-4-4-4 4" /><path d="M12 16V8" /></svg>
            Auto-discover
          </span>
        </button>
        <button
          class="flex-1 rounded-md px-3 py-1.5 text-xs font-semibold transition-all"
          :class="state.discoveryMode === 'manual'
            ? 'bg-smoke-700/80 text-smoke-100 shadow-sm'
            : 'text-smoke-500 hover:text-smoke-300'"
          @click="onSwitchMode('manual')"
        >
          <span class="flex items-center justify-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /></svg>
            Manual JSON
          </span>
        </button>
      </div>
    </div>

    <div class="space-y-3">
      <!-- Auto-discover: URL input -->
      <div v-if="state.discoveryMode === 'auto'">
        <label for="discovery-url" class="section-label">Discovery URL / Issuer <span class="ml-2 text-smoke-100">(Your OIDC Service)</span></label>
        <input
          id="discovery-url"
          v-model="state.config.discoveryUrl"
          type="url"
          placeholder="https://accounts.google.com"
          class="input-field"
        />
      </div>

      <!-- Manual: JSON editor -->
      <div v-else>
        <label class="section-label">Endpoint Configuration</label>
        <div class="relative">
          <textarea
            v-model="state.manualEndpointsRaw"
            rows="10"
            spellcheck="false"
            class="input-field resize-y !font-mono !text-xs !leading-relaxed"
            placeholder='{ "authorization_endpoint": "...", "token_endpoint": "...", "userinfo_endpoint": "..." }'
          />
        </div>
        <div class="mt-2 flex items-center gap-2">
          <button class="btn-primary !py-1.5 !text-xs" @click="onApplyJson">
            Apply Config
          </button>
          <span v-if="jsonError" class="text-[0.7rem] text-red-400">{{ jsonError }}</span>
          <span v-else-if="endpoints && state.discoveryMode === 'manual'" class="flex items-center gap-1.5 text-[0.7rem] text-emerald-400">
            <span class="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse-slow" />
            Config applied
          </span>
        </div>
        <p class="mt-2 text-[0.65rem] leading-relaxed text-smoke-600">
          Paste your OIDC discovery JSON or provide the endpoints manually.
          Required: <code class="text-smoke-400">authorization_endpoint</code>, <code class="text-smoke-400">token_endpoint</code>.
          Optional: <code class="text-smoke-400">userinfo_endpoint</code>, <code class="text-smoke-400">issuer</code>, etc.
        </p>
      </div>

      <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label for="client-id" class="section-label">Client ID</label>
          <input
            id="client-id"
            v-model="state.config.clientId"
            type="text"
            placeholder="your-client-id"
            class="input-field"
          />
        </div>
        <div>
          <label for="client-secret" class="section-label">Client Secret</label>
          <div class="relative">
            <input
              id="client-secret"
              v-model="state.config.clientSecret"
              :type="showSecret ? 'text' : 'password'"
              placeholder="your-client-secret"
              class="input-field pr-9"
            />
            <button
              class="absolute right-2 top-1/2 -translate-y-1/2 text-smoke-500 transition-colors hover:text-smoke-300"
              @click="showSecret = !showSecret"
            >
              <svg v-if="!showSecret" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" /><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" /><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" /><line x1="2" x2="22" y1="2" y2="22" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label for="redirect-uri" class="section-label">Redirect URI</label>
          <input
            id="redirect-uri"
            v-model="state.config.redirectUri"
            type="url"
            class="input-field"
          />
          <p class="mt-1 text-[0.65rem] leading-relaxed text-smoke-600">
            The default <code class="text-smoke-400">{{ defaultCallbackUrl }}</code> is how this tool captures the authorization code and continues the flow automatically.
          </p>
        </div>
        <div>
          <label for="scopes" class="section-label">Scopes</label>
          <input
            id="scopes"
            v-model="state.config.scopes"
            type="text"
            placeholder="openid profile email"
            class="input-field"
          />
        </div>
      </div>
    </div>
  </div>
</template>
