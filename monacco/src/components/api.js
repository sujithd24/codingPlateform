 import axios from "axios";
import { LANGUAGE_VERSIONS } from "../constants";

const API = axios.create({
    baseURL: "https://emkc.org/api/v2/piston",   
});

export const executeCode = async (language, sourceCode, stdin = "") => { // Add stdin as a parameter
    const response = await API.post("/execute", {
        language: language,
        version: LANGUAGE_VERSIONS[language],
        files: [
          {
            content: sourceCode,
          },
        ],
        stdin: stdin, // Pass stdin in the request
    });
    return response.data;
};
