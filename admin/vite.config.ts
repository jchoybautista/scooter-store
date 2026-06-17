import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'
import { resolve, extname, basename } from 'path'
import fs from 'fs'
import type { IncomingMessage, ServerResponse } from 'http'

// Derive the admin directory from the config file's own URL (works in ESM / Vite 5+)
const adminDir = fileURLToPath(new URL('.', import.meta.url))
const rootPublic = resolve(adminDir, '../public')

/** Vite plugin that exposes POST /upload → writes files to uploadDir */
function fileUploadPlugin(uploadDir: string): Plugin {
  return {
    name: 'file-upload',
    configureServer(server) {
      server.middlewares.use('/upload', (req: IncomingMessage, res: ServerResponse) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.end()
          return
        }
        let body = ''
        req.on('data', (chunk: Buffer | string) => { body += chunk.toString() })
        req.on('end', () => {
          try {
            const { name, data } = JSON.parse(body) as { name: string; data: string }
            const ext = extname(name).toLowerCase()
            const base = basename(name, extname(name))
              .replace(/[^a-z0-9]+/gi, '-')
              .toLowerCase()
              .slice(0, 40)
            const unique = `${base}-${Date.now()}${ext}`
            fs.mkdirSync(uploadDir, { recursive: true })
            fs.writeFileSync(resolve(uploadDir, unique), Buffer.from(data, 'base64'))
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ path: `/images/products/${unique}` }))
          } catch (err) {
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: String(err) }))
          }
        })
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), fileUploadPlugin(resolve(rootPublic, 'images/products'))],
  base: '/',
  // Serve the storefront's public folder so /images/products/* resolves in dev
  publicDir: rootPublic,
  server: {
    port: 5174,
    fs: {
      // Allow Vite to serve files from the parent directory (storefront's public/)
      allow: [adminDir, rootPublic],
    },
    proxy: {
      // Fallback: if admin runs standalone, proxy image requests to the storefront
      '/images': { target: 'http://localhost:5173', changeOrigin: true },
      '/favicon.svg': { target: 'http://localhost:5173', changeOrigin: true },
    },
    hmr: {
      host: 'localhost',
      port: 5174,
    },
  },
})
