import { useState } from "react";

// @mui material components
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import Radio from "@mui/material/Radio"; // Import Radio from MUI
import FormControlLabel from "@mui/material/FormControlLabel"; // For labeling the radio buttons

function Projects() {
  const [file, setFile] = useState(null); // Store the file object
  const [pdfURL, setPdfURL] = useState(""); // Store the PDF URL
  const [errorMessage, setErrorMessage] = useState(""); // Store error messages
  const [outputType, setOutputType] = useState("transcription"); // Default to "transcription"
  const [transcriptionText, setTranscriptionText] = useState(""); // Store the PDF URL
  const [isLoading, setIsLoading] = useState(false);

  // Function to handle file selection
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile); // Save the file to state
    }
  };

  const uploadFile = () => {
    if (!file) {
      setErrorMessage("No file selected.");
      return;
    }

    setIsLoading(true);

    // Determine the correct endpoint based on the selected output type
    const endpoint = outputType === "pdf" ? "/upload_sound_pdf" : "/upload_sound_transcription";
    const url = `http://127.0.0.1:5000${endpoint}`; // Construct the full URL

    const formData = new FormData();
    formData.append("fileEntry", file); // Append the file

    fetch(url, {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        setIsLoading(false);
        // Check the content type of the response
        const contentType = response.headers.get("content-type");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        } else if (contentType && contentType.indexOf("application/json") !== -1) {
          return response.json(); // Process it as JSON if it's JSON
        } else {
          return response.text(); // Process it as text if it's not JSON
        }
      })
      .then((data) => {
        // At this point, 'data' is either the JSON object or plain text
        if (typeof data === "string") {
          // Assuming the response is a transcription text
          setTranscriptionText(data);
        } else if (data.url && outputType === "pdf") {
          // Handle PDF URL
          const fullUrl = `http://127.0.0.1:5000${data.url}`;
          setPdfURL(fullUrl);
        } else if (data.err) {
          // If there's an error field in the JSON
          setErrorMessage(data.err);
        }
      })
      .catch((error) => {
        console.error("Error uploading file:", error);
        setErrorMessage("Failed to upload file.");
        setIsLoading(false);
      });
  };

  return (
    <>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
      <Card>
        <MDBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
          <MDBox>
            <MDTypography variant="h6" gutterBottom>
              Transcription
            </MDTypography>
          </MDBox>
        </MDBox>
        {isLoading && (
          <MDBox display="flex" justifyContent="center" alignItems="center">
            <div
              style={{
                border: "4px solid #f3f3f3",
                borderTop: "4px solid #3498db",
                borderRadius: "50%",
                width: "20px",
                height: "20px",
                animation: "spin 1s linear infinite",
              }}
            ></div>
          </MDBox>
        )}
        {errorMessage && (
          <MDBox mt={2}>
            <MDTypography variant="caption" color="error">
              {errorMessage}
            </MDTypography>
          </MDBox>
        )}
        {transcriptionText && (
          <MDBox mt={2} p={2} style={{ backgroundColor: "#f0f0f0", borderRadius: "4px" }}>
            <MDTypography variant="body1">{transcriptionText}</MDTypography>
          </MDBox>
        )}
        {pdfURL && (
          <>
            {console.log(pdfURL)}
            <MDBox mt={2}>
              <iframe src={pdfURL} style={{ width: "100%", height: "500px" }} frameBorder="0">
                Preview not available
              </iframe>
            </MDBox>
          </>
        )}
        <MDBox p={3}>
          <MDBox mb={2}>
            <label htmlFor="upload-file">
              <MDTypography variant="button" display="block" gutterBottom>
                Upload Audio/Video File
              </MDTypography>
            </label>
            <input
              id="upload-file"
              name="upload-file"
              type="file"
              accept=".mp3,.wav,.mp4,.avi"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
            <MDButton
              variant="outlined"
              color="info"
              size="small"
              onClick={() => document.getElementById("upload-file").click()}
            >
              Choose File
            </MDButton>
            {/* Button to upload the file */}
            <MDButton
              variant="contained"
              color="info"
              size="small"
              onClick={uploadFile} // Call the uploadFile function when clicked
              disabled={!file} // Disable the button if no file is selected
              style={{ marginLeft: "10px" }}
            >
              Transcribe File
            </MDButton>
            {/* Display the selected file name */}
            {file && (
              <MDBox mt={2}>
                <MDTypography variant="caption" display="block">
                  {file.name}
                </MDTypography>
              </MDBox>
            )}
          </MDBox>
        </MDBox>{" "}
        <MDBox mb={2} p={2} display="flex" flexDirection="column">
          <MDTypography variant="button" display="block" gutterBottom>
            Output Type
          </MDTypography>
          <FormControlLabel
            control={
              <Radio
                checked={outputType === "transcription"}
                onChange={() => setOutputType("transcription")}
                value="transcription"
                name="outputType"
                color="primary"
              />
            }
            label="Transcription"
          />
          <FormControlLabel
            control={
              <Radio
                checked={outputType === "pdf"}
                onChange={() => setOutputType("pdf")}
                value="pdf"
                name="outputType"
                color="primary"
              />
            }
            label="PDF"
          />
        </MDBox>
      </Card>
    </>
  );
}

export default Projects;
