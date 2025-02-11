

import Monaco from "../../pages/monaco/Monaco";
import { useSearchParams } from "react-router-dom";

const QuestionDetailPage = () => {
    const [searchParams] = useSearchParams();
    const questionString = searchParams.get("data");
    const question = JSON.parse(questionString);

    if (!question) {
        return <div>Question not found</div>;
    }

    return (
        <div style={{  display: "flex",background:"#9F7AE4" }}>
            <div style={{ width: "40%", padding: "16px", borderRight: "1px solid #ccc" }}>
                <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "0.5rem" }}>{question.question}</h2>
                <p>{question.description}</p>
            </div>
            <div style={{ width: "60%", padding: "16px" }}>
                <Monaco description={question.description} />
            </div>
        </div>
    );
};

export default QuestionDetailPage;
