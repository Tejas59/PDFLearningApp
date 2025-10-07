"use client";
import { Input } from "./ui/input";

const UploadFileComponent = () => {
  return (
    <div className="grid w-full max-w-sm items-center gap-3">
      <Input id="file" type="file" />
    </div>
  );
};

export default UploadFileComponent;
