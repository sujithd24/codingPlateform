import { Box} from "@chakra-ui/react";
import CodeEditor from "../../components/CodeEditor";

function Monaco({description, testcases}) {
  

  return (
    <Box className="monaco" minH="50vh" bg='#0f0a19' color='gray.500' px={6} py={4}>
      <CodeEditor testcases={testcases} />
    </Box>
      
  );
}

export default Monaco   