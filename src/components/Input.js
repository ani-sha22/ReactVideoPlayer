import React, { useState, useRef } from "react";

const DragDropFiles = ({ onFileChange }) => {
  const [fileName, setFileName] = useState(null);
  const [file, setFile] = useState(null);
  const [hasAudio, setHasAudio] = useState(true);
  const inputRef = useRef(null);

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    handleFile(droppedFile);
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    handleFile(selectedFile);
  };



  const handleFile = (selectedFile) => {
    setFileName(selectedFile.name);
    setFile(selectedFile);
    onFileChange(selectedFile);

    

  };

  const handleReUpload = () => {
    setFileName(null);
    setFile(null);
    setHasAudio(true);
    if (inputRef.current) {
      inputRef.current.value = null;
      inputRef.current.click();
    }
  };

  return (
    <>
      {fileName ? (
        <div className="selected-file">
          <p>Selected File: {fileName}</p>
          {!hasAudio && <p style={{ color: "red" }}>This video does not have audio.</p>}
          <button className="reupload-button" onClick={handleReUpload}>Re-upload</button>
        </div>
      ) : (
        <div className="dropzone" onDragOver={handleDragOver} onDrop={handleDrop}>
          <h1>Drag and Drop Video Files to Upload</h1>
          <h1>Or</h1>
          <input type="file" onChange={handleFileChange} hidden accept="video/*" ref={inputRef} />
          <button className="select-button" onClick={() => inputRef.current.click()}>Upload File</button>
        </div>
      )}
    </>
  );
};

export default DragDropFiles;
