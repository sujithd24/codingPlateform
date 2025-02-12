import Monaco from "../../pages/monaco/Monaco";
import { useSearchParams } from "react-router-dom";

const QuestionDetailPage = () => {
    const [searchParams] = useSearchParams();
    const questionString = searchParams.get("data");

    let question = null;
    try {
        if (questionString) {
            question = JSON.parse(decodeURIComponent(questionString)); // Decode safely
        }
    } catch (error) {
        console.error("Error parsing question data:", error);
    }

    if (!question) {
        return <div>Question not found or invalid data.</div>;
    }

    console.log("Test Cases:", question.test_cases); // Debugging

    return (
        <div style={{ display: "flex", background: "#9F7AE4" }}>
            <div style={{ width: "40%", padding: "16px", borderRight: "1px solid #ccc" }}>
                <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "0.5rem" }}>
                    {question.question}
                </h2>
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
            <div style={{ width: "60%", padding: "16px" }}>
                <Monaco description={question.description} testcases={question.test_cases || []} />
            </div>
        </div>
    );
};

export default QuestionDetailPage;
