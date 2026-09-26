import { GoogleGenAI } from '@google/genai'
import { mkdir, writeFile } from 'node:fs/promises'

const ai = new GoogleGenAI({
  apiKey: process.env.NETLIFY_AI_GATEWAY_KEY,
  httpOptions: { baseUrl: process.env.NETLIFY_AI_GATEWAY_BASE_URL?.replace(/\/$/, '') },
})

const shared = 'Luxury editorial product photography for a contemporary Lagos menswear and accessories boutique, warm artisanal styling, deep espresso and burnt terracotta palette, textured linen and hand-finished wood, soft directional window light, subtle film grain, no text, no logos, no people, vertical 4:5 composition.'
const shots = [
  ['timepiece', 'A handsome classic wrist watch with a rich brown leather strap, three-quarter view, centered hero object.'],
  ['details', 'An artful arrangement of brushed gold cufflinks and a refined minimal gold bracelet and necklace, separated clearly on folded cocoa linen.'],
  ['scarf', 'A richly woven football-inspired jersey scarf in tasteful cream, forest green and muted rust, folded with tactile fringe visible.'],
  ['footwear', 'A paired fashion still life: one cream and gum premium low-top sneaker alongside one polished dark brown leather brogue, both fully visible.'],
]

await mkdir('public/img', { recursive: true })
for (const [name, subject] of shots) {
  const response = await ai.models.generateContent({
    model: 'gemini-3.1-flash-image',
    contents: `${shared} ${subject}`,
    config: { imageConfig: { aspectRatio: '4:5', imageSize: '1K' } },
  })
  const part = response.candidates?.[0]?.content?.parts?.find((entry) => entry.inlineData)
  if (!part?.inlineData?.data) throw new Error(`No image returned for ${name}`)
  const extension = part.inlineData.mimeType === 'image/jpeg' ? 'jpg' : 'png'
  await writeFile(`public/img/${name}.${extension}`, Buffer.from(part.inlineData.data, 'base64'))
  console.log(`Generated ${name}.${extension}`)
}
