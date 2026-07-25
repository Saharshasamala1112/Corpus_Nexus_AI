import { getLanguages } from "./languageService";
import { getLeaderboard } from "./leaderboardService";
import { getRecords } from "./recordsService";

export type CorpusIntent = "records" | "contributors" | "institutions" | "languages" | "locations" | "media" | "metadata" | "search" | "general";

export interface CorpusQueryResolution {
    isCorpusQuestion: boolean;
    intent: CorpusIntent;
    context?: string;
    answer?: string;
    sourceCount: number;
    confidence: number;
}

interface CorpusRecordLike {
    id?: string | number;
    uid?: string;
    title?: string;
    description?: string;
    language?: string;
    media_type?: string;
    category?: string;
    sentence?: string;
    text?: string;
    transcript?: string;
    transcription?: string;
    content?: string;
    metadata?: Record<string, unknown>;
    location?: {
        latitude?: number;
        longitude?: number;
    };
    contributor?: string;
    uploaded_by?: string;
    uploader?: string;
    speaker?: string;
    author?: string;
    institution?: string;
    institution_name?: string;
    organisation?: string;
    organization?: string;
    college?: string;
    district?: string;
    state?: string;
    city?: string;
    location_name?: string;
}

function normalizeText(value?: string | null): string {
    return (value ?? "").toLowerCase().trim();
}

function toRecordText(record: CorpusRecordLike): string {
    const metadataValues = Object.entries(record.metadata ?? {})
        .map(([key, value]) => `${key}: ${String(value ?? "")}`)
        .join(" ");

    return [
        record.title,
        record.description,
        record.language,
        record.category,
        record.media_type,
        record.sentence,
        record.text,
        record.transcript,
        record.transcription,
        record.content,
        record.contributor,
        record.uploaded_by,
        record.uploader,
        record.speaker,
        record.author,
        record.institution,
        record.institution_name,
        record.organisation,
        record.organization,
        record.college,
        record.district,
        record.state,
        record.city,
        record.location_name,
        metadataValues,
    ]
        .filter(Boolean)
        .join(" ");
}

function extractInstitutionName(record: CorpusRecordLike): string | undefined {
    return [
        record.institution,
        record.institution_name,
        record.organisation,
        record.organization,
        record.college,
        record.metadata?.institution,
        record.metadata?.institution_name,
        record.metadata?.organisation,
        record.metadata?.organization,
        record.metadata?.college,
    ]
        .find((value) => typeof value === "string" && value.trim().length > 0) as string | undefined;
}

function extractContributorName(record: CorpusRecordLike): string | undefined {
    return [
        record.contributor,
        record.uploaded_by,
        record.uploader,
        record.speaker,
        record.author,
        record.metadata?.contributor,
        record.metadata?.uploaded_by,
        record.metadata?.uploader,
        record.metadata?.speaker,
        record.metadata?.author,
    ]
        .find((value) => typeof value === "string" && value.trim().length > 0) as string | undefined;
}

function extractLocationTerms(record: CorpusRecordLike): string[] {
    const terms = [
        record.district,
        record.state,
        record.city,
        record.location_name,
        record.metadata?.district,
        record.metadata?.state,
        record.metadata?.city,
        record.metadata?.location,
    ].filter((value): value is string => typeof value === "string" && value.trim().length > 0);

    return terms.map((value) => value.toLowerCase());
}

function tokenizeQuestion(question: string): string[] {
    return question
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ")
        .split(/\s+/)
        .filter(Boolean);
}

function findLanguageHint(question: string, languages: Array<{ name?: string }>): string | undefined {
    const tokens = tokenizeQuestion(question);
    const names = languages
        .map((language) => language.name?.trim())
        .filter((value): value is string => Boolean(value));

    for (const token of tokens) {
        const match = names.find((name) => normalizeText(name).includes(token) || token.includes(normalizeText(name)));
        if (match) {
            return match;
        }
    }

    return undefined;
}

function detectIntent(question: string, languages: Array<{ name?: string }>): CorpusIntent {
    const lower = question.toLowerCase();

    if (/(contributor|contributors|uploaded by|uploaded|uploader|speaker|author)/.test(lower)) {
        return "contributors";
    }

    if (/(institution|institutions|organisation|organization|college|affiliation)/.test(lower)) {
        return "institutions";
    }

    if (/(district|state|location|locations|city|hyderabad|telangana|andhra|kerala|tamil|karnataka)/.test(lower)) {
        return "locations";
    }

    if (/(media|audio|video|image|recording|recordings)/.test(lower)) {
        return "media";
    }

    if (/(language|languages)/.test(lower)) {
        return "languages";
    }

    const languageHint = findLanguageHint(question, languages);
    if (languageHint) {
        return "languages";
    }

    if (/(keyword|contains|search|find|show|tell me about|similar|metadata|detail|details)/.test(lower)) {
        return "search";
    }

    if (/(record|records|corpus|dataset|transcript|transcriptions)/.test(lower)) {
        return "records";
    }

    return "general";
}

function matchRecord(record: CorpusRecordLike, question: string, intent: CorpusIntent, languageHint?: string): boolean {
    const lowerQuestion = question.toLowerCase();
    const haystack = toRecordText(record);
    const normalizedHaystack = normalizeText(haystack);

    if (intent === "languages") {
        if (languageHint) {
            return normalizedHaystack.includes(normalizeText(languageHint));
        }
        return Boolean(record.language && normalizeText(record.language).length > 0);
    }

    if (intent === "contributors") {
        const contributor = extractContributorName(record);
        if (!contributor) {
            return false;
        }
        const contributorText = normalizeText(contributor);
        const questionTokens = tokenizeQuestion(question).filter((token) => token.length > 2);
        return questionTokens.every((token) => contributorText.includes(token) || normalizedHaystack.includes(token));
    }

    if (intent === "institutions") {
        const institution = extractInstitutionName(record);
        if (!institution) {
            return false;
        }
        return normalizeText(institution).includes(normalizeText(question)) || normalizedHaystack.includes(normalizeText(question));
    }

    if (intent === "locations") {
        const terms = extractLocationTerms(record);
        const questionTerms = tokenizeQuestion(question).filter((token) => token.length > 2);
        return questionTerms.some((token) => terms.some((term) => term.includes(token) || token.includes(term)));
    }

    if (intent === "media") {
        const mediaTerms = [record.media_type, record.metadata?.media_type].filter((value): value is string => typeof value === "string" && value.trim().length > 0);
        return mediaTerms.some((value) => normalizeText(value).includes(normalizeText(question)) || normalizeText(value).includes(lowerQuestion));
    }

    if (intent === "search") {
        const terms = tokenizeQuestion(question).filter((token) => token.length > 2);
        return terms.some((token) => normalizedHaystack.includes(token));
    }

    if (/\b(\d+)\b/.test(lowerQuestion)) {
        const match = lowerQuestion.match(/\b(\d+)\b/);
        if (match) {
            const candidate = match[1];
            return [String(record.id ?? ""), String(record.uid ?? ""), String(record.metadata?.id ?? "")].some((value) => value.includes(candidate));
        }
    }

    return normalizedHaystack.includes(normalizeText(question)) || normalizedHaystack.includes(lowerQuestion);
}

function buildContext(records: CorpusRecordLike[], question: string, intent: CorpusIntent, languageHint?: string): string {
    const matched = records.filter((record) => matchRecord(record, question, intent, languageHint));
    const topMatches = matched.slice(0, 8);

    if (topMatches.length === 0) {
        return "";
    }

    const summaries = topMatches.map((record) => {
        const parts = [
            record.title && `Title: ${record.title}`,
            record.description && `Description: ${record.description}`,
            record.language && `Language: ${record.language}`,
            record.category && `Category: ${record.category}`,
            record.media_type && `Media: ${record.media_type}`,
            extractContributorName(record) && `Contributor: ${extractContributorName(record)}`,
            extractInstitutionName(record) && `Institution: ${extractInstitutionName(record)}`,
            record.metadata && `Metadata: ${JSON.stringify(record.metadata)}`,
        ].filter(Boolean);

        return parts.join(" | ");
    });

    return [
        "Corpus context:",
        `- Intent: ${intent}`,
        `- Matched records: ${topMatches.length}`,
        "- Relevant records:",
        ...summaries.map((summary) => `  • ${summary}`),
    ].join("\n");
}

export async function resolveCorpusQuery(question: string): Promise<CorpusQueryResolution> {
    const lower = normalizeText(question);
    if (!lower.trim()) {
        return { isCorpusQuestion: false, intent: "general", sourceCount: 0, confidence: 0.0 };
    }

    const corpusSignals = [
        "record",
        "records",
        "corpus",
        "recording",
        "recordings",
        "contributor",
        "contributors",
        "uploaded",
        "upload",
        "speaker",
        "institution",
        "institutions",
        "organisation",
        "organization",
        "college",
        "district",
        "state",
        "location",
        "locations",
        "metadata",
        "media",
        "keyword",
        "search",
        "find",
        "show",
        "tell me about",
        "similar",
        "language",
        "languages",
        "transcript",
        "transcriptions",
    ];

    const isCorpusQuestion = corpusSignals.some((signal) => lower.includes(signal));
    if (!isCorpusQuestion) {
        return { isCorpusQuestion: false, intent: "general", sourceCount: 0, confidence: 0.0 };
    }

    try {
        const [records, languages, leaderboard] = await Promise.all([
            getRecords(0, 1000),
            getLanguages().catch(() => []),
            getLeaderboard().catch(() => []),
        ]);

        const normalizedRecords = (records as CorpusRecordLike[]).filter(Boolean);
        const languageHint = findLanguageHint(question, languages);
        const intent = detectIntent(question, languages);
        const context = buildContext(normalizedRecords, question, intent, languageHint);

        if (!context) {
            return {
                isCorpusQuestion: true,
                intent,
                answer: "No matching corpus records were found.",
                sourceCount: 0,
                confidence: 0.4,
            };
        }

        return {
            isCorpusQuestion: true,
            intent,
            context: [
                context,
                `- Available languages: ${languages.length}`,
                `- Leaderboard entries: ${leaderboard.length}`,
            ].join("\n"),
            sourceCount: normalizedRecords.filter((record) => matchRecord(record, question, intent, languageHint)).length,
            confidence: 0.9,
        };
    } catch {
        return {
            isCorpusQuestion: true,
            intent: "general",
            answer: "Unable to retrieve corpus information at the moment.",
            sourceCount: 0,
            confidence: 0.0,
        };
    }
}
