import { useState } from "react";

// @mui material components
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";

// Material Dashboard 2 React examples
import DataTable from "examples/Tables/DataTable";

// Data
import data from "layouts/dashboard/components/Projects/data";

function Projects() {
  const { columns, rows } = data();
  const [menu, setMenu] = useState(null);
  // Use an array to store multiple files
  const [files, setFiles] = useState([]);

  const openMenu = ({ currentTarget }) => setMenu(currentTarget);
  const closeMenu = () => setMenu(null);

  const handleFileChange = (event) => {
    // Use the FileList to append new files to the existing array
    const selectedFiles = Array.from(event.target.files);
    if (selectedFiles.length > 0) {
      setFiles((prevFiles) => [...prevFiles, ...selectedFiles]); // Append new files
    }
  };

  return (
    <Card>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
        <MDBox>
          <MDTypography variant="h6" gutterBottom>
            Chat
          </MDTypography>
        </MDBox>
      </MDBox>
      <MDBox p={2}>
        <MDBox mb={2}>
          <MDInput type="text" label="Enter prompt" fullWidth />{" "}
          {/* Changed type from 'chat' to 'text' */}
        </MDBox>
        <MDBox mb={2}>
          <label htmlFor="upload-file">
            <MDTypography variant="button" display="block" gutterBottom>
              Upload Audio/Video Files
            </MDTypography>
          </label>
          <input
            id="upload-file"
            name="upload-file"
            type="file"
            accept=".mp3,.wav,.mp4,.avi"
            style={{ display: "none" }}
            multiple // Allow multiple file selection
            onChange={handleFileChange}
          />
          <MDButton
            onClick={() => document.getElementById("upload-file").click()}
            // style={{
            //   cursor: "pointer",
            //   padding: "10px",
            //   borderRadius: "5px",
            //   border: "1px solid #ccc",
            //   background: "#f0f0f0",
            // }}
            variant="outlined"
            color="info"
            size="small"
          >
            Add Files
          </MDButton>
          {/* Map through the files array to display file names */}
          {files.length > 0 && (
            <MDBox mt={2}>
              {files.map((file, index) => (
                <MDTypography key={index} variant="caption" display="block">
                  {file.name}
                </MDTypography>
              ))}
            </MDBox>
          )}
        </MDBox>
      </MDBox>
    </Card>
  );
}

export default Projects;
