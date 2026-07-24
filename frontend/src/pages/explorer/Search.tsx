import { useState } from "react";
import { searchRecords } from "../../services/api";
import ResultCard from "../../components/explorer/ResultCard";

export default function Search() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [error, setError] = useState("");

    async function handleSearch() {
        try {
            setError("");

            const data = await searchRecords(query);

            console.log("Received:", data);

            setResults(data);
        } catch (err) {
            console.error(err);
            setError("Unable to fetch records");
        }
    }

    return (
        <div className="container">
            <h1>Search Page</h1>

            <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search here"
            />

            <button onClick={handleSearch}>
                Search
            </button>

            {error && (
                <p style={{ color: "red" }}>
                    {error}
                </p>
            )}

            <div>
                {results.length === 0 ? (
                    <p>No records found.</p>
                ) : (
                    results.map((item: any) => (
                        <ResultCard
                            key={item.uid}
                            item={item}
                        />
                    ))
                )}
            </div>
        </div>
    );
}