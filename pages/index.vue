<script setup lang="ts">
const { resetFlow } = useOAuthStore()
</script>

<template>
  <div class="min-h-screen">
    <!-- Subtle gradient overlay -->
    <div class="pointer-events-none fixed inset-0 bg-gradient-to-b from-cyan-500/[0.02] via-transparent to-indigo-500/[0.02]" />

    <div class="relative mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <header class="mb-8 flex items-center gap-4">
        <div class="flex items-center gap-3">
          <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <div>
            <h1 class="text-xl font-bold text-smoke-100">0Tool</h1>
            <p class="text-xs text-smoke-500">OAuth 2.0 / OIDC Inspector</p>
          </div>
        </div>
        <div class="flex-1" />
        <span class="hidden font-mono text-[0.65rem] text-smoke-600 sm:inline">v0.1.0</span>
        <button class="btn-ghost" @click="resetFlow">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" />
          </svg>
          Reset
        </button>
      </header>

      <div class="grid grid-cols-1 items-start gap-5 lg:grid-cols-12">
        <div class="flex flex-col gap-5 lg:col-span-7">
          <ConfigPanel />
          <AuthFlow />
          <TokenValidator />
          <UserRetrieval />
          <!-- Ad: below user info -->
          <AdUnit ad-slot="YOUR_AD_SLOT_1" ad-format="auto" />
        </div>
        <div class="flex flex-col gap-5 lg:col-span-5">
          <div class="lg:sticky lg:top-4">
            <ResultLog />
          </div>
          <!-- Ad: right sidebar -->
          <AdUnit ad-slot="YOUR_AD_SLOT_2" ad-format="auto" />
        </div>
      </div>
    </div>
  </div>
</template>
