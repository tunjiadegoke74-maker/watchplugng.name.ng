export interface Product {
  id: number
  name: string
  category: string
  image: string
  imagePosition?: string
  description: string
  shortDescription: string
  price: number
}

const image = (file: string, width = 900) =>
  `/.netlify/images?url=/img/${file}&w=${width}&fm=webp&q=86`

const products: Array<Product> = [
  {
    id: 1,
    name: 'Heritage Leather Watch',
    category: 'Wrist watch',
    image: image('timepiece.png'),
    description: 'A quietly confident everyday watch, finished with a warm leather strap and a clean, versatile dial. It moves comfortably from workdays to weekends.',
    shortDescription: 'Classic proportions, warm leather, made for every day.',
    price: 20000,
  },
  {
    id: 2,
    name: 'Foundry Cufflinks',
    category: 'Cufflinks',
    image: image('details.png'),
    imagePosition: 'center 32%',
    description: 'Brushed-metal cufflinks with a subtle glow—an understated finishing touch for traditional, formal and celebratory dressing.',
    shortDescription: 'Brushed metal for sharp, considered dressing.',
    price: 10000,
  },
  {
    id: 3,
    name: 'Terrace Jersey Scarf',
    category: 'Jersey scarf',
    image: image('scarf.png'),
    description: 'A soft, richly woven scarf with an easy drape and tactile fringe. Wear it loose, wrapped or layered over your favourite jersey.',
    shortDescription: 'Soft woven colour for match days and beyond.',
    price: 120000,
  },
  {
    id: 4,
    name: 'Court Low Sneakers',
    category: 'Sneakers',
    image: image('footwear.png'),
    imagePosition: 'left center',
    description: 'Clean low-top sneakers with a grounded gum sole and an easy neutral finish. Built to pair with denim, chinos and relaxed tailoring.',
    shortDescription: 'Clean lines and all-day, go-anywhere ease.',
    price: 10000,
  },
  {
    id: 5,
    name: 'Burnished Brogues',
    category: 'Brogues',
    image: image('footwear.png'),
    imagePosition: 'right center',
    description: 'Polished leather brogues with timeless perforated detailing. A dependable choice for the office, ceremonies and dressed-up evenings.',
    shortDescription: 'Polished leather with timeless detailing.',
    price: 10000,
  },
  {
    id: 6,
    name: 'Halo Chain',
    category: 'Jewellery',
    image: image('details.png'),
    imagePosition: 'center 65%',
    description: 'A restrained, warm-toned chain designed to sit beautifully on its own or layer with pieces you already wear.',
    shortDescription: 'A warm, refined accent for everyday layering.',
    price: 10000,
  },
  {
    id: 7,
    name: 'Arc Bracelet',
    category: 'Jewellery',
    image: image('details.png'),
    imagePosition: 'center 80%',
    description: 'A minimal bracelet with a softly polished finish. Lightweight, versatile and easy to combine with a favourite watch.',
    shortDescription: 'Minimal form, softly polished finish.',
    price: 10000,
  },
]

export const formatNaira = (amount: number) =>
  new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(amount)

export default products
