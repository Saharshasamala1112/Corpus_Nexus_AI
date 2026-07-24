import { getRecords, type CorpusRecord } from './recordsService'
import { getLeaderboard, type LeaderboardUser } from './leaderboardService'

export interface InsightResponse {
  answer: string
  chart: 'mediaType' | 'language' | 'leaderboard' | 'none'
}

type CountMap = Map<string, number>

function buildLanguageCounts(records: CorpusRecord[]): CountMap {
  const counts: CountMap = new Map()
  for (const r of records) {
    const key = r.language || 'Unknown'
    counts.set(key, (counts.get(key) ?? 0) + 1)
  }
  return counts
}

function buildMediaCounts(records: CorpusRecord[]): CountMap {
  const counts: CountMap = new Map()
  for (const r of records) {
    const key = r.media_type || 'Unknown'
    counts.set(key, (counts.get(key) ?? 0) + 1)
  }
  return counts
}

function getHighest(counts: CountMap): [string, number] {
  let bestKey = ''
  let bestVal = -1
  for (const [k, v] of counts) {
    if (v > bestVal) {
      bestVal = v
      bestKey = k
    }
  }
  return [bestKey, bestVal]
}

function getLowest(counts: CountMap): [string, number] {
  let worstKey = ''
  let worstVal = Infinity
  for (const [k, v] of counts) {
    if (v < worstVal) {
      worstVal = v
      worstKey = k
    }
  }
  return [worstKey, worstVal]
}

function isHighestQuestion(lower: string): boolean {
  return lower.includes('highest') || lower.includes('most common') || lower.includes('most')
}

function isLowestQuestion(lower: string): boolean {
  return lower.includes('lowest') || lower.includes('least common') || lower.includes('least')
}

function isCountQuestion(lower: string): boolean {
  return (
    (lower.includes('how many') && lower.includes('language')) ||
    lower.includes('number of language') ||
    lower.includes('total language')
  )
}

function isListQuestion(lower: string): boolean {
  return (
    lower.includes('list') ||
    lower.includes('show available') ||
    (lower.includes('all') && lower.includes('language'))
  )
}

function isDistributionQuestion(lower: string): boolean {
  return lower.includes('distribution') || lower.includes('chart')
}

function isLanguageQuery(lower: string): boolean {
  return lower.includes('language') || lower.includes('lang')
}

function buildLanguageAnswer(lower: string, counts: CountMap, total: number): InsightResponse {
  if (isCountQuestion(lower)) {
    return {
      answer: `There are ${total} languages available.`,
      chart: 'none',
    }
  }

  if (isListQuestion(lower)) {
    const names = [...counts.keys()].join(', ')
    return {
      answer: `The available languages are: ${names}.`,
      chart: 'none',
    }
  }

  if (isDistributionQuestion(lower)) {
    const parts = [...counts.entries()]
      .sort(([, a], [, b]) => b - a)
      .map(([k, v]) => `${k}: ${v}`)
      .join(', ')
    return {
      answer: `The language distribution is — ${parts}.`,
      chart: 'language',
    }
  }

  if (isHighestQuestion(lower)) {
    const [name, value] = getHighest(counts)
    return {
      answer: `${name} has the highest number of recordings (${value}).`,
      chart: 'language',
    }
  }

  if (isLowestQuestion(lower)) {
    const [name, value] = getLowest(counts)
    return {
      answer: `${name} has the lowest number of recordings (${value}).`,
      chart: 'language',
    }
  }

  return unsupportedResponse()
}

function isMediaQuery(lower: string): boolean {
  return (
    lower.includes('media') ||
    lower.includes('audio') ||
    lower.includes('image') ||
    lower.includes('video') ||
    lower.includes('text') ||
    lower.includes('document') ||
    lower.includes('recording')
  )
}

function buildMediaAnswer(lower: string, counts: CountMap): InsightResponse {
  if (isDistributionQuestion(lower)) {
    const parts = [...counts.entries()]
      .sort(([, a], [, b]) => b - a)
      .map(([k, v]) => `${k}: ${v}`)
      .join(', ')
    return {
      answer: `The media type distribution is — ${parts}.`,
      chart: 'mediaType',
    }
  }

  if (isSpecificMediaCountQuery(lower, counts)) {
    return buildSpecificMediaCountAnswer(lower, counts)
  }

  if (isHighestQuestion(lower)) {
    const [name, value] = getHighest(counts)
    return {
      answer: `${name} has the highest number of recordings (${value}).`,
      chart: 'mediaType',
    }
  }

  if (isLowestQuestion(lower)) {
    const [name, value] = getLowest(counts)
    return {
      answer: `${name} has the lowest number of recordings (${value}).`,
      chart: 'mediaType',
    }
  }

  return unsupportedResponse()
}

const MEDIA_TYPES = ['audio', 'video', 'image', 'text', 'document'] as const

function isSpecificMediaCountQuery(lower: string, counts: CountMap): boolean {
  for (const mt of MEDIA_TYPES) {
    if (lower.includes(mt)) {
      const val = counts.get(mt) ?? 0
      if (val > 0) return true
    }
  }
  return false
}

function buildSpecificMediaCountAnswer(lower: string, counts: CountMap): InsightResponse {
  for (const mt of MEDIA_TYPES) {
    if (lower.includes(mt)) {
      const value = counts.get(mt) ?? 0
      const label = mt.charAt(0).toUpperCase() + mt.slice(1)
      return {
        answer: `There are ${value} ${label.toLowerCase()} recordings.`,
        chart: 'none',
      }
    }
  }
  return unsupportedResponse()
}

function isRecordsQuery(lower: string): boolean {
  return (
    (lower.includes('total') && lower.includes('record')) ||
    lower.includes('how many') ||
    lower.includes('dataset size') ||
    lower.includes('number of recording')
  )
}

function isLeaderboardQuery(lower: string): boolean {
  return lower.includes('leaderboard') || lower.includes('contributor') || lower.includes('top')
}

function isContributorCountQuery(lower: string): boolean {
  return (lower.includes('number') || lower.includes('count')) && lower.includes('contributor')
}

function isTopNQuery(lower: string): boolean {
  return (
    lower.includes('top') ||
    lower.includes('first') ||
    lower.includes('second') ||
    lower.includes('third')
  )
}

async function buildLeaderboardAnswer(lower: string): Promise<InsightResponse> {
  const users = await getLeaderboard()

  if (isContributorCountQuery(lower)) {
    return {
      answer: `There are ${users.length} contributors.`,
      chart: 'leaderboard',
    }
  }

  if (isTopNQuery(lower)) {
    return buildTopNAnswer(lower, users)
  }

  if (lower.includes('show') || lower.includes('leaderboard')) {
    const lines = users
      .slice(0, 5)
      .map((u) => `${u.user_name} (${u.total_points} pts)`)
      .join(', ')
    return {
      answer: `The top contributors are: ${lines}.`,
      chart: 'leaderboard',
    }
  }

  return unsupportedResponse()
}

function buildTopNAnswer(lower: string, users: LeaderboardUser[]): InsightResponse {
  const ordinals: Record<string, number> = {
    first: 0,
    second: 1,
    third: 2,
    '1': 0,
    '2': 1,
    '3': 2,
    '4': 3,
    '5': 4,
  }

  for (const [word, index] of Object.entries(ordinals)) {
    if (lower.includes(word)) {
      const user = users[index]
      if (!user) {
        return {
          answer: 'There is no contributor at that position.',
          chart: 'leaderboard',
        }
      }
      const label = index === 0 ? 'top' : word
      return {
        answer: `${user.user_name} is currently the ${label} contributor with ${user.total_points} points.`,
        chart: 'leaderboard',
      }
    }
  }

  if (lower.includes('five') || lower.includes('5')) {
    const lines = users
      .slice(0, 5)
      .map((u, i) => `${i + 1}. ${u.user_name} (${u.total_points} pts)`)
      .join('\n')
    return {
      answer: `Top 5 contributors:\n${lines}`,
      chart: 'leaderboard',
    }
  }

  return unsupportedResponse()
}

function isHelpQuery(lower: string): boolean {
  return lower === 'help' || lower === 'supported' || lower === 'what can you do'
}

function buildHelpAnswer(): InsightResponse {
  return {
    answer: [
      'I can answer questions like:',
      '',
      'Languages:',
      '  - Which language has the highest/lowest recordings?',
      '  - How many languages are there?',
      '  - List all languages',
      '  - Language distribution',
      '',
      'Media types:',
      '  - Which media type has the highest/lowest recordings?',
      '  - Audio / Video / Image / Text / Document count',
      '  - Media distribution',
      '',
      'Records:',
      '  - Total recordings',
      '  - Dataset size',
      '',
      'Leaderboard:',
      '  - Top contributor',
      '  - Top 5 contributors',
      '  - Number of contributors',
    ].join('\n'),
    chart: 'none',
  }
}

function unsupportedResponse(): InsightResponse {
  return {
    answer: [
      "Sorry, I couldn't understand your question.",
      '',
      'Type "help" to see supported questions.',
    ].join('\n'),
    chart: 'none',
  }
}

export const getInsight = async (question: string): Promise<InsightResponse> => {
  const lower = question.trim().toLowerCase()

  if (isHelpQuery(lower)) {
    return buildHelpAnswer()
  }

  if (isRecordsQuery(lower)) {
    const records = await getRecords()
    return {
      answer: `There are a total of ${records.length} records in the dataset.`,
      chart: 'none',
    }
  }

  if (isLeaderboardQuery(lower)) {
    return buildLeaderboardAnswer(lower)
  }

  if (isMediaQuery(lower)) {
    const records = await getRecords()
    const counts = buildMediaCounts(records)
    return buildMediaAnswer(lower, counts)
  }

  if (isLanguageQuery(lower)) {
    const records = await getRecords()
    const counts = buildLanguageCounts(records)
    return buildLanguageAnswer(lower, counts, counts.size)
  }

  return unsupportedResponse()
}
