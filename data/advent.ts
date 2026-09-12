// The advent calendar lineup: a Dynamic Coffee Roasters box, one Pittsburgh
// roaster's coffee per day, with the reading for each day hosted here.
//
// PLACEHOLDER DATA. Roaster/coffee pairings are illustrative and unconfirmed —
// replace each entry as the real lineup lands. `roasterSlug` must match a row in
// the `roaster` table so the day page can link through to the map.
//
// Only `day`, `roasterSlug`, `roasterName`, `coffee` and `notes` are required;
// everything else renders when present, so entries can be filled in over time.

export const ADVENT_YEAR = 2026
export const ADVENT_DAYS = 24

export interface BrewMethod {
  label: string
  rows: { label: string; value: string }[]
  note?: string
}

export interface AdventDay {
  day: number
  roasterSlug: string
  roasterName: string
  coffee: string
  notes: string[]
  producer?: string
  origin?: string
  varietal?: string
  process?: string
  altitude?: string
  blurb?: string
  // YouTube id for the roaster's brew video. Absent until the video is recorded.
  videoId?: string
  brew?: BrewMethod[]
}

const DYNAMIC_BREW: BrewMethod[] = [
  {
    label: 'Filter',
    rows: [
      { label: 'Dose', value: '22 g' },
      { label: 'Water', value: '360 g' },
      { label: 'Grind', value: 'Medium-fine' },
      { label: 'Time', value: '2:45' },
    ],
    note: 'Bloom with 60 g for 40 seconds, then pour in two even stages. Water at 96°C.',
  },
  {
    label: 'Espresso',
    rows: [
      { label: 'Dose', value: '18 g' },
      { label: 'Yield', value: '40 g' },
      { label: 'Grind', value: 'Fine' },
      { label: 'Time', value: '28 s' },
    ],
    note: 'Pulls sweet and forgiving at 93°C. Go longer for filter-style clarity in a cup.',
  },
  {
    label: 'Cold brew',
    rows: [
      { label: 'Dose', value: '80 g' },
      { label: 'Water', value: '1000 g' },
      { label: 'Grind', value: 'Coarse' },
      { label: 'Time', value: '16 hrs' },
    ],
    note: 'Steep at room temperature, then chill. Dilute 2:1 with water or milk over ice.',
  },
]

export const ADVENT_LINEUP: AdventDay[] = [
  {
    day: 1,
    roasterSlug: 'dynamic-coffee-roasters',
    roasterName: 'Dynamic Coffee Roasters',
    coffee: 'Don Fabio Caballero · Catuaí',
    notes: ['Red apple', 'Brown sugar', 'Cocoa'],
    producer: 'Don Fabio Caballero',
    origin: 'Marcala, Honduras',
    varietal: 'Catuaí',
    process: 'Washed',
    altitude: '1,500 masl',
    blurb:
      'Don Fabio Caballero farms at altitude above Marcala, in La Paz. Dynamic has bought from him directly for several seasons, which is why this lot opens the calendar rather than sitting somewhere in the middle of it. Fully washed and dried on raised beds, it lands sweet and unfussy — the kind of coffee that behaves whether you weigh anything or not.',
    brew: DYNAMIC_BREW,
  },
  { day: 2, roasterSlug: 'commonplace', roasterName: 'Commonplace Coffee', coffee: 'Kirinyaga AA', notes: ['Blackcurrant', 'Grapefruit', 'Cane sugar'] },
  { day: 3, roasterSlug: 'redhawk-coffee-roasters', roasterName: 'Redhawk Coffee Roasters', coffee: 'Finca El Paraíso', notes: ['Lychee', 'Rose', 'Red grape'] },
  { day: 4, roasterSlug: 'klvn-coffee-lab', roasterName: 'KLVN Coffee Lab', coffee: 'Shakiso Natural', notes: ['Blueberry', 'Jasmine', 'Dark chocolate'] },
  { day: 5, roasterSlug: 'de-fer-coffee-and-tea', roasterName: 'De Fer Coffee & Tea', coffee: 'La Esperanza', notes: ['Toffee', 'Orange peel', 'Almond'] },
  { day: 6, roasterSlug: 'the-boredom-set', roasterName: 'The Boredom Set', coffee: 'Kanzu Washed', notes: ['Nectarine', 'Black tea', 'Honey'] },
  { day: 7, roasterSlug: 'redstart-roasters', roasterName: 'Redstart Roasters', coffee: 'Bird Friendly Marcala', notes: ['Milk chocolate', 'Plum', 'Hazelnut'] },
  { day: 8, roasterSlug: 'colombino-coffee', roasterName: 'COLOMBINO Coffee', coffee: 'Inmaculada Geisha', notes: ['Bergamot', 'Peach', 'White flowers'] },
  { day: 9, roasterSlug: 'convive', roasterName: 'Convive', coffee: 'Antioquia Decaf', notes: ['Baking spice', 'Dried fig', 'Cocoa nib'] },
  { day: 10, roasterSlug: 'allegheny-coffee-and-tea-exchange', roasterName: 'Allegheny Coffee & Tea Exchange', coffee: 'Sumatra Mandheling', notes: ['Cedar', 'Tobacco', 'Dark cherry'] },
  { day: 11, roasterSlug: 'espresso-a-mano', roasterName: 'Espresso a Mano', coffee: 'Casa Loma Espresso', notes: ['Caramel', 'Walnut', 'Cherry'] },
  { day: 12, roasterSlug: 'la-prima-espresso', roasterName: 'La Prima Espresso', coffee: 'Torrefazione Riserva', notes: ['Dark cocoa', 'Toasted bread', 'Dried fruit'] },
  { day: 13, roasterSlug: 'mechanic-coffee', roasterName: 'Mechanic Coffee', coffee: 'Torque Blend', notes: ['Peanut brittle', 'Molasses', 'Orange'] },
  { day: 14, roasterSlug: 'compass-point-coffee', roasterName: 'Compass Point Coffee', coffee: 'Yirgacheffe Washed', notes: ['Lemon', 'Bergamot', 'Honeysuckle'] },
  { day: 15, roasterSlug: 'standing-wave-coffee', roasterName: 'Standing Wave Coffee', coffee: 'Huila Pink Bourbon', notes: ['Guava', 'Panela', 'Tangerine'] },
  { day: 16, roasterSlug: 'press-house-coffee', roasterName: 'Press House Coffee', coffee: 'Himalayan Arabica', notes: ['Green apple', 'Malt', 'Cane sugar'] },
  { day: 17, roasterSlug: 'nicholas-coffee-and-tea', roasterName: 'Nicholas Coffee & Tea Co.', coffee: 'Market Square Blend', notes: ['Pecan', 'Cocoa', 'Soft citrus'] },
  { day: 18, roasterSlug: 'prestogeorge', roasterName: 'Prestogeorge Coffee & Tea', coffee: 'Strip District Espresso', notes: ['Fudge', 'Walnut', 'Clove'] },
  { day: 19, roasterSlug: 'steel-cup-coffee-roasters', roasterName: 'Steel Cup Coffee Roasters', coffee: 'Organic Cajamarca', notes: ['Milk chocolate', 'Almond', 'Red apple'] },
  { day: 20, roasterSlug: 'rockin-cat', roasterName: "Rockin' Cat", coffee: 'Organic Tres Ríos', notes: ['Brown sugar', 'Apricot', 'Cocoa'] },
  { day: 21, roasterSlug: 'reginalds-coffee', roasterName: "Reginald's Coffee", coffee: 'Schoolhouse Reserve', notes: ['Strawberry', 'Cocoa', 'Cane sugar'] },
  { day: 22, roasterSlug: 'the-coffee-tree-roasters', roasterName: 'The Coffee Tree Roasters', coffee: 'Squirrel Hill Blend', notes: ['Chocolate malt', 'Hazelnut', 'Citrus'] },
  { day: 23, roasterSlug: 'macizo', roasterName: 'Macizo', coffee: 'Marcala Honey', notes: ['Honeycomb', 'Papaya', 'Cinnamon'] },
  {
    day: 24,
    roasterSlug: 'dynamic-coffee-roasters',
    roasterName: 'Dynamic Coffee Roasters',
    coffee: 'Jorge Ventura · Bourbon',
    notes: ['Candied orange', 'Dark chocolate', 'Spice'],
    producer: 'Jorge Ventura',
    origin: 'Marcala, Honduras',
    varietal: 'Bourbon',
    process: 'Natural',
    altitude: '1,600 masl',
    blurb:
      'Dynamic closes the calendar the way it opened it: with a grower they buy from directly. Jorge Ventura dries this lot whole-cherry, which pushes it darker and sweeter than the Catuaí behind door one — a deliberate Christmas Eve coffee.',
    brew: DYNAMIC_BREW,
  },
]

export const findAdventDay = (day: number) => ADVENT_LINEUP.find(entry => entry.day === day)

// Other days the same roaster holds — Dynamic takes both bookends, and any
// roaster may end up with more than one.
export const otherDaysFor = (entry: AdventDay) =>
  ADVENT_LINEUP.filter(other => other.roasterSlug === entry.roasterSlug && other.day !== entry.day)
