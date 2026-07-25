const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8001";

export async function askAssistant(record: any, question: string) {
    const context = [
        record?.title && `Title: ${record.title}`,
        record?.description && `Description: ${record.description}`,
        record?.category && `Category: ${record.category}`,
        record?.language && `Language: ${record.language}`,
    ]
        .filter(Boolean)
        .join("\n");

    const res = await fetch(`${BASE_URL}/assistant/chat`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            question,
            context,
        }),
    });

    return await res.json();
}