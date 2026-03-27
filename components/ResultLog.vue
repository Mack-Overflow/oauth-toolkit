<script setup lang="ts">
const { state, clearLogs } = useOAuthStore()

const logStyles: Record<string, { border: string; bg: string; dot: string; label: string }> = {
	request: {
		border: 'border-l-cyan-500/60',
		bg: 'bg-cyan-500/[0.04]',
		dot: 'bg-cyan-400',
		label: 'text-cyan-400',
	},
	response: {
		border: 'border-l-emerald-500/60',
		bg: 'bg-emerald-500/[0.04]',
		dot: 'bg-emerald-400',
		label: 'text-emerald-400',
	},
	error: {
		border: 'border-l-red-500/60',
		bg: 'bg-red-500/[0.04]',
		dot: 'bg-red-400',
		label: 'text-red-400',
	},
	info: {
		border: 'border-l-amber-500/60',
		bg: 'bg-amber-500/[0.04]',
		dot: 'bg-amber-400',
		label: 'text-amber-400',
	},
}
</script>

<template>
  <div class="card max-h-[calc(100vh-6rem)] overflow-hidden">
    <div class="mb-4 flex items-center gap-2">
      <div class="flex h-6 w-6 items-center justify-center rounded-md bg-smoke-700/50 text-smoke-400">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 12H3" /><path d="M16 6H3" /><path d="M12 18H3" /><path d="m16 12 5 3-5 3v-6Z" />
        </svg>
      </div>
      <h2 class="text-sm font-semibold text-smoke-100">Activity Log</h2>
      <span class="ml-auto font-mono text-[0.6rem] text-smoke-600">{{ state.logs.length }} entries</span>
      <button
        v-if="state.logs.length"
        class="btn-danger"
        @click="clearLogs"
      >
        Clear
      </button>
    </div>

    <div class="overflow-y-auto" style="max-height: calc(100vh - 12rem)">
      <div v-if="!state.logs.length" class="flex flex-col items-center gap-2 py-12 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-smoke-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 12H3" /><path d="M16 6H3" /><path d="M12 18H3" /><path d="m16 12 5 3-5 3v-6Z" />
        </svg>
        <p class="text-xs text-smoke-600">Waiting for requests...</p>
      </div>

      <div class="space-y-2">
        <div
          v-for="(log, i) in state.logs"
          :key="i"
          class="rounded-lg border-l-2 px-3 py-2.5 transition-colors"
          :class="[logStyles[log.type].border, logStyles[log.type].bg]"
        >
          <div class="mb-1.5 flex items-center gap-2 text-[0.65rem]">
            <span class="flex items-center gap-1.5 font-bold uppercase tracking-wider" :class="logStyles[log.type].label">
              <span class="h-1.5 w-1.5 rounded-full" :class="logStyles[log.type].dot" />
              {{ log.type }}
            </span>
            <span class="font-semibold text-smoke-300">{{ log.label }}</span>
            <span class="ml-auto font-mono text-smoke-600">{{ new Date(log.timestamp).toLocaleTimeString() }}</span>
          </div>
          <pre class="overflow-x-auto rounded-md border border-smoke-800/50 bg-smoke-925/80 p-2.5 font-mono text-[0.65rem] leading-relaxed text-smoke-400">{{ JSON.stringify(log.data, null, 2) }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>
