/**
 * Dynamic Variable Generators
 *
 * Provides Postman/Insomnia-compatible dynamic variables for use
 * in URLs, headers, and request bodies via {{ $variable }} syntax.
 *
 * Supported variables:
 * - $guid / $uuid: Random UUID v4
 * - $timestamp: Unix timestamp (seconds)
 * - $isoDate / $isoTimestamp: ISO 8601 date string
 * - $randomInt: Random integer 0-1000
 * - $randomFloat: Random float 0-1
 * - $randomEmail: Random email address
 * - $randomUserName: Random username
 * - $randomFullName: Random full name
 * - $randomFirstName / $randomLastName: Random name parts
 * - $randomCity / $randomCountry: Random location
 * - $randomColor: Random hex color
 * - $randomHexColor: Alias for $randomColor
 * - $randomLoremWord / $randomLoremSentence: Random lorem ipsum
 * - $randomPhoneNumber: Random phone number
 * - $randomUrl: Random URL
 * - $randomIP: Random IPv4 address
 * - $randomIPv6: Random IPv6 address
 * - $randomMACAddress: Random MAC address
 * - $randomPassword: Random password (12 chars)
 * - $randomAlphaNumeric: Random alphanumeric string
 * - $randomBoolean: true/false
 * - $randomPort: Random port 1024-65535
 */

const FIRST_NAMES = [
  'James',
  'Mary',
  'John',
  'Patricia',
  'Robert',
  'Jennifer',
  'Michael',
  'Linda',
  'William',
  'Elizabeth',
  'David',
  'Barbara',
  'Richard',
  'Susan',
  'Joseph',
  'Jessica',
  'Thomas',
  'Sarah',
  'Christopher',
  'Karen',
]

const LAST_NAMES = [
  'Smith',
  'Johnson',
  'Williams',
  'Brown',
  'Jones',
  'Garcia',
  'Miller',
  'Davis',
  'Rodriguez',
  'Martinez',
  'Hernandez',
  'Lopez',
  'Gonzalez',
  'Wilson',
  'Anderson',
  'Thomas',
  'Taylor',
  'Moore',
  'Jackson',
  'Martin',
]

const CITIES = [
  'New York',
  'Los Angeles',
  'Chicago',
  'Houston',
  'Phoenix',
  'Philadelphia',
  'San Antonio',
  'San Diego',
  'Dallas',
  'San Jose',
  'Austin',
  'Jacksonville',
  'London',
  'Paris',
  'Tokyo',
  'Berlin',
  'Sydney',
  'Toronto',
  'Singapore',
]

const COUNTRIES = [
  'United States',
  'United Kingdom',
  'Canada',
  'Australia',
  'Germany',
  'France',
  'Japan',
  'Brazil',
  'India',
  'Spain',
  'Italy',
  'Netherlands',
  'Sweden',
  'Norway',
  'Switzerland',
  'South Korea',
  'Mexico',
  'Argentina',
]

const LOREM_WORDS = [
  'lorem',
  'ipsum',
  'dolor',
  'sit',
  'amet',
  'consectetur',
  'adipiscing',
  'elit',
  'sed',
  'do',
  'eiusmod',
  'tempor',
  'incididunt',
  'ut',
  'labore',
  'et',
  'dolore',
  'magna',
  'aliqua',
  'enim',
  'ad',
  'minim',
  'veniam',
  'quis',
  'nostrud',
  'exercitation',
  'ullamco',
  'laboris',
  'nisi',
]

const DOMAINS = ['example.com', 'test.org', 'demo.net', 'sample.io', 'mock.dev']

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function randomString(length: number, charset: string): string {
  let result = ''
  for (let i = 0; i < length; i++) {
    result += charset[Math.floor(Math.random() * charset.length)]
  }
  return result
}

/** Generate a UUID v4 */
export function generateGuid(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  // Fallback for environments without crypto.randomUUID
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

/** Generate Unix timestamp in seconds */
export function generateTimestamp(): string {
  return String(Math.floor(Date.now() / 1000))
}

/** Generate Unix timestamp in milliseconds */
export function generateTimestampMs(): string {
  return String(Date.now())
}

/** Generate ISO 8601 date string */
export function generateIsoDate(): string {
  return new Date().toISOString().split('T')[0]
}

/** Generate ISO 8601 timestamp */
export function generateIsoTimestamp(): string {
  return new Date().toISOString()
}

/** Generate random integer 0-1000 */
export function generateRandomInt(): string {
  return String(randomInt(0, 1000))
}

/** Generate random float 0-1 with 2 decimals */
export function generateRandomFloat(): string {
  return Math.random().toFixed(2)
}

/** Generate random email */
export function generateRandomEmail(): string {
  const user = randomString(8, 'abcdefghijklmnopqrstuvwxyz')
  return `${user}@${randomItem(DOMAINS)}`
}

/** Generate random username */
export function generateRandomUserName(): string {
  const prefixes = ['cool', 'swift', 'dark', 'bright', 'silent', 'rapid', 'wise', 'bold']
  return `${randomItem(prefixes)}_${randomString(6, 'abcdefghijklmnopqrstuvwxyz0123456789')}`
}

/** Generate random full name */
export function generateRandomFullName(): string {
  return `${randomItem(FIRST_NAMES)} ${randomItem(LAST_NAMES)}`
}

/** Generate random first name */
export function generateRandomFirstName(): string {
  return randomItem(FIRST_NAMES)
}

/** Generate random last name */
export function generateRandomLastName(): string {
  return randomItem(LAST_NAMES)
}

/** Generate random city */
export function generateRandomCity(): string {
  return randomItem(CITIES)
}

/** Generate random country */
export function generateRandomCountry(): string {
  return randomItem(COUNTRIES)
}

/** Generate random hex color */
export function generateRandomColor(): string {
  return `#${randomString(6, '0123456789abcdef')}`
}

/** Generate random lorem word */
export function generateRandomLoremWord(): string {
  return randomItem(LOREM_WORDS)
}

/** Generate random lorem sentence */
export function generateRandomLoremSentence(): string {
  const words = Array.from({ length: randomInt(6, 12) }, () => randomItem(LOREM_WORDS))
  const sentence = words.join(' ')
  return sentence.charAt(0).toUpperCase() + sentence.slice(1) + '.'
}

/** Generate random lorem paragraph */
export function generateRandomLoremParagraph(): string {
  const sentences = Array.from({ length: randomInt(3, 5) }, () => generateRandomLoremSentence())
  return sentences.join(' ')
}

/** Generate random phone number */
export function generateRandomPhoneNumber(): string {
  return `+1${randomInt(200, 999)}${randomInt(100, 999)}${randomInt(1000, 9999)}`
}

/** Generate random URL */
export function generateRandomUrl(): string {
  return `https://${randomString(8, 'abcdefghijklmnopqrstuvwxyz')}.${randomItem(DOMAINS)}/${randomString(6, 'abcdefghijklmnopqrstuvwxyz')}`
}

/** Generate random IPv4 address */
export function generateRandomIP(): string {
  return `${randomInt(1, 255)}.${randomInt(0, 255)}.${randomInt(0, 255)}.${randomInt(1, 254)}`
}

/** Generate random IPv6 address */
export function generateRandomIPv6(): string {
  const groups = Array.from({ length: 8 }, () => randomString(4, '0123456789abcdef'))
  return groups.join(':')
}

/** Generate random MAC address */
export function generateRandomMACAddress(): string {
  const octets = Array.from({ length: 6 }, () => randomString(2, '0123456789abcdef'))
  return octets.join(':')
}

/** Generate random password (12 chars) */
export function generateRandomPassword(): string {
  return randomString(12, 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%')
}

/** Generate random alphanumeric string (16 chars) */
export function generateRandomAlphaNumeric(): string {
  return randomString(16, 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789')
}

/** Generate random boolean */
export function generateRandomBoolean(): string {
  return String(Math.random() < 0.5)
}

/** Generate random port (1024-65535) */
export function generateRandomPort(): string {
  return String(randomInt(1024, 65535))
}

/** Generate random year (1970-2030) */
export function generateRandomYear(): string {
  return String(randomInt(1970, 2030))
}

/** Generate random month (01-12) */
export function generateRandomMonth(): string {
  return String(randomInt(1, 12)).padStart(2, '0')
}

/** Generate random day of month (01-28) */
export function generateRandomDayOfMonth(): string {
  return String(randomInt(1, 28)).padStart(2, '0')
}

/** Generate random weekday */
export function generateRandomWeekday(): string {
  return randomItem(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'])
}

/** Generate random timezone */
export function generateRandomTimezone(): string {
  return randomItem([
    'UTC',
    'America/New_York',
    'America/Los_Angeles',
    'Europe/London',
    'Europe/Paris',
    'Asia/Tokyo',
    'Asia/Singapore',
    'Australia/Sydney',
  ])
}

/** Generate random user agent */
export function generateRandomUserAgent(): string {
  const browsers = ['Chrome/120.0', 'Firefox/121.0', 'Safari/605.1.15', 'Edge/120.0']
  const os = ['Windows NT 10.0', 'Macintosh; Intel Mac OS X 10_15_7', 'X11; Linux x86_64']
  return `Mozilla/5.0 (${randomItem(os)}) AppleWebKit/537.36 (KHTML, like Gecko) ${randomItem(browsers)}`
}

/** Generate random slug */
export function generateRandomSlug(): string {
  const words = ['api', 'rest', 'http', 'client', 'test', 'mock', 'server', 'data']
  return `${randomItem(words)}-${randomItem(words)}-${randomInt(100, 999)}`
}

/** Generate random file name */
export function generateRandomFileName(): string {
  const extensions = ['json', 'txt', 'csv', 'xml', 'log']
  return `${randomString(8, 'abcdefghijklmnopqrstuvwxyz')}.${randomItem(extensions)}`
}

/** Generate random JWT-like token (not cryptographically valid) */
export function generateRandomToken(): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).replace(/=/g, '')
  const payload = btoa(
    JSON.stringify({ sub: randomInt(1000, 9999), iat: Math.floor(Date.now() / 1000) }),
  ).replace(/=/g, '')
  const signature = randomString(
    32,
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_',
  )
  return `${header}.${payload}.${signature}`
}

/**
 * Map of dynamic variable names to generator functions.
 * Names are case-insensitive and matched without the $ prefix.
 */
export const DYNAMIC_GENERATORS: Record<string, () => string> = {
  guid: generateGuid,
  uuid: generateGuid,
  timestamp: generateTimestamp,
  timestampms: generateTimestampMs,
  isodate: generateIsoDate,
  isotimestamp: generateIsoTimestamp,
  randomint: generateRandomInt,
  randomfloat: generateRandomFloat,
  randomemail: generateRandomEmail,
  randomusername: generateRandomUserName,
  randomfullname: generateRandomFullName,
  randomfirstname: generateRandomFirstName,
  randomlastname: generateRandomLastName,
  randomcity: generateRandomCity,
  randomcountry: generateRandomCountry,
  randomcolor: generateRandomColor,
  randomhexcolor: generateRandomColor,
  randomloremword: generateRandomLoremWord,
  randomloremsentence: generateRandomLoremSentence,
  randomloremparagraph: generateRandomLoremParagraph,
  randomphonenumber: generateRandomPhoneNumber,
  randomurl: generateRandomUrl,
  randomip: generateRandomIP,
  randomipv6: generateRandomIPv6,
  randommacaddress: generateRandomMACAddress,
  randompassword: generateRandomPassword,
  randomalphanumeric: generateRandomAlphaNumeric,
  randomboolean: generateRandomBoolean,
  randomport: generateRandomPort,
  randomyear: generateRandomYear,
  randommonth: generateRandomMonth,
  randomdayofmonth: generateRandomDayOfMonth,
  randomweekday: generateRandomWeekday,
  randomtimezone: generateRandomTimezone,
  randomuseragent: generateRandomUserAgent,
  randomslug: generateRandomSlug,
  randomfilename: generateRandomFileName,
  randomtoken: generateRandomToken,
}

/**
 * Check if a variable name is a dynamic variable.
 */
export function isDynamicVariable(name: string): boolean {
  return name.startsWith('$') && name.toLowerCase().slice(1) in DYNAMIC_GENERATORS
}

/**
 * Resolve a dynamic variable by name.
 * Returns undefined if not a dynamic variable.
 */
export function resolveDynamicVariable(name: string): string | undefined {
  if (!name.startsWith('$')) return undefined
  const generator = DYNAMIC_GENERATORS[name.toLowerCase().slice(1)]
  return generator?.()
}
