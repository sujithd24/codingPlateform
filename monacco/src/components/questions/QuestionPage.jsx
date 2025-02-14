import Monaco from "../../pages/monaco/Monaco";
import { useSearchParams, useNavigate } from "react-router-dom";

const QuestionDetailPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const questionString = searchParams.get("data");

    let question = null;
    try {
        if (questionString) {
            question = JSON.parse(decodeURIComponent(questionString));
        }
    } catch (error) {
        console.error("Error parsing question data:", error);
    }

    if (!question) {
        return <div>Question not found or invalid data.</div>;
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: "#6b4eff" }}>
            <div style={{ display: "flex", flex: 1 }}>
                <div style={{ width: "40%", padding: "16px", borderRight: "1px solid #ccc", background: "#6b4eff" }}>
                    <h2>{question.question}</h2>
                    <p>{question.description}</p>
                    <h3>Test Cases:</h3>
                    <ul>
                        {question.test_cases?.map((tc, index) => (
                            <li key={index}>
                                <b>Input:</b> {JSON.stringify(tc.input)} | <b>Output:</b> {JSON.stringify(tc.output)}
                            </li>
                        ))}
                    </ul>
                </div>
                <div style={{ width: "60%", padding: "16px", background: "#6b4eff" }}>
                    <Monaco description={question.description} testcases={question.test_cases || []} />
                </div>
            </div>

            {/* Buttons Section */}
            <div style={{ display: "flex", justifyContent: "flex-end", padding: "16px", background: "#6b4eff", borderTop: "1px solid #ccc" }}>
                <button onClick={() => navigate(-1)} style={buttonStyle}>Close</button>
                <button style={{ ...buttonStyle, background: "#4CAF50" }}>Submit</button>
            </div>
        </div>
    );
};

// Button styling
const buttonStyle = {
    padding: "10px 20px",
    fontSize: "16px",
    border: "none",
    borderRadius: "5px",
    marginLeft: "10px",
    cursor: "pointer",
    background: "#f44336",
    color: "white",
};

export default QuestionDetailPage;
