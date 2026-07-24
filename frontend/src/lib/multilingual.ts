import type { CorpusRecord } from "@/types/corpusExplorer";

/**
 * Get the primary multilingual text content from a corpus record
 * Checks for sentence, text, transcription, transcript, prompt, and content fields
 */
export function getMultilingualContent(record: CorpusRecord): string {
    // DEBUG: Log for Hindi records to inspect field content
    const isHindi = record.language && record.language.toLowerCase().includes("hindi");
    
    if (isHindi) {
        console.debug("[MULTILINGUAL] Hindi record detected:", {
            id: record.id,
            language: record.language,
            languageLowercase: record.language?.toLowerCase(),
            title: record.title,
            titleLength: record.title?.length,
            availableFields: {
                sentence: record.sentence ? `[${record.sentence.length} chars] ${record.sentence.substring(0, 100)}` : null,
                text: record.text ? `[${record.text.length} chars] ${record.text.substring(0, 100)}` : null,
                transcription: record.transcription ? `[${record.transcription.length} chars] ${record.transcription.substring(0, 100)}` : null,
                transcript: record.transcript ? `[${record.transcript.length} chars] ${record.transcript.substring(0, 100)}` : null,
                prompt: record.prompt ? `[${record.prompt.length} chars] ${record.prompt.substring(0, 100)}` : null,
                content: record.content ? `[${record.content.length} chars] ${record.content.substring(0, 100)}` : null,
                description: record.description ? `[${record.description.length} chars] ${record.description.substring(0, 100)}` : null,
            },
        });
    }

    // Priority order: sentence > text > transcription > transcript > prompt > content
    const content =
        record.sentence ||
        record.text ||
        record.transcription ||
        record.transcript ||
        record.prompt ||
        record.content ||
        record.description ||
        record.title;

    if (isHindi) {
        console.debug("[MULTILINGUAL] Hindi record selected field:", {
            id: record.id,
            selectedContent: content ? `[${content.length} chars] ${content}` : null,
            contentCharCodes: content ? Array.from(content.substring(0, 20)).map((c) => `U+${c.charCodeAt(0).toString(16).toUpperCase().padStart(4, "0")}`) : null,
        });
    }

    return content;
}

/**
 * Get the appropriate CSS class for a language
 */
export function getLanguageClass(language: string | null | undefined): string {
    if (!language) return "multilingual-text";

    const lang = language.toLowerCase().trim();

    // DEBUG: Log language class detection
    console.debug("[LANGUAGE_CLASS] Language detection:", { original: language, normalized: lang });

    // Map language names/codes to CSS classes
    if (lang.includes("telugu") || lang === "te" || lang === "telugu" || lang.startsWith("te-")) {
        return "telugu-text";
    }
    if (lang.includes("hindi") || lang === "hi" || lang === "hindi" || lang.startsWith("hi-")) {
        console.debug("[LANGUAGE_CLASS] Selected hindi-text class for:", lang);
        return "hindi-text";
    }
    if (lang.includes("kannada") || lang === "kn" || lang === "kannada" || lang.startsWith("kn-")) {
        return "kannada-text";
    }
    if (lang.includes("tamil") || lang === "ta" || lang === "tamil" || lang.startsWith("ta-")) {
        return "tamil-text";
    }
    if (lang.includes("malayalam") || lang === "ml" || lang === "malayalam" || lang.startsWith("ml-")) {
        return "malayalam-text";
    }

    console.debug("[LANGUAGE_CLASS] Using fallback multilingual-text for:", lang);
    return "multilingual-text";
}
