import React, { useState } from "react";
import { uploadCsv } from "../api/claims";

export default function Upload() {
  const [file, setFile] = useState(null);

  const handleUpload = () => {
    const form = new FormData();
    form.append("file", file);

    uploadCsv(form).then(() => alert("Uploaded successfully"));
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>Upload Claims CSV</h2>

      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <br /><br />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
}