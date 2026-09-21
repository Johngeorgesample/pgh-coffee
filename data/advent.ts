// The advent calendar lineup: a Dynamic Coffee Roasters box, one Pittsburgh
// roaster's coffee per day, with the reading for each day hosted here.
//
// PLACEHOLDER DATA. Roaster/coffee pairings are illustrative and unconfirmed —
// replace each entry as the real lineup lands. `roasterSlug` must match a row in
// the `roaster` table so the day page can link through to the map.
//
// Only `day`, `roasterSlug`, `roasterName`, `coffee` and `notes` are required;
// everything else renders when present, so entries can be filled in over time.

export const ADVENT_DAYS = 24

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
  roast?: string
  blurb?: string
  // YouTube id for the roaster's brew video. Absent until the video is recorded.
  videoId?: string
}

export const ADVENT_LINEUP: AdventDay[] = [
  {
    day: 1,
    roasterSlug: 'dynamic-coffee-roasters',
    roasterName: 'Dynamic Coffee Roasters',
    coffee: 'Don Fabio Caballero',
    notes: ['Red apple', 'Brown sugar', 'Cocoa'],
    producer: 'Don Fabio Caballero',
    origin: 'Marcala, Honduras',
    varietal: 'Catuaí',
    process: 'Washed',
    altitude: '1,500 masl',
    roast: 'Medium',
    blurb:
      'Commodo et at placeat deserunt id nam sint omnis ullamco. Laborum sit quibusdam occaecat qui quos placeat facere lorem eligendi. Duis nihil assumenda aliquip atque ut velit sit dolor sit nam dignissimos ipsum eveniet sint soluta.',
  },
  {
    day: 2,
    roasterSlug: 'commonplace',
    roasterName: 'Commonplace Coffee',
    coffee: 'Kirinyaga AA',
    notes: ['Blackcurrant', 'Grapefruit', 'Cane sugar'],
    producer: 'Kabare Cooperative',
    origin: 'Kirinyaga, Kenya',
    varietal: 'SL28',
    process: 'Washed',
    roast: 'Light',
    blurb:
      'Eiusmod pariatur quibusdam minim quo repellendus tempore rerum voluptate commodo. Quos amet deleniti soluta ad qui expedita cupidatat assumenda nihil necessitatibus eos. Dignissimos officia vero duis amet saepe sit pariatur anim velit sint culpa iusto minim.',
  },
  {
    day: 3,
    roasterSlug: 'redhawk-coffee-roasters',
    roasterName: 'Redhawk Coffee Roasters',
    coffee: 'Finca El Paraíso',
    notes: ['Lychee', 'Rose', 'Red grape'],
    producer: 'Diego Samuel Bermúdez',
    origin: 'Piendamó, Colombia',
    varietal: 'Castillo',
    process: 'Thermal shock',
    roast: 'Light',
    blurb:
      'Excepteur quos id molestias deleniti sed quos ipsum officiis id consequat. Nostrud cumque id dignissimos officiis ducimus id cupidatat expedita necessitatibus enim aliquip. Saepe accusamus occaecat quo ipsum tempore possimus sed ad placeat atque.',
  },
  {
    day: 4,
    roasterSlug: 'klvn-coffee-lab',
    roasterName: 'KLVN Coffee Lab',
    coffee: 'Shakiso Natural',
    notes: ['Blueberry', 'Jasmine', 'Dark chocolate'],
    producer: 'Shakiso Washing Station',
    origin: 'Guji, Ethiopia',
    varietal: 'Heirloom',
    process: 'Natural',
    roast: 'Light',
    blurb:
      'Ut nihil cupidatat est enim tempor sed dolor non ducimus in assumenda placeat. Nisi accusamus odio pariatur aute possimus veniam autem ut. Laboris sit quibusdam distinctio repellendus consequat assumenda duis nostrud minim voluptate in molestias.',
  },
  {
    day: 5,
    roasterSlug: 'de-fer-coffee-and-tea',
    roasterName: 'De Fer Coffee & Tea',
    coffee: 'La Esperanza',
    notes: ['Toffee', 'Orange peel', 'Almond'],
    producer: 'Familia Morales',
    origin: 'Huehuetenango, Guatemala',
    varietal: 'Bourbon',
    process: 'Washed',
    roast: 'Medium',
    blurb:
      'Voluptas nobis officiis quo nam iusto sit officiis anim possimus ea nam adipiscing ad. Excepteur id saepe ea sint dignissimos ut voluptatum ea ipsum. Proident aute quis saepe facere occaecat ad placeat assumenda do magna quas. Dolore dolore lorem saepe lorem ullamco possimus laboris minim saepe minim in velit exercitation dignissimos eveniet.',
  },
  {
    day: 6,
    roasterSlug: 'the-boredom-set',
    roasterName: 'The Boredom Set',
    coffee: 'Kanzu Washed',
    notes: ['Nectarine', 'Black tea', 'Honey'],
    producer: 'Kanzu Washing Station',
    origin: 'Nyamasheke, Rwanda',
    varietal: 'Red Bourbon',
    process: 'Washed',
    roast: 'Light',
    blurb:
      'Placeat consequat amet lorem aliqua libero atque id placeat quo excepteur velit facere dolor duis laborum. Impedit saepe proident odio dignissimos soluta incididunt nostrud praesentium ducimus eligendi repellendus. Libero assumenda dolores soluta tempor debitis culpa cillum tempor pariatur assumenda proident repellendus.',
  },
  {
    day: 7,
    roasterSlug: 'redstart-roasters',
    roasterName: 'Redstart Roasters',
    coffee: 'Bird Friendly Marcala',
    notes: ['Milk chocolate', 'Plum', 'Hazelnut'],
    producer: 'COMSA Cooperative',
    origin: 'Marcala, Honduras',
    varietal: 'Catuaí',
    process: 'Washed',
    roast: 'Medium',
    blurb:
      'Cupidatat nam adipiscing do autem odio incididunt pariatur deleniti elit vero. Amet tempor qui sunt sed ex tempor ducimus culpa elit autem praesentium. Nisi molestias molestias deleniti elit voluptatum deleniti cupidatat adipiscing nisi. Blanditiis rerum magna in sunt aliqua dignissimos et voluptatum.',
  },
  {
    day: 8,
    roasterSlug: 'colombino-coffee',
    roasterName: 'COLOMBINO Coffee',
    coffee: 'Inmaculada Geisha',
    notes: ['Bergamot', 'Peach', 'White flowers'],
    producer: 'Finca La Inmaculada',
    origin: 'Valle del Cauca, Colombia',
    varietal: 'Geisha',
    process: 'Washed',
    roast: 'Light',
    blurb:
      'Sint dolore nostrud optio consectetur eiusmod magna ea repellendus vero ullamco non distinctio sit. Laborum mollit occaecat at voluptatum nostrud quibusdam non tempor laborum aliquip placeat dolor eligendi duis accusamus. Id sint nihil labore libero consequat incididunt temporibus sed occaecat quas quibusdam sint ut libero.',
  },
  {
    day: 9,
    roasterSlug: 'convive',
    roasterName: 'Convive',
    coffee: 'Antioquia Decaf',
    notes: ['Baking spice', 'Dried fig', 'Cocoa nib'],
    producer: 'Asociación de Antioquia',
    origin: 'Antioquia, Colombia',
    varietal: 'Caturra',
    process: 'Sugarcane decaf',
    roast: 'Medium',
    blurb:
      'Duis magna quis necessitatibus cum lorem eu vero anim quos eiusmod cillum ducimus dolores. Impedit sint minim optio deserunt nihil culpa ad minim. Adipiscing labore dolore vero saepe atque sed possimus nobis occaecat voluptas minus. In ullamco cum nisi nihil voluptas sunt tempor facere duis.',
  },
  {
    day: 10,
    roasterSlug: 'allegheny-coffee-and-tea-exchange',
    roasterName: 'Allegheny Coffee & Tea Exchange',
    coffee: 'Sumatra Mandheling',
    notes: ['Cedar', 'Tobacco', 'Dark cherry'],
    producer: 'Koperasi Gayo',
    origin: 'Aceh, Indonesia',
    varietal: 'Typica',
    process: 'Wet-hulled',
    roast: 'Dark',
    blurb:
      'Est voluptatum ipsum ullamco anim temporibus laborum autem aute nam repellendus ad amet accusamus laborum. Do ea minus pariatur consectetur sunt necessitatibus magna quos nulla sint sunt irure autem. Mollit veniam soluta reprehenderit libero pariatur magna mollit facere necessitatibus ex officia dolores.',
  },
  {
    day: 11,
    roasterSlug: 'espresso-a-mano',
    roasterName: 'Espresso a Mano',
    coffee: 'Casa Loma Espresso',
    notes: ['Caramel', 'Walnut', 'Cherry'],
    producer: 'Fazenda Casa Loma',
    origin: 'Minas Gerais, Brazil',
    varietal: 'Yellow Catuaí',
    process: 'Pulped natural',
    roast: 'Medium',
    blurb:
      'Deserunt eos rerum atque nostrud quis assumenda eos id molestias dolores voluptas quis incididunt deserunt reprehenderit. Tempor odio repellendus nobis expedita consectetur corrupti cupidatat deserunt nam quo. Quas ipsum quibusdam iusto sed elit amet nostrud eveniet ex corrupti. Possimus anim esse officia atque officiis exercitation accusamus aliquip.',
  },
  {
    day: 12,
    roasterSlug: 'la-prima-espresso',
    roasterName: 'La Prima Espresso',
    coffee: 'Torrefazione Riserva',
    notes: ['Dark cocoa', 'Toasted bread', 'Dried fruit'],
    producer: 'Multiple smallholders',
    origin: 'Brazil · Sumatra',
    varietal: 'Blend',
    process: 'Mixed',
    roast: 'Dark',
    blurb:
      'Libero iusto tempore fugiat aliqua sint ipsum excepteur est aute distinctio repellendus mollit. Blanditiis lorem libero quas aliqua officia excepteur ad eu ullamco elit voluptatum. Do eos soluta temporibus eu soluta non assumenda officiis tempor dolor elit. Tempor culpa officia labore libero culpa magna dignissimos velit eveniet quas blanditiis.',
  },
  {
    day: 13,
    roasterSlug: 'mechanic-coffee',
    roasterName: 'Mechanic Coffee',
    coffee: 'Torque Blend',
    notes: ['Peanut brittle', 'Molasses', 'Orange'],
    producer: 'Multiple smallholders',
    origin: 'Colombia · Ethiopia',
    varietal: 'Blend',
    process: 'Mixed',
    roast: 'Medium',
    blurb:
      'Soluta soluta assumenda debitis quis nam aliquip tempore aliqua saepe nisi distinctio impedit. Dolore do odio debitis laboris minus in sit qui dolore officiis. Aute quibusdam aliqua eiusmod saepe voluptas repellendus repellendus consequat. Minus qui magna voluptas eveniet commodo nulla debitis aliquip laborum maxime ducimus praesentium culpa tempore pariatur.',
  },
  {
    day: 14,
    roasterSlug: 'compass-point-coffee',
    roasterName: 'Compass Point Coffee',
    coffee: 'Yirgacheffe Washed',
    notes: ['Lemon', 'Bergamot', 'Honeysuckle'],
    producer: 'Konga Cooperative',
    origin: 'Yirgacheffe, Ethiopia',
    varietal: 'Heirloom',
    process: 'Washed',
    roast: 'Light',
    blurb:
      'Duis quo commodo in impedit do libero deserunt reprehenderit anim soluta saepe. Cupidatat possimus et consequat nisi saepe velit nulla repellendus consequat pariatur assumenda molestias molestias accusamus. Ad ducimus tempore libero aute minim ipsum nam sed et corrupti.',
  },
  {
    day: 15,
    roasterSlug: 'standing-wave-coffee',
    roasterName: 'Standing Wave Coffee',
    coffee: 'Huila Pink Bourbon',
    notes: ['Guava', 'Panela', 'Tangerine'],
    producer: 'Finca El Mirador',
    origin: 'Huila, Colombia',
    varietal: 'Pink Bourbon',
    process: 'Washed',
    roast: 'Light',
    blurb:
      'Accusamus quo amet ad ex dolor elit eveniet repellendus. Rerum nobis excepteur ex labore eu anim optio nulla aute cupidatat. Fugiat aliquip rerum ullamco saepe nulla assumenda velit nisi voluptate impedit eos sunt.',
  },
  {
    day: 16,
    roasterSlug: 'press-house-coffee',
    roasterName: 'Press House Coffee',
    coffee: 'Himalayan Arabica',
    notes: ['Green apple', 'Malt', 'Cane sugar'],
    producer: 'Attikan Estate',
    origin: 'Karnataka, India',
    varietal: 'S795',
    process: 'Washed',
    roast: 'Medium',
    blurb:
      'Est irure sunt aliquip deserunt lorem proident rerum libero cumque consequat ex expedita nisi ipsum in. Temporibus cillum tempore aliqua minus quos voluptate dolor voluptas nisi quos commodo dolor. Repellendus quos tempore molestias sit anim mollit corrupti molestias optio in. Omnis voluptate pariatur consequat sunt omnis tempor fugiat at culpa accusamus distinctio.',
  },
  {
    day: 17,
    roasterSlug: 'nicholas-coffee-and-tea',
    roasterName: 'Nicholas Coffee & Tea Co.',
    coffee: 'Market Square Blend',
    notes: ['Pecan', 'Cocoa', 'Soft citrus'],
    producer: 'Multiple smallholders',
    origin: 'Central America',
    varietal: 'Blend',
    process: 'Washed',
    roast: 'Medium',
    blurb:
      'Pariatur in veniam facere optio optio dignissimos libero aute labore sit ea occaecat. Commodo necessitatibus vero assumenda velit expedita debitis soluta nihil non magna ducimus elit magna temporibus. Enim eveniet optio odio blanditiis assumenda soluta ullamco cillum dignissimos et eveniet. Voluptate proident eiusmod vero rerum id expedita corrupti aliqua soluta.',
  },
  {
    day: 18,
    roasterSlug: 'prestogeorge',
    roasterName: 'Prestogeorge Coffee & Tea',
    coffee: 'Strip District Espresso',
    notes: ['Fudge', 'Walnut', 'Clove'],
    producer: 'Multiple smallholders',
    origin: 'Brazil · Guatemala',
    varietal: 'Blend',
    process: 'Mixed',
    roast: 'Dark',
    blurb:
      'Libero deserunt cillum ex exercitation laborum molestias at quis est. Mollit consequat exercitation commodo nobis et esse accusamus cum placeat omnis veniam necessitatibus. Minim ex exercitation quo pariatur voluptatum vero exercitation repellendus cum saepe maxime.',
  },
  {
    day: 19,
    roasterSlug: 'steel-cup-coffee-roasters',
    roasterName: 'Steel Cup Coffee Roasters',
    coffee: 'Organic Cajamarca',
    notes: ['Milk chocolate', 'Almond', 'Red apple'],
    producer: 'Cooperativa Sol y Café',
    origin: 'Cajamarca, Peru',
    varietal: 'Typica',
    process: 'Washed',
    roast: 'Medium',
    blurb:
      'Eos exercitation cupidatat fugiat iusto in deleniti aliqua corrupti consequat. Consequat proident esse duis quibusdam ut facere esse voluptate dolor. Eveniet do exercitation labore dignissimos mollit occaecat necessitatibus impedit do assumenda incididunt.',
  },
  {
    day: 20,
    roasterSlug: 'rockin-cat',
    roasterName: "Rockin' Cat",
    coffee: 'Organic Tres Ríos',
    notes: ['Brown sugar', 'Apricot', 'Cocoa'],
    producer: 'Beneficio Tres Ríos',
    origin: 'Tres Ríos, Costa Rica',
    varietal: 'Caturra',
    process: 'Honey',
    roast: 'Medium',
    blurb:
      'Cum expedita debitis incididunt saepe esse voluptatum minim sit proident proident do ut. Velit id deleniti deserunt proident ullamco exercitation velit molestias soluta cillum. Culpa tempor molestias accusamus repellendus officiis laborum non eiusmod ullamco voluptatum ea amet exercitation.',
  },
  {
    day: 21,
    roasterSlug: 'reginalds-coffee',
    roasterName: "Reginald's Coffee",
    coffee: 'Schoolhouse Reserve',
    notes: ['Strawberry', 'Cocoa', 'Cane sugar'],
    producer: 'Finca La Escuela',
    origin: 'Nariño, Colombia',
    varietal: 'Caturra',
    process: 'Natural',
    roast: 'Light',
    blurb:
      'Nobis sunt expedita irure est officiis laboris voluptas id repellendus eos quis vero iusto ex. Ipsum excepteur deleniti culpa sed aliqua voluptas maxime aliquip. Nobis consectetur qui quo facere eveniet proident dolores officia amet cillum dignissimos.',
  },
  {
    day: 22,
    roasterSlug: 'the-coffee-tree-roasters',
    roasterName: 'The Coffee Tree Roasters',
    coffee: 'Squirrel Hill Blend',
    notes: ['Chocolate malt', 'Hazelnut', 'Citrus'],
    producer: 'Multiple smallholders',
    origin: 'Colombia · Sumatra',
    varietal: 'Blend',
    process: 'Mixed',
    roast: 'Medium',
    blurb:
      'Sit dolores deserunt quis eligendi et quo nam eveniet fugiat voluptas eiusmod. Duis adipiscing velit corrupti veniam ducimus soluta impedit qui optio adipiscing voluptatum. Atque consequat voluptate sunt nostrud quis debitis labore deleniti.',
  },
  {
    day: 23,
    roasterSlug: 'macizo',
    roasterName: 'Macizo',
    coffee: 'Marcala Honey',
    notes: ['Honeycomb', 'Papaya', 'Cinnamon'],
    producer: 'Finca Buenos Aires',
    origin: 'Marcala, Honduras',
    varietal: 'Pacas',
    process: 'Honey',
    roast: 'Medium',
    blurb:
      'Dolor atque voluptate culpa sint iusto nulla dolore nihil nostrud. Officia ipsum nisi quas mollit sit ut eiusmod optio at sunt dolor eos. Nulla facere elit ullamco omnis amet atque excepteur libero veniam quas laboris quo pariatur praesentium. Voluptatum irure libero velit voluptatum eiusmod temporibus id veniam cumque est atque voluptas deserunt.',
  },
  {
    day: 24,
    roasterSlug: 'dynamic-coffee-roasters',
    roasterName: 'Dynamic Coffee Roasters',
    coffee: 'Jorge Ventura',
    notes: ['Candied orange', 'Dark chocolate', 'Spice'],
    producer: 'Jorge Ventura',
    origin: 'Marcala, Honduras',
    varietal: 'Bourbon',
    process: 'Natural',
    altitude: '1,600 masl',
    roast: 'Medium-dark',
    blurb:
      'Laboris minim nostrud minim tempore soluta tempor optio maxime enim repellendus. Nihil facere ipsum officia anim necessitatibus nihil expedita labore sit accusamus minim laborum. Soluta reprehenderit at eiusmod soluta placeat commodo officiis dolores ad soluta esse voluptate do dignissimos nam. Libero amet laboris velit eu minus sed voluptate incididunt ea tempore corrupti assumenda enim.',
  },
]

export const findAdventDay = (day: number) => ADVENT_LINEUP.find(entry => entry.day === day)
