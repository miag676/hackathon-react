import { useState, useEffect } from "react";

// @mui material components
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";

// Material Dashboard 2 React examples
import DataTable from "examples/Tables/DataTable";

// Data
import data from "layouts/dashboard/components/Projects/data";

function Projects() {
  const { columns, rows } = data();
  const [menu, setMenu] = useState(null);
  const [subjects, setSubjects] = useState([]);
  // Use an array to store multiple files
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [response, setResponse] = useState("");

  const openMenu = ({ currentTarget }) => setMenu(currentTarget);
  const closeMenu = () => setMenu(null);

  const handleFileChange = (event) => {
    // Use the FileList to append new files to the existing array
    const selectedFiles = Array.from(event.target.files);
    if (selectedFiles.length > 0) {
      setFiles((prevFiles) => [...prevFiles, ...selectedFiles]); // Append new files
    }
  };

  const handleTextInputChange = (event) => {
    setTextInput(event.target.value); // Update the textInput state with the new value
  };

  const handleSubjectChange = (event) => {
    setSelectedSubject(event.target.value); // Update the selected subject state with the new value
  };

  const answerQuestion = () => {
    setIsLoading(true); // Set loading state to true before the request

    // Assuming 'subject' is a variable that holds the currently selected subject
    fetch(`http://127.0.0.1:5000/answer_question?subject=${encodeURIComponent(selectedSubject)}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `prompt=${encodeURIComponent(textInput)}`,
    })
      .then((response) => response.text()) // Assuming the server returns plain text
      .then((text) => {
        setResponse(text); // Update the state with the server's response
        setIsLoading(false); // Set loading state to false after the request
      })
      .catch((error) => {
        console.error("Error:", error);
        setIsLoading(false); // Ensure loading state is reset on error
      });
  };

  useEffect(() => {
    setIsLoading(true);
    fetch("http://127.0.0.1:5000/subjects")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        console.log(response);
        return response.json();
      })
      .then((data) => {
        setSubjects(data); // Assuming the server returns an array of subjects
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching subjects:", error);
      });
  }, []);

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
          <MDTypography variant="h6" gutterBottom>
            Subjects
          </MDTypography>
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
        {response && (
          <MDBox mt={2} p={2}>
            <MDTypography variant="body1">{response}</MDTypography>
          </MDBox>
        )}
        <MDBox p={2} display="flex" flexDirection="column" gap={2}>
          <FormControl fullWidth>
            <InputLabel id="select-subject-label"></InputLabel>
            <Select
              labelId="select-subject-label"
              id="select-subject"
              value={selectedSubject}
              onChange={handleSubjectChange}
              displayEmpty
              renderValue={
                selectedSubject !== ""
                  ? undefined
                  : () => <span style={{ opacity: 0.7 }}>Select Subject</span>
              }
            >
              {subjects.map((subject, index) => (
                <MenuItem key={index} value={subject}>
                  {subject}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <MDInput
            type="text"
            label="Enter prompt"
            fullWidth
            value={textInput}
            onChange={handleTextInputChange}
          />
          <MDButton variant="contained" color="info" onClick={answerQuestion}>
            Enter
          </MDButton>
        </MDBox>
      </Card>
    </>
  );
}

export default Projects;
