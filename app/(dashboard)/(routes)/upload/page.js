"use client";
import React, { useEffect, useState } from "react";
import UploadForm from "./_components/UploadForm";
import Announcement from "./_components/Announcement";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../../../../config"; // Adjust the path as needed
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { useUser } from "@clerk/nextjs";
import { generateRandomString } from "../../../_utils/GenerateRandomString.js"; // Ensure you have the function for generating random strings
import { useRouter } from "next/navigation";

function Upload() {
  const storage = getStorage(app);
  const db = getFirestore(app);

  const { user } = useUser();

  const [progress, setProgress] = useState(0);
  const [announcement, setAnnouncement] = useState({ message: "" });
  const [uploadCompleted, setUploadCompleted] = useState(false);

  const router = useRouter();
  const [fileDocId, setFileDocId] = useState(null);

  const resetProgress = () => {
    setProgress(0);
  };

  const uploadFile = (file) => {
    const storageRef = ref(storage, `file-upload/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        setProgress(progress);
      },
      (error) => {
        console.error("Upload failed:", error);
        setAnnouncement({ message: "Upload failed. Please try again." });
      },
      async () => {
        try {
          const fileUrl = await getDownloadURL(uploadTask.snapshot.ref);
          console.log("File available at", fileUrl);
          await saveInfo(file, fileUrl); // Pass file and fileUrl to saveInfo
          setAnnouncement({ message: "File uploaded successfully!" });
          setUploadCompleted(true);
        } catch (error) {
          console.error("Error saving file info:", error);
          setAnnouncement({
            message: "Error saving file info. Please try again.",
          });
        }
      }
    );
  };

  const saveInfo = async (file, fileUrl) => {
    const docId = Date.now().toString();
    console.log("Doc id:", docId);
    const generatedFileDocId = generateRandomString();
    try {
      await setDoc(doc(db, "uploadedFiles", generatedFileDocId), {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        fileUrl: fileUrl,
        userEmail: user?.primaryEmailAddress?.emailAddress || "unknown",
        userName: user?.fullName || "unknown",
        password: "",
        shortUrl: 'https://cloudshare-xi.vercel.app/'+generatedFileDocId,
      });
      console.log("File info saved to Firestore");
      setFileDocId(generatedFileDocId);
    } catch (error) {
      console.error("Error saving document to Firestore:", error);
      throw error;
    }
  };

  useEffect(() => {
    if (uploadCompleted) {
      const timeout = setTimeout(() => {
        setUploadCompleted(false);
        router.push("/file-preview/" + fileDocId);
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [uploadCompleted]);

  return (
    <div>
      {/* Announcement Component */}
      {announcement.message && (
        <Announcement
          message={announcement.message}
          onClose={() => setAnnouncement({ message: "" })}
        />
      )}

      <div className="p-5 px-8 md:px-28">
        <div className="text-black text-[20px] text-center m-5">
          <h2>
            Start <strong className="text-primary">Uploading</strong> Files and
            <strong className="text-primary"> Sharing</strong>
          </h2>
        </div>
        <UploadForm
          uploadButtonClick={(file) => uploadFile(file)}
          progress={progress}
          resetProgress={resetProgress}
        />
      </div>
    </div>
  );
}

export default Upload;
