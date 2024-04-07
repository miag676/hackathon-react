import { useState } from "react";

// @mui material components
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import TimetableComponent from "layouts/schedule/TimetableComponent";

// Material Dashboard 2 React examples
import DataTable from "examples/Tables/DataTable";

// Data
import data from "layouts/dashboard/components/Projects/data";

function Projects() {
  const { columns, rows } = data();
  const [menu, setMenu] = useState(null);
  // Use an array to store multiple files
  const [files, setFiles] = useState([]);
  const [textInput, setTextInput] = useState("");
  const [idInput, setIdInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [scheduleResponse, setScheduleResponse] = useState({});

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

  const handleIdInputChange = (event) => {
    setIdInput(event.target.value); // Update the textInput state with the new value
  };

  const preprocessTimetableData = (rawData) => {
    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    const timetable = daysOfWeek.reduce((acc, day) => ({ ...acc, [day]: {} }), {});

    Object.entries(rawData).forEach(([course, timeInfo]) => {
      // Find the first occurrence of a number to split at that point (this assumes the day and time are separated by a space)
      const splitIndex = timeInfo.search(/\d/);
      const day = timeInfo.substring(0, splitIndex - 1);
      const timeRange = timeInfo.substring(splitIndex);

      const [startTime, endTime] = timeRange.split("-").map((t) => t.trim());

      // Parse start and end times into hours
      const startHour = parseInt(startTime.split(":")[0], 10);
      const endHour = parseInt(endTime.split(":")[0], 10);

      // Ensure structure for each hour of each day and add the course
      for (let hour = startHour; hour < endHour; hour++) {
        // Note: if you need the end hour inclusive, adjust accordingly
        if (!timetable[day][hour]) {
          timetable[day][hour] = [];
        }
        timetable[day][hour].push(course);
      }
    });

    return timetable;
  };

  const generateTimetable = () => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("studentID", idInput);
    formData.append("prompt", textInput);

    fetch("http://127.0.0.1:5000/generate_timetable", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        const structuredData = preprocessTimetableData(data);
        console.log(structuredData);
        setScheduleResponse(structuredData); // Use this structured data for the timetable
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error generating timetable:", error);
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
              Schedule
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

        {Object.keys(scheduleResponse).length > 0 && (
          <TimetableComponent timetable={scheduleResponse} />
        )}
        <MDBox p={2}>
          <MDBox>
            <MDInput
              type="text"
              label="Enter student id"
              fullWidth
              value={idInput}
              onChange={handleIdInputChange}
            />{" "}
            {/* Changed type from 'chat' to 'text' */}
          </MDBox>
        </MDBox>
        <MDBox p={2}>
          <MDBox mb={2}>
            <MDInput
              type="text"
              label="Enter prompt"
              fullWidth
              value={textInput}
              onChange={handleTextInputChange}
            />{" "}
            {/* Changed type from 'chat' to 'text' */}
          </MDBox>
        </MDBox>
        <MDButton p={2} mb={2} variant="contained" color="info" onClick={generateTimetable}>
          Generate Timetable
        </MDButton>
      </Card>
    </>
  );
}

export default Projects;
