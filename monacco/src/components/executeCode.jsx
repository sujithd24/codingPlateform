console.log("User Input:", userInput);
if (userInput.trim() === "") {
    alert("Please enter a valid input.");
    return;
  }
  const requestBody = {
    language: "python",
    version: "3.11.0",
    files: [{ name: "code.py", content: code }],  // Added 'name' property
    stdin: userInput,
  };
  fetch("https://emkc.org/api/v2/piston/execute", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestBody),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("API Response:", data);
      if (data.run && data.run.stdout) {
        console.log("Output:", data.run.stdout);
      } else if (data.run && data.run.stderr) {
        console.log("Error:", data.run.stderr);
      }
    })
    .catch(error => console.error("Request error:", error));
      