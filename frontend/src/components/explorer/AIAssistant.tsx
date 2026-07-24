import { useState } from "react";
import { askAssistant } from "../../api/assistant";

interface Props {
    record: any;
}

export default function AIAssistant({ record }: Props) {

    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleAsk() {

        if (!question.trim()) {
            return;
        }

        try {

            setLoading(true);
            setAnswer("");

            const res = await askAssistant(record, question);

            setAnswer(res.answer);

        } catch (error) {

            console.error(error);

            setAnswer(
                "Unable to get an AI response. Please try again."
            );

        } finally {

            setLoading(false);

        }

    }

    return (

        <div
            style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "16px",
                marginTop: "20px",
            }}
        >

            <h2>🤖 AI Assistant</h2>

            <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask about this record..."
                style={{
                    width: "100%",
                    padding: "10px",
                    marginBottom: "10px",
                }}
            />

            <button
                onClick={handleAsk}
                disabled={loading}
            >
                {loading ? "Thinking..." : "Ask"}
            </button>

            {loading && (
                <p>Thinking...</p>
            )}

            {answer && (

                <div
                    style={{
                        marginTop: "15px",
                    }}
                >

                    <strong>Answer:</strong>

                    <p>{answer}</p>

                </div>

            )}

        </div>

    );

}