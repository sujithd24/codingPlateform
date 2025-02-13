import { useState, useEffect } from "react";
import { Box, Button, Text, Textarea, useToast } from "@chakra-ui/react";
import { executeCode } from "./api";
const Output = ({ editorRef, language, testcases }) => {
  const toast = useToast();
  const [output, setOutput] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [testResults, setTestResults] = useState([]);



  const runCode = async () => {
    const sourceCode = editorRef.current.getValue();
    if (!sourceCode) return;
  
    if (!Array.isArray(testcases)) {
      console.error("Test cases are not an array:", testcases);
      toast({
        title: "Error",
        description: "Test cases must be an array.",
        status: "error",
        duration: 4000,
      });
      return;
    }
  
    try {
      setIsLoading(true);
      const results = [];
  
      for (const test of testcases) {
        const inputString = Array.isArray(test.input) ? test.input.join("\n") : test.input;
        const expectedOutput = Array.isArray(test.output) ? test.output.join("\n") : test.output;
  
        const { run: result } = await executeCode(language, sourceCode, inputString);
        const actualOutput = result.output.trim().toLowerCase();  // Normalize output
  
        // Normalize expected output (make it case-insensitive)
        const normalizedExpected = expectedOutput.toString().trim().toLowerCase();
  
        results.push({
          input: inputString,
          expected: normalizedExpected,
          actual: actualOutput,
          passed: actualOutput === normalizedExpected,
        });
      }
  
      setTestResults(results);
      setOutput(results.map(res => res.actual));
  
      const allPassed = results.every(res => res.passed);
      setIsError(!allPassed);
    } catch (error) {
      console.error(error);
      toast({
        title: "An error occurred.",
        description: error.message || "Unable to run code",
        status: "error",
        duration: 6000,
      });
    } finally {
      setIsLoading(false);
    }
  };
  


  return (
    <UserContext.Provider value={output}>
      <Box w="50%">
        <Text mb={2} fontSize="lg">Output</Text>

        <Textarea
          placeholder="Enter input here (if needed)"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          mb={4}
        />

        <Button variant="outline" colorScheme="green" mb={4} isLoading={isLoading} onClick={runCode}>
          Run Code
        </Button>

        <Box height="75vh" p={2} border="1px solid" borderRadius={4} borderColor={isError ? "red.500" : "#333"}>
          {testResults.length > 0 ? (
            testResults.map((test, index) => (
              <Box key={index} p={2} mb={2} border="1px solid" borderRadius={4} borderColor={test.passed ? "green.400" : "red.400"}>
                <Text><b>Input:</b> {test.input}</Text>
                <Text><b>Expected:</b> {test.expected}</Text>
                <Text><b>Actual:</b> {test.actual}</Text>
                <Text color={test.passed ? "green.400" : "red.400"}><b>Status:</b> {test.passed ? "✅ Passed" : "❌ Failed"}</Text>
              </Box>
            ))
          ) : (
            <Text>Click "Run Code" to see the output here</Text>
          )}
        </Box>
      </Box>
    </UserContext.Provider>
  );
};

export default Output;
