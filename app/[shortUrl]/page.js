"use client";

import React, { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import { app } from "../../config";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

const db = getFirestore(app);

export default function FilePreviewPage({ params }) {
  const [fileData, setFileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [enteredPassword, setEnteredPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const router = useRouter();
  const [shortUrl, setShortUrl] = useState("");

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  useEffect(() => {
    const fetchParams = async () => {
      const unwrappedParams = await params;
      setShortUrl(unwrappedParams.shortUrl);
    };

    fetchParams();
  }, [params]);

  useEffect(() => {
    const fetchFileData = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, "uploadedFiles", shortUrl); // Use shortUrl to fetch the correct document
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setFileData(docSnap.data());
        } else {
          setError("File does not exist or the link is invalid.");
        }
      } catch (err) {
        setError("An error occurred while fetching the file.");
      } finally {
        setLoading(false);
      }
    };

    if (shortUrl) {
      fetchFileData();
    }
  }, [shortUrl]);

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (enteredPassword === fileData?.password) {
      setIsAuthenticated(true);
    } else {
      alert("Wrong password. Please try again.");
    }
  };

  const handleDownload = () => {
    window.open(fileData.fileUrl, "_blank");
  };

  if (loading) {
    return <div>Loading file data...</div>;
  }

  if (error) {
    return <div className="text-primary text-xl text-center">{error}</div>;
  }

  if (!fileData) {
    return <div className="text-center">No file data found.</div>;
  }

  // Render download section if authenticated or no password is required
  if (!fileData.password || isAuthenticated) {
    return (
      <div className="m-4 p-4 border-primary rounded-lg text-center bg-white">
        <div className="mb-4">
          <svg
            className="h-8 text-[#FF6363]"
            viewBox="0 0 28 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0.41 10.3847C1.14777 7.4194 2.85643 4.7861 5.2639 2.90424C7.6714 1.02234 10.6393 0 13.695 0C16.7507 0 19.7186 1.02234 22.1261 2.90424C24.5336 4.7861 26.2422 7.4194 26.98 10.3847H25.78C23.7557 10.3549 21.7729 10.9599 20.11 12.1147C20.014 12.1842 19.9138 12.2477 19.81 12.3047H19.67C19.5662 12.2477 19.466 12.1842 19.37 12.1147C17.6924 10.9866 15.7166 10.3841 13.695 10.3841C11.6734 10.3841 9.6976 10.9866 8.02 12.1147C7.924 12.1842 7.8238 12.2477 7.72 12.3047H7.58C7.4762 12.2477 7.376 12.1842 7.28 12.1147C5.6171 10.9599 3.6343 10.3549 1.61 10.3847H0.41ZM23.62 16.6547C24.236 16.175 24.9995 15.924 25.78 15.9447H27.39V12.7347H25.78C24.4052 12.7181 23.0619 13.146 21.95 13.9547C21.3243 14.416 20.5674 14.6649 19.79 14.6649C19.0126 14.6649 18.2557 14.416 17.63 13.9547C16.4899 13.1611 15.1341 12.7356 13.745 12.7356C12.3559 12.7356 11.0001 13.1611 9.86 13.9547C9.2343 14.416 8.4774 14.6649 7.7 14.6649C6.9226 14.6649 6.1657 14.416 5.54 13.9547C4.4144 13.1356 3.0518 12.7072 1.66 12.7347H0V15.9447H1.61C2.39051 15.924 3.154 16.175 3.77 16.6547C4.908 17.4489 6.2623 17.8747 7.65 17.8747C9.0377 17.8747 10.392 17.4489 11.53 16.6547C12.1468 16.1765 12.9097 15.9257 13.69 15.9447C14.4708 15.9223 15.2348 16.1735 15.85 16.6547C16.9901 17.4484 18.3459 17.8738 19.735 17.8738C21.1241 17.8738 22.4799 17.4484 23.62 16.6547ZM23.62 22.3947C24.236 21.915 24.9995 21.664 25.78 21.6847H27.39V18.4747H25.78C24.4052 18.4581 23.0619 18.886 21.95 19.6947C21.3243 20.156 20.5674 20.4049 19.79 20.4049C19.0126 20.4049 18.2557 20.156 17.63 19.6947C16.4899 18.9011 15.1341 18.4757 13.745 18.4757C12.3559 18.4757 11.0001 18.9011 9.86 19.6947C9.2343 20.156 8.4774 20.4049 7.7 20.4049C6.9226 20.4049 6.1657 20.156 5.54 19.6947C4.4144 18.8757 3.0518 18.4472 1.66 18.4747H0V21.6847H1.61C2.39051 21.664 3.154 21.915 3.77 22.3947C4.908 23.1889 6.2623 23.6147 7.65 23.6147C9.0377 23.6147 10.392 23.1889 11.53 22.3947C12.1468 21.9165 12.9097 21.6657 13.69 21.6847C14.4708 21.6623 15.2348 21.9135 15.85 22.3947C16.9901 23.1884 18.3459 23.6138 19.735 23.6138C21.1241 23.6138 22.4799 23.1884 23.62 22.3947Z"
              fill="currentColor"
            />
          </svg>
          <h2 className="text-xl text-primary font-bold mt-2 mb-8">
            File Ready to Download
          </h2>
          <p className="text-gray-700 mt-2 break-words overflow-hidden text-ellipsis">
            <strong className="text-primary">File Name:</strong>{" "}
            {fileData.fileName}
          </p>
          <strong className="text-primary">File Format:</strong>
          <p className="text-gray-600 text-sm">{fileData.fileType}</p>
          <strong className="text-primary">File Size in MB:</strong>
          <p className="text-gray-600 text-sm">
            {(fileData.fileSize / 1024 / 1024).toFixed(2)} MB
          </p>
        </div>
        <button
          onClick={handleDownload}
          className="px-6 py-2 bg-primary text-white rounded hover:bg-gray-300 hover:text-primary transition"
        >
          Download
        </button>
      </div>
    );
  }

  // Render password form if authentication is required
  return (
    <div className="m-4 p-4 border border-gray-200 rounded-lg text-center bg-white">
      <svg
        className="h-8 text-[#FF6363]"
        viewBox="0 0 28 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0.41 10.3847C1.14777 7.4194 2.85643 4.7861 5.2639 2.90424C7.6714 1.02234 10.6393 0 13.695 0C16.7507 0 19.7186 1.02234 22.1261 2.90424C24.5336 4.7861 26.2422 7.4194 26.98 10.3847H25.78C23.7557 10.3549 21.7729 10.9599 20.11 12.1147C20.014 12.1842 19.9138 12.2477 19.81 12.3047H19.67C19.5662 12.2477 19.466 12.1842 19.37 12.1147C17.6924 10.9866 15.7166 10.3841 13.695 10.3841C11.6734 10.3841 9.6976 10.9866 8.02 12.1147C7.924 12.1842 7.8238 12.2477 7.72 12.3047H7.58C7.4762 12.2477 7.376 12.1842 7.28 12.1147C5.6171 10.9599 3.6343 10.3549 1.61 10.3847H0.41ZM23.62 16.6547C24.236 16.175 24.9995 15.924 25.78 15.9447H27.39V12.7347H25.78C24.4052 12.7181 23.0619 13.146 21.95 13.9547C21.3243 14.416 20.5674 14.6649 19.79 14.6649C19.0126 14.6649 18.2557 14.416 17.63 13.9547C16.4899 13.1611 15.1341 12.7356 13.745 12.7356C12.3559 12.7356 11.0001 13.1611 9.86 13.9547C9.2343 14.416 8.4774 14.6649 7.7 14.6649C6.9226 14.6649 6.1657 14.416 5.54 13.9547C4.4144 13.1356 3.0518 12.7072 1.66 12.7347H0V15.9447H1.61C2.39051 15.924 3.154 16.175 3.77 16.6547C4.908 17.4489 6.2623 17.8747 7.65 17.8747C9.0377 17.8747 10.392 17.4489 11.53 16.6547C12.1468 16.1765 12.9097 15.9257 13.69 15.9447C14.4708 15.9223 15.2348 16.1735 15.85 16.6547C16.9901 17.4484 18.3459 17.8738 19.735 17.8738C21.1241 17.8738 22.4799 17.4484 23.62 16.6547ZM23.62 22.3947C24.236 21.915 24.9995 21.664 25.78 21.6847H27.39V18.4747H25.78C24.4052 18.4581 23.0619 18.886 21.95 19.6947C21.3243 20.156 20.5674 20.4049 19.79 20.4049C19.0126 20.4049 18.2557 20.156 17.63 19.6947C16.4899 18.9011 15.1341 18.4757 13.745 18.4757C12.3559 18.4757 11.0001 18.9011 9.86 19.6947C9.2343 20.156 8.4774 20.4049 7.7 20.4049C6.9226 20.4049 6.1657 20.156 5.54 19.6947C4.4144 18.8757 3.0518 18.4472 1.66 18.4747H0V21.6847H1.61C2.39051 21.664 3.154 21.915 3.77 22.3947C4.908 23.1889 6.2623 23.6147 7.65 23.6147C9.0377 23.6147 10.392 23.1889 11.53 22.3947C12.1468 21.9165 12.9097 21.6657 13.69 21.6847C14.4708 21.6623 15.2348 21.9135 15.85 22.3947C16.9901 23.1884 18.3459 23.6138 19.735 23.6138C21.1241 23.6138 22.4799 23.1884 23.62 22.3947Z"
          fill="currentColor"
        />
      </svg>
      <h2 className="text-primary text-xl font-bold mb-4">
        Enter Password to Download
      </h2>
      <form
        onSubmit={handlePasswordSubmit}
        className="flex flex-col items-center space-y-4"
      >
        <div className="relative w-full max-w-xs">
          <input
            type={isPasswordVisible ? "text" : "password"}
            className="px-3 py-2 border text-primary border-gray-300 rounded w-full focus:border-[#f5b5b5] focus:outline-none"
            placeholder="Enter password"
            value={enteredPassword}
            onChange={(e) => setEnteredPassword(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-primary"
          >
            {isPasswordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        <button
          type="submit"
          className="px-6 py-2 bg-primary text-white rounded hover:bg-gray-300 hover:text-primary transition"
        >
          Unlock
        </button>
      </form>
    </div>
  );
}
