// @ts-check
import { defineConfig } from 'astro/config'
import cloudflare from '@astrojs/cloudflare'

// https://docs.astro.build/en/guides/integrations-guide/cloudflare/
export default defineConfig({
  output: 'server',
  adapter: cloudflare(),
})
