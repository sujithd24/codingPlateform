import "./QuestionCards.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Flex,
  ModalFooter, // Import ModalFooter
} from "@chakra-ui/react";
import Monaco from "../../pages/monaco/Monaco";

const QuestionGenerator = () => {
  const [expandedEditor, setExpandedEditor] = useState(null);
  const [difficulty, setDifficulty] = useState("");
  const [totalMarks, setTotalMarks] = useState("");
  const [mcqPercentage, setMcqPercentage] = useState("");
  const [codingPercentage, setCodingPercentage] = useState("");
  const [questions, setQuestions] = useState(null);
  const [selectedQuestions, setSelectedQuestions] = useState({
    mcq: [],
    coding2: [],
    coding5: [],
  });
  const [selectedOptions, setSelectedOptions] = useState({});

  // State for Modal
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [codeResponse, setCodeResponse] = useState(""); // State to hold code response


  const navigate = useNavigate();

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const response = await fetch("/questions.json");
        if (!response.ok)
          throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        setQuestions(data);
      } catch (err) {
        console.error("Error loading questions:", err);
        alert("Failed to load questions. Check your JSON file.");
      }
    };

    loadQuestions();
  }, []);

  const handleOptionChange = (questionIndex, optionKey) => {
    setSelectedOptions({
      ...selectedOptions,
      [questionIndex]: optionKey,
    });
  };

  // Function to open modal
  const openModal = (question) => {
    setSelectedQuestion(question);
    setIsModalOpen(true);
  };

  // Function to close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedQuestion(null);
  };

    // Function to handle code response
    const handleCodeChange = (value) => {
      setCodeResponse(value);
  };

  // Function to handle submit
  const handleSubmit = () => {
      // Handle submission logic here, e.g., send codeResponse to an API
      console.log("Submitted code:", codeResponse);
      closeModal(); // Close modal after submission
  };


  const generateQuestions = () => {
    if (!difficulty) return alert("Please select a difficulty level.");
    if (!totalMarks || !mcqPercentage || !codingPercentage)
      return alert("Fill all fields.");
    if (parseFloat(mcqPercentage) + parseFloat(codingPercentage) !== 100)
      return alert("Percentages must add up to 100.");
    if (!questions || !questions[difficulty])
      return alert(`Questions not available for "${difficulty}" difficulty.`);

    let mcqMarks = (parseFloat(mcqPercentage) / 100) * parseFloat(totalMarks);
    let codingMarks =
      (parseFloat(codingPercentage) / 100) * parseFloat(totalMarks);

    let mcqCount = Math.floor(mcqMarks / 1);
    let remainingMarks = codingMarks;

    let available2Mark = questions[difficulty].coding_2mark.length;
    let available5Mark = questions[difficulty].coding_5mark.length;

    let coding5Count = Math.floor(remainingMarks / 5);
    if (coding5Count > available5Mark) coding5Count = available5Mark;
    remainingMarks -= coding5Count * 5;

    let coding2Count = Math.floor(remainingMarks / 2);
    if (coding2Count > available2Mark) coding2Count = available2Mark;
    remainingMarks -= coding2Count * 2;

    while (remainingMarks >= 2 && coding2Count < available2Mark) {
      coding2Count++;
      remainingMarks -= 2;
    }

    const mcqQuestions = questions[difficulty].mcq
      .sort(() => Math.random() - 0.5)
      .slice(0, mcqCount);
    const coding2Questions = questions[difficulty].coding_2mark
      .sort(() => Math.random() - 0.5)
      .slice(0, coding2Count)
      .map((q) => ({ ...q, marks: 2 }));
    const coding5Questions = questions[difficulty].coding_5mark
      .sort(() => Math.random() - 0.5)
      .slice(0, coding5Count)
      .map((q) => ({ ...q, marks: 5 }));

    setSelectedQuestions({
      mcq: mcqQuestions,
      coding2: coding2Questions,
      coding5: coding5Questions,
    });
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Question Generator</h2>
      <div className="space-y-2">
        <select
          className="w-full p-2 border rounded"
          onChange={(e) => setDifficulty(e.target.value)}
        >
          <option value="">Select Difficulty</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
        <input
          className="w-full p-2 border rounded"
          type="number"
          placeholder="Total Marks"
          onChange={(e) => setTotalMarks(e.target.value)}
        />
        <input
          className="w-full p-2 border rounded"
          type="number"
          placeholder="MCQ Percentage"
          onChange={(e) => setMcqPercentage(e.target.value)}
        />
        <input
          className="w-full p-2 border rounded"
          type="number"
          placeholder="Coding Percentage"
          onChange={(e) => setCodingPercentage(e.target.value)}
        />

        <button
          className="w-full bg-blue-500 text-white p-2 rounded mt-2"
          onClick={generateQuestions}
          disabled={!questions}
        >
          Generate Questions
        </button>
      </div>

      {selectedQuestions.mcq.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">MCQ Questions</h3>
          {selectedQuestions.mcq.map((q, index) => (
            <div
              key={index}
              className="p-2 border rounded mt-2 bg-white shadow-md"
            >
              <p className="font-medium">
                {index + 1}. {q.question}
              </p>
              <ul className="list-none pl-0">
                {q.options &&
                  Object.entries(q.options).map(([key, value]) => (
                    <li key={key} className="text-gray-700">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name={`mcq-${index}`}
                          value={key}
                          checked={selectedOptions[index] === key}
                          onChange={() => handleOptionChange(index, key)}
                          className="mr-2"
                        />
                        <b>{key.toUpperCase()}.</b> {value}
                      </label>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Coding Questions */}
      {selectedQuestions.coding2.concat(selectedQuestions.coding5).length >
        0 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Coding Questions</h3>
          {selectedQuestions.coding2
            .concat(selectedQuestions.coding5)
            .map((q, index) => (
              <div
                key={index}
                className="p-2 border rounded mt-2 bg-white shadow-md"
              >
                <p className="font-medium">
                  {index + 1}. ({q.marks} Marks) {q.question}
                </p>
                {/* Open question in modal instead of new page */}
                <button
                  onClick={() => openModal(q)}
                  className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
                >
                  View
                </button>
              </div>
            ))}
        </div>
      )}

      {/* Modal for displaying question details and editor */}
      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={closeModal} size="full">
          <ModalOverlay />
          <ModalContent
           sx={{
            bg: "#9F7AE4", // Change background color of ModalContent
          }}>
            <ModalHeader>Question Details</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {/* Flex container for layout */}
              <Flex>
                {/* Left side for question */}
                <div style={{ flex: "1", paddingRight: "10px" }}>
                  {selectedQuestion && (
                    <>
                      <h3>{selectedQuestion.question}</h3>
                      {/* Add more details as necessary */}
                    </>
                  )}
                </div>

                {/* Right side for editor */}
                <div style={{ flex: "1" }}>
                  {/* Monaco Editor */}
                  <Monaco
                      height="400px"
                      language="javascript"
                      theme="vs-dark"
                      options={{ selectOnLineNumbers: true }}
                      onChange={handleCodeChange}
                  />
                </div>
              </Flex>
            </ModalBody>
             {/* Modal Footer with Buttons */}
             <ModalFooter>
                  <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
                      Submit
                  </Button>
                  <Button onClick={closeModal}>Close</Button>
              </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </div>
  );
};

export default QuestionGenerator;
