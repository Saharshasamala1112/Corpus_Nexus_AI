import { useLocation } from "react-router-dom";
import AIAssistant from "../../components/explorer/AIAssistant";

export default function RecordDetails() {
    const location = useLocation();
    const record: any = location.state;

    if (!record) {
        return <h2>No record selected.</h2>;
    }

    return (
        <div style={{ padding: "20px" }}>
            <h1>{record.title || record.username}</h1>

            <p>
                <strong>Description:</strong>{" "}
                {record.description || "No description"}
            </p>

            <p>
                <strong>Language:</strong>{" "}
                {record.language || "N/A"}
            </p>

            <p>
                <strong>Category:</strong>{" "}
                {record.category || "N/A"}
            </p>

            <AIAssistant record={record} />
        </div>
    );
}