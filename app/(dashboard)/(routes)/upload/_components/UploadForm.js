import React, { useState } from "react";
import AlertMessage from "./AlertMessage";
import FilePreview from "./FilePreview"
import ProgressBar from "./ProgressBar"

function UploadForm({uploadButtonClick, progress, resetProgress}) {
  const [file, setFile] = useState();
  const [errorMsg, setErrorMsg] = useState();

  const onFileSelect = (file) => {
    setFile(null)
    console.log(file);
    if (file && file.size > 2097152) {
      console.log("size is greater than 2mb");
      setErrorMsg("Maximum file size is 2 MB!");
      return;
    } else {
      setErrorMsg(null)
      setFile(file);
    }
  };

  return (
    <div className="text-center">
      <div className="flex items-center justify-center w-full">
        <label
          htmlFor="dropzone-file"
          className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-100 hover:bg-gray-300 dark:border-gray-300 dark:hover:border-gray-500 dark:hover:bg-gray-300"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg
              className="w-8 h-8 mb-4 text-primary dark:text-primary"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 16"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
              />
            </svg>
            <p className="mb-2 text-sm text-black">
              <span className="font-semibold text-primary">
                Click to upload
              </span>{" "}
              or drag and drop
            </p>
            <p className="text-xs text-black">
              SVG, PNG, JPG or GIF (MAX SIZE: 2 MB)
            </p>
          </div>
          <input
            id="dropzone-file"
            type="file"
            className="hidden"
            onChange={(event) => onFileSelect(event.target.files[0])}
          />
        </label>
      </div>

      {errorMsg ? <AlertMessage msg={"Maximum file size is 2 MB!"} /> : null}
      {file ? <FilePreview file={file} removeFile={()=>{
        setFile(null)
        setErrorMsg(null)
        resetProgress()
      }}/> : null}
      <button
        disabled={!file}
        className="p-2 bg-primary text-white rounded-full mt-5 w-[30%] disabled:bg-gray-500"
        onClick={()=>uploadButtonClick(file)}
      >
        Upload
      </button>
      {progress > 0 ? <ProgressBar progress={progress}/> : null}
    </div>
  );
}

export default UploadForm;
