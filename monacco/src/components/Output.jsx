import { createContext, useState } from "react";
import { Box, Button, Text, Textarea, useToast } from "@chakra-ui/react";
import { executeCode } from "./api";

export const UserContext = createContext();
const Output = ({ editorRef, language }) => {
  const toast = useToast();
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [userInput, setUserInput] = useState(""); // State for user input



  const runCode = async () => {
    const sourceCode = editorRef.current.getValue();
    if (!sourceCode) return;

    // Check if the code likely requires input
    const requiresInput = sourceCode.includes("scanf") || sourceCode.includes("input");

    if (requiresInput && !userInput.trim()) {  // Only show warning if input is required
      toast({
        title: "Input Required",
        description: "Please enter input before running the code.",
        status: "warning",
        duration: 4000,
      });
      return;
    }

    try {
      setIsLoading(true);
      const { run: result } = await executeCode(language, sourceCode, requiresInput ? userInput : ""); // Only pass input if needed
      setOutput(result.output.split("\n"));
      window.localStorage.setItem("output", result.output);
      result.stderr ? setIsError(true) : setIsError(false);
    } catch (error) {
      console.log(error);
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
      
      {/* Input Field for User Input */}
      <Textarea
        placeholder="Enter input here (optional if code doesn’t require it)"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        mb={4}
      />

      <Button variant="outline" colorScheme="green" mb={4} isLoading={isLoading} onClick={runCode}>
        Run Code
      </Button>

      <Box
        height="75vh"
        p={2}
        color={isError ? "red.400" : ""}
        border="1px solid"
        borderRadius={4}
        borderColor={isError ? "red.500" : "#333"}
      >
        {output ? 
          output.map((line, i) => <Text key={i}>{line}</Text>)
          : 'Click "Run Code" to see the output here'}

      </Box>  
    </Box>
    </UserContext.Provider>
  );
};

export default Output;
