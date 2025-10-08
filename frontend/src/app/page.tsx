"use client";
import ChatInput from "@/components/chat/ChatInput";
import ChatSidebar from "@/components/chat/ChatSidebar";
import { useEffect, useState } from "react";
import { X } from "lucide-react";


export default function Home() {
  
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleClosePdf = () => setFileUrl(null);

  useEffect(() => {
    setSidebarOpen(!fileUrl);
  }, [fileUrl]);


  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-50">
      <ChatSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div
        className={`flex flex-1 flex-col md:flex-row items-stretch transition-all duration-300`}
      >
        <div
          className={`flex flex-col justify-between flex-1 transition-all duration-300 ${
            fileUrl ? "md:w-1/2" : "md:w-full"
          }`}
        >
          <div className="flex flex-col items-center gap-2 mt-20 md:mt-32 text-center px-4">
            <h2 className="text-2xl font-bold">Hi, I&apos;m Tejas Vaidya.</h2>
            <p className="text-muted-foreground">How can I help you today?</p>
          </div>
          <div className="w-full flex justify-center items-end p-6 md:p-8">
            <ChatInput setFileUrl={setFileUrl} sidebarOpen={sidebarOpen} />
          </div>

          {fileUrl && (
            <div className="md:hidden w-full h-64 border-t bg-white relative">
              <button
                onClick={handleClosePdf}
                className="absolute top-2 right-2 z-10 bg-gray-200 hover:bg-gray-300 rounded-full p-1 transition"
              >
                <X className="w-4 h-4 text-gray-700" />
              </button>
              <iframe
                src={fileUrl}
                title="PDF Preview"
                className="w-full h-full border-none rounded-t-md"
              />
            </div>
          )}
        </div>

        {fileUrl && (
          <div className="hidden md:flex w-1/2 h-full border-l bg-white shadow-inner relative">
            <button
              onClick={handleClosePdf}
              className="absolute top-3 right-3 z-10 bg-gray-200 hover:bg-gray-300 rounded-full p-1 transition"
            >
              <X className="w-5 h-5 text-gray-700" />
            </button>
            <iframe
              src={fileUrl}
              title="PDF Preview"
              className="w-full h-full border-none rounded-r-md"
            />
          </div>
        )}
      </div>
    </div>
  );
}
