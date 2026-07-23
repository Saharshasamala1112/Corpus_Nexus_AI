import { Link } from "react-router-dom";
import "../styles/Home.css";

export default function Home() {
    return (
        <div className="home">

            <div className="hero">

                <h1>Corpus Explorer AI</h1>

                <p>
                    Search and explore Indian language datasets using
                    powerful filters and AI-assisted search.
                </p>

                <Link to="/search">
                    <button>
                        Start Exploring →
                    </button>
                </Link>

            </div>

        </div>
    );
}