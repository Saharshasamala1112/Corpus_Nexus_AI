import { getRecords } from './recordsService'

export interface InsightResponse {
  answer: string
  chart: 'mediaType' | 'language' | 'leaderboard' | 'none'
}

type CountMap = Map<string, number>
type RecordLike = Record<string, unknown>

const UNKNOWN_ANSWER = "I couldn't answer that using the available corpus data."

const LANGUAGE_KEYS = ['language', 'lang', 'language_name', 'speech_language']
const MEDIA_KEYS = ['media_type', 'media', 'mediaType', 'recording_type', 'format']
const CONTRIBUTOR_KEYS = ['contributor', 'contributor_name', 'user_name', 'speaker', 'created_by', 'annotator', 'owner']
const INSTITUTION_KEYS = ['institution', 'institution_name', 'college_name', 'organisation', 'organization', 'affiliation']
const DISTRICT_KEYS = ['district', 'district_name', 'district_name_en']
const STATE_KEYS = ['state', 'state_name', 'province']
const CATEGORY_KEYS = ['category', 'category_name', 'genre', 'type']
const GENDER_KEYS = ['gender', 'sex', 'speaker_gender', 'speaker_sex']
const DEVICE_KEYS = ['device', 'device_type', 'platform', 'source_device']

function normalizeValue(value: unknown): string | null {
  if (value === null || value === undefined) {
    return null
  }

  if (typeof value === 'string') {
    const trimmed = value.trim()
    return trimmed.length > 0 ? trimmed : null
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value)
  }

  if (Array.isArray(value)) {
    const first = value.find((item) => normalizeValue(item))
    return normalizeValue(first)
  }

  if (typeof value === 'object') {
    const candidate = Object.entries(value as Record<string, unknown>).find(([, nestedValue]) => normalizeValue(nestedValue))
    return candidate ? normalizeValue(candidate[1]) : null
  }

  return null
}

function getRecordValue(record: RecordLike, keys: string[]): string | null {
  for (const key of keys) {
    const direct = record[key]
    const value = normalizeValue(direct)
    if (value) {
      return value
    }
  }

  for (const [nestedKey, nestedValue] of Object.entries(record)) {
    if (nestedKey.toLowerCase() === 'metadata' && nestedValue && typeof nestedValue === 'object') {
      const metadataValue = getRecordValue(nestedValue as RecordLike, keys)
      if (metadataValue) {
        return metadataValue
      }
    }

    if (nestedValue && typeof nestedValue === 'object' && !Array.isArray(nestedValue)) {
      const nestedMatch = getRecordValue(nestedValue as RecordLike, keys)
      if (nestedMatch) {
        return nestedMatch
      }
    }
  }

  return null
}

function buildCountMap(records: RecordLike[], keys: string[]): CountMap {
  const counts: CountMap = new Map()

  for (const record of records) {
    const value = getRecordValue(record, keys)
    if (!value) {
      continue
    }

    const label = value.trim()
    counts.set(label, (counts.get(label) ?? 0) + 1)
  }

  return counts
}

function getHighest(counts: CountMap): [string, number] {
  let bestKey = ''
  let bestValue = -1

  for (const [key, value] of counts.entries()) {
    if (value > bestValue) {
      bestValue = value
      bestKey = key
    }
  }

  return [bestKey, bestValue]
}

function getLowest(counts: CountMap): [string, number] {
  let worstKey = ''
  let worstValue = Number.POSITIVE_INFINITY

  for (const [key, value] of counts.entries()) {
    if (value < worstValue) {
      worstValue = value
      worstKey = key
    }
  }

  return [worstKey, worstValue]
}

function formatList(lines: string[]): string {
  return lines.join('\n')
}

function buildDistributionAnswer(title: string, counts: CountMap, chart: InsightResponse['chart']): InsightResponse {
  const sorted = [...counts.entries()].sort(([, left], [, right]) => right - left)

  if (sorted.length === 0) {
    return unsupportedResponse()
  }

  const [topLabel, topValue] = sorted[0]
  const topFive = sorted.slice(0, 5)
  const rankingLines = topFive.map(([label, value], index) => `${index + 1}. ${label} — ${value}`)

  return {
    answer: formatList([
      title,
      '',
      `Summary: ${topLabel} has the highest count with ${topValue} entries.`,
      '',
      'Statistics:',
      `- Total categories: ${sorted.length}`,
      `- Top 5:`,
      ...rankingLines,
    ]),
    chart,
  }
}

function buildSingleValueAnswer(title: string, summary: string, chart: InsightResponse['chart']): InsightResponse {
  return {
    answer: formatList([title, '', summary]),
    chart,
  }
}

function buildRankedAnswer(title: string, counts: CountMap, chart: InsightResponse['chart']): InsightResponse {
  const sorted = [...counts.entries()].sort(([, left], [, right]) => right - left)

  if (sorted.length === 0) {
    return unsupportedResponse()
  }

  const topFive = sorted.slice(0, 5)
  const rankingLines = topFive.map(([label, value], index) => `${index + 1}. ${label} — ${value}`)

  return {
    answer: formatList([
      title,
      '',
      'Summary:',
      `- ${sorted[0][0]} leads with ${sorted[0][1]} entries.`,
      '',
      'Top 5:',
      ...rankingLines,
    ]),
    chart,
  }
}

function isHelpQuery(lower: string): boolean {
  return lower === 'help' || lower === 'supported' || lower === 'what can you do'
}

function isHighLevelQuestion(lower: string): boolean {
  return lower.includes('highest') || lower.includes('top') || lower.includes('most') || lower.includes('most recordings')
}

function isLowLevelQuestion(lower: string): boolean {
  return lower.includes('lowest') || lower.includes('least') || lower.includes('fewest')
}

function isDistributionQuestion(lower: string): boolean {
  return lower.includes('distribution') || lower.includes('breakdown') || lower.includes('overview')
}

function isCountQuestion(lower: string): boolean {
  return lower.includes('how many') || lower.includes('total') || lower.includes('count') || lower.includes('number of')
}

function isLanguageQuery(lower: string): boolean {
  return lower.includes('language') || lower.includes('lang')
}

function isMediaQuery(lower: string): boolean {
  return lower.includes('media') || lower.includes('audio') || lower.includes('video') || lower.includes('image') || lower.includes('text') || lower.includes('document') || lower.includes('recording')
}

function isContributorQuery(lower: string): boolean {
  return lower.includes('contributor') || lower.includes('contributors') || lower.includes('leaderboard') || lower.includes('ranking')
}

function isInstitutionQuery(lower: string): boolean {
  return lower.includes('institution') || lower.includes('organisation') || lower.includes('organization') || lower.includes('college')
}

function isDistrictQuery(lower: string): boolean {
  return lower.includes('district')
}

function isStateQuery(lower: string): boolean {
  return lower.includes('state')
}

function isCategoryQuery(lower: string): boolean {
  return lower.includes('category') || lower.includes('genre') || lower.includes('type')
}

function isGenderQuery(lower: string): boolean {
  return lower.includes('gender') || lower.includes('sex')
}

function isDeviceQuery(lower: string): boolean {
  return lower.includes('device') || lower.includes('platform')
}

function isRecordsQuery(lower: string): boolean {
  return lower.includes('total records') || lower.includes('number of records') || lower.includes('record count') || lower.includes('how many records') || lower.includes('dataset size')
}

function unsupportedResponse(): InsightResponse {
  return {
    answer: UNKNOWN_ANSWER,
    chart: 'none',
  }
}

export const getInsight = async (question: string): Promise<InsightResponse> => {
  const lower = question.trim().toLowerCase()

  if (isHelpQuery(lower)) {
    return {
      answer: formatList([
        'Corpus Insights',
        '',
        'I can analyze the current corpus data for:',
        '- language distribution and highest/lowest languages',
        '- media and device distributions',
        '- contributor rankings',
        '- institution, district, state, category, and gender counts',
        '- total records',
      ]),
      chart: 'none',
    }
  }

  const records = (await getRecords(0, 1000)) as RecordLike[]

  if (!records.length) {
    return unsupportedResponse()
  }

  if (isRecordsQuery(lower)) {
    return buildSingleValueAnswer(
      'Corpus Insights',
      `Summary: There are ${records.length} records in the current corpus dataset.`,
      'none',
    )
  }

  if (isLanguageQuery(lower)) {
    const counts = buildCountMap(records, LANGUAGE_KEYS)
    if (counts.size === 0) {
      return unsupportedResponse()
    }

    if (isDistributionQuestion(lower) || lower.includes('distribution')) {
      return buildDistributionAnswer('Language Insights', counts, 'language')
    }

    if (isLowLevelQuestion(lower)) {
      const [label, value] = getLowest(counts)
      return buildSingleValueAnswer('Language Insights', `Summary: ${label} has the lowest number of recordings (${value}).`, 'language')
    }

    if (isHighLevelQuestion(lower) || isCountQuestion(lower)) {
      const [label, value] = getHighest(counts)
      return buildSingleValueAnswer('Language Insights', `Summary: ${label} has the highest number of recordings (${value}).`, 'language')
    }

    return buildDistributionAnswer('Language Insights', counts, 'language')
  }

  if (isMediaQuery(lower)) {
    const counts = buildCountMap(records, MEDIA_KEYS)
    if (counts.size === 0) {
      return unsupportedResponse()
    }

    if (isDistributionQuestion(lower) || lower.includes('distribution')) {
      return buildDistributionAnswer('Media Insights', counts, 'mediaType')
    }

    if (isHighLevelQuestion(lower) || isLowLevelQuestion(lower)) {
      const [label, value] = getHighest(counts)
      return buildSingleValueAnswer('Media Insights', `Summary: ${label} has the highest number of recordings (${value}).`, 'mediaType')
    }

    return buildDistributionAnswer('Media Insights', counts, 'mediaType')
  }

  if (isDeviceQuery(lower)) {
    const counts = buildCountMap(records, DEVICE_KEYS)
    if (counts.size === 0) {
      return unsupportedResponse()
    }

    return buildDistributionAnswer('Device Insights', counts, 'none')
  }

  if (isContributorQuery(lower)) {
    const counts = buildCountMap(records, CONTRIBUTOR_KEYS)
    if (counts.size === 0) {
      return unsupportedResponse()
    }

    if (isCountQuestion(lower) || lower.includes('total contributors')) {
      const contributorCount = counts.size
      return buildSingleValueAnswer('Contributor Insights', `Summary: There are ${contributorCount} contributors represented in the available corpus data.`, 'leaderboard')
    }

    return buildRankedAnswer('Contributor Insights', counts, 'leaderboard')
  }

  if (isInstitutionQuery(lower)) {
    const counts = buildCountMap(records, INSTITUTION_KEYS)
    if (counts.size === 0) {
      return unsupportedResponse()
    }

    return buildDistributionAnswer('Institution Insights', counts, 'none')
  }

  if (isDistrictQuery(lower)) {
    const counts = buildCountMap(records, DISTRICT_KEYS)
    if (counts.size === 0) {
      return unsupportedResponse()
    }

    return buildDistributionAnswer('District Insights', counts, 'none')
  }

  if (isStateQuery(lower)) {
    const counts = buildCountMap(records, STATE_KEYS)
    if (counts.size === 0) {
      return unsupportedResponse()
    }

    return buildDistributionAnswer('State Insights', counts, 'none')
  }

  if (isCategoryQuery(lower)) {
    const counts = buildCountMap(records, CATEGORY_KEYS)
    if (counts.size === 0) {
      return unsupportedResponse()
    }

    return buildDistributionAnswer('Category Insights', counts, 'none')
  }

  if (isGenderQuery(lower)) {
    const counts = buildCountMap(records, GENDER_KEYS)
    if (counts.size === 0) {
      return unsupportedResponse()
    }

    return buildDistributionAnswer('Gender Insights', counts, 'none')
  }

  return unsupportedResponse()
}
