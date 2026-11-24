#!/usr/bin/env node
import { execFile } from 'node:child_process'
import { mkdir } from 'node:fs/promises'
import os from 'node:os'
import { promisify } from 'node:util'
import path from 'node:path'
import sharp from 'sharp'

const run = promisify(execFile)

async function decodable(file) {
  if (!/\.hei[cf]$/i.test(file)) return file
  const tmp = path.join(os.tmpdir(), `${path.parse(file).name}-${process.pid}.jpg`)
  await run('sips', ['-s', 'format', 'jpeg', '-s', 'formatOptions', '100', file, '--out', tmp])
  return tmp
}

const files = process.argv.slice(2)
if (!files.length) {
  console.error('Usage: npm run resize -- <image> [image...]')
  process.exit(1)
}

for (const file of files) {
  const outDir = path.join(path.dirname(file), 'resized')
  const out = path.join(outDir, `${path.parse(file).name}.jpg`)
  await mkdir(outDir, { recursive: true })
  await sharp(await decodable(file)).rotate().resize({ width: 1000 }).jpeg({ quality: 75, mozjpeg: true }).toFile(out)
  console.log(`${file} -> ${out}`)
}
