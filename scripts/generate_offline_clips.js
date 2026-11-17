import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const videosDir = path.resolve(__dirname, '../public/videos')

if (!fs.existsSync(videosDir)) {
  fs.mkdirSync(videosDir, { recursive: true })
}

const clips = [
  {
    name: 'daily_commute.webm',
    filter: 'color=c=0x0D161A:s=640x360:d=4',
    freq: 440,
  },
  {
    name: 'daily_cafe.webm',
    filter: 'color=c=0x142026:s=640x360:d=4',
    freq: 523.25,
  },
  {
    name: 'daily_supermarket.webm',
    filter: 'color=c=0x1A2830:s=640x360:d=4',
    freq: 659.25,
  },
  {
    name: 'daily_perspective.webm',
    filter: 'color=c=0x0F1A1F:s=640x360:d=4',
    freq: 587.33,
  },
]

console.log('Generating offline micro WebM videos...')

for (const clip of clips) {
  const outputPath = path.join(videosDir, clip.name)
  console.log(`Generating ${clip.name}...`)

  const cmd = `ffmpeg -y -f lavfi -i "${clip.filter}" -f lavfi -i "sine=frequency=${clip.freq}:duration=0.6" -filter_complex "[1:a]apad=pad_dur=3.4[aout]" -map 0:v -map "[aout]" -c:v libvpx -b:v 80k -c:a libvorbis -shortest "${outputPath}"`

  try {
    execSync(cmd, { stdio: 'pipe' })
    const stats = fs.statSync(outputPath)
    console.log(`Successfully generated ${clip.name} (${Math.round(stats.size / 1024)} KB)`)
  } catch (err) {
    console.error(`Error generating ${clip.name}:`, err.message)
  }
}

console.log('All offline micro WebM clips generated successfully.')
