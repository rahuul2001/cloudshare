"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { app } from "../../../../config.js";

function Files() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true); // Add a loading state
  const router = useRouter();
  const db = getFirestore(app);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const filesCollection = collection(db, "uploadedFiles");
        const filesSnapshot = await getDocs(filesCollection);
        const filesList = filesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setFiles(filesList);
      } catch (error) {
        console.error("Error fetching files:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchFiles();
  }, [db]);

  const handleFileClick = (fileId) => {
    router.push(`/file-preview/${fileId}`);
  };

  if (loading) {
    return (
      <div className="p-4">
        <h1 className="text-xl font-semibold mb-4 text-primary">My Files</h1>
        <p className="text-lg text-gray-600 text-center">Loading files from database...</p>
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className="p-4">
        <h1 className="text-xl font-semibold mb-4 text-primary">My Files</h1>
        <p className="text-lg text-gray-600 text-center">No files have been uploaded yet.</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4 text-primary">My Files</h1>
      <p className="text-bold text-black mb-6">
        <strong>Total Files: </strong>
        {files.length}
      </p>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-primary">
              <th className="px-4 py-2 border border-gray-300 text-left">File Name</th>
              <th className="px-4 py-2 border border-gray-300 text-left">Type</th>
              <th className="px-4 py-2 border border-gray-300 text-left">Size (MB)</th>
              <th className="px-4 py-2 border border-gray-300 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {files.map((file) => (
              <tr
                key={file.id}
                className="hover:bg-gray-200 cursor-pointer"
                onClick={() => handleFileClick(file.id)}
              >
                <td className="px-4 py-2 border border-gray-300 text-primary">{file.fileName}</td>
                <td className="px-4 py-2 border border-gray-300 text-primary">{file.fileType}</td>
                <td className="px-4 py-2 border border-gray-300 text-primary">
                  {(file?.fileSize / 1024 / 1024).toFixed(2)}
                </td>
                <td className="px-4 py-2 border border-gray-300 text-center text-blue-600">
                  View
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Files;
