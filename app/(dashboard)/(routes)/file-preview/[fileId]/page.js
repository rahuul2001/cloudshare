"use client";
import { doc, getDoc, updateDoc, getFirestore } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { app } from "../../../../../config.js";
import Announcement from "../../upload/_components/Announcement.js";

function FilePreview({ params }) {
  const db = getFirestore(app);

  const [announcement, setAnnouncement] = useState("");

  const [fileId, setFileId] = useState(null);
  const [file, setFile] = useState(null);

  const [saveText, setSaveText] = useState("Save");

  const [copied, setCopied] = useState(false);
  const [passwordEnabled, setPasswordEnabled] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // For sending email
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const unwrapParams = async () => {
      const unwrappedParams = await params;
      setFileId(unwrappedParams.fileId);
      if (unwrappedParams.fileId) {
        await getFileInfo(unwrappedParams.fileId);
      }
    };

    unwrapParams();
  }, [params]);

  const getFileInfo = async (id) => {
    const docRef = doc(db, "uploadedFiles", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setFile(docSnap.data());
    } else {
      console.log("No such document!");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(file?.shortUrl || "");
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const validatePassword = (password) => {
    // Regex for strong password
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return strongPasswordRegex.test(password);
  };

  const handleSavePassword = async () => {
    if (!password || !validatePassword(password)) {
      setPasswordError(
        "Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character from the following: @$!%*?&."
      );
      return;
    }

    setSaveText("Saving");

    const docRef = doc(db, "uploadedFiles", fileId);

    try {
      await updateDoc(docRef, { password });
      setIsSaved(true);
      setTimeout(() => {
        setIsSaved(false); // Reset the button text after 2 seconds
      }, 2000);

      setSaveText("Saved");
      setAnnouncement("Password set successfully!");
      setTimeout(() => {
        setAnnouncement("")
        setSaveText("Save")
      }, 3000);
      // alert("Password saved successfully!");
      setPasswordError("");
    } catch (error) {
      console.error("Error saving password: ", error);
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);

    // Validate password on change
    if (value && validatePassword(value)) {
      setPasswordError("");
    } else if (value) {
      setPasswordError(
        "Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character from the following: @$!%*?&. Do not include underscores."
      );
    }
  };

  const handleSendEmail = async () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    setEmailError("");

    try {
      const res = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          shortUrl: file?.shortUrl,
          firstName: "user",
        }),
      });

      if (!res.ok) {
        setEmailError("Failed to send email. Please try again later.");
        return;
      }

      // Email sent successfully
      setEmailSent(true);
      setAnnouncement("Email sent successfully!");
      setTimeout(() => setAnnouncement(""), 3000); // Clear announcement after 3 seconds

      setTimeout(() => setEmailSent(false), 3000);
    } catch (err) {
      console.error("Error sending email:", err);
      setEmailError("An unexpected error occurred while sending the email.");
    }
  };

  if (!fileId) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {announcement && (
        <Announcement
          message={announcement}
          onClose={() => setAnnouncement("")}
        />
      )}
      <div className="p-5 text-black flex gap-5">
        {/* Left side: File preview */}
        {/* Left side: File preview */}
        <div className="p-3 border rounded w-[300px] flex flex-col items-center">
          {file?.fileUrl ? (
            <>
              {file.fileType.includes("image") && (
                <img
                  src={file.fileUrl}
                  alt={file.fileName}
                  className="w-full h-auto object-contain mb-2"
                />
              )}

              {file.fileType === "application/pdf" && (
                <embed
                  src={file.fileUrl}
                  type="application/pdf"
                  width="100%"
                  height="400px"
                />
              )}

              {file.fileType.startsWith("video") && (
                <video width="100%" height="auto" controls className="mb-2">
                  <source src={file.fileUrl} type={file.fileType} />
                  Your browser does not support the video tag.
                </video>
              )}

              {file.fileType.startsWith("audio") && (
                <audio controls className="mb-2">
                  <source src={file.fileUrl} type={file.fileType} />
                  Your browser does not support the audio element.
                </audio>
              )}

              {/* Add more conditions for other file types as needed */}

              {/* Fallback */}
              {!file.fileType.includes("image") &&
                file.fileType !== "application/pdf" &&
                !file.fileType.startsWith("video") &&
                !file.fileType.startsWith("audio") && (
                  <div className="break-words">
                    No preview available for this file type.
                  </div>
                )}
            </>
          ) : (
            <div>No preview</div>
          )}

          <div className="text-center">
            <p className="break-all">
              <strong>File Name: </strong>
              <span className="break-words word-wrap block w-full max-w-full overflow-hidden text-ellipsis">
                {file?.fileName}
              </span>
            </p>
            <h2>
              <strong>File Format: </strong>
              {file?.fileType}
            </h2>
            <h3>
              <strong>File Size in MB: </strong>
              {(file?.fileSize / 1024 / 1024).toFixed(2)} MB
            </h3>
          </div>
        </div>

        {/* Right side: Short URL, password, email, etc. */}
        <div className="p-3 border rounded w-[400px] flex flex-col gap-3">
          <label className="font-bold">Short Url</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={file?.shortUrl || ""}
              className="border px-3 py-1 rounded-md flex-1"
            />
            <button
              onClick={handleCopy}
              className={`px-3 py-1 rounded-md transition-all duration-300 ease-in-out
              ${copied ? "bg-primary text-white" : "bg-gray-200 text-black"}`}
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>

          {/* Enable Password */}
          <label className="flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              checked={passwordEnabled}
              onChange={(e) => setPasswordEnabled(e.target.checked)}
            />
            <span>Enable Password?</span>
          </label>

          {/* Password Field */}
          <div className="flex flex-col gap-2">
            <div className="flex gap-2 items-center">
              <input
                type="password"
                placeholder="Enter Password"
                className="border px-3 py-1 flex-1 rounded-md"
                value={password}
                onChange={handlePasswordChange}
                disabled={!passwordEnabled}
              />
              <button
                onClick={handleSavePassword}
                className={`bg-primary text-white px-3 py-1 rounded disabled:opacity-50 transition duration-300 ease-in-out ${
                  isSaved ? "bg-green-500" : ""
                }`}
                disabled={!passwordEnabled}
              >
                {saveText}
              </button>
            </div>
            {/* Display password error */}
            {passwordError && (
              <p className="text-red-500 text-sm">{passwordError}</p>
            )}
          </div>

          {/* Send file to email */}
          <label className="mt-3">Send File to Email</label>
          <input
            type="email"
            placeholder="example@gmail.com"
            className="border px-3 py-1 rounded-md"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            onClick={handleSendEmail}
            className="bg-primary text-white px-3 py-1 rounded mt-2"
          >
            {emailSent ? "Email Sent!" : "Send Email"}
          </button>
          {/* Display email errors */}
          {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
        </div>
      </div>
    </div>
  );
}

export default FilePreview;
