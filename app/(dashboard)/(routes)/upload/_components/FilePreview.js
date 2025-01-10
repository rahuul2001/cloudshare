import Image from "next/image";
import React from "react";
import { X } from "lucide-react";

function FilePreview({ file, removeFile }) {
  return (
    <div className="flex items-center gap-2 justify-between p-8 border-2 border-[#FFA9A9] my-5">
      <div className="flex gap-4 items-center">
        <Image src="/file.png" width={50} height={50} alt="file" />
        <div className="text-left max-w-[250px]">
          {/* Ensure the file name wraps within the container */}
          <h2 className="break-words word-wrap block w-full max-w-full text-ellipsis overflow-hidden text-black">
            {file.name}
          </h2>
          <h2 className="text-black text-[15px]">{file.type}</h2>
          <h2 className="text-black text-[15px]">
            {(file.size / 1024 / 1024).toFixed(2)} MB
          </h2>
        </div>
      </div>
      <X
        className="text-[#FFA9A9] cursor-pointer"
        onClick={() => removeFile()}
      />
    </div>
  );
}

export default FilePreview;
