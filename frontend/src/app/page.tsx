"use client";
import ChatInput from "@/components/chat/ChatInput";
import ChatSidebar from "@/components/chat/ChatSidebar";

export default function Home() {

  return (
    <div className="flex h-screen">
      <ChatSidebar />
      <div className="flex flex-col mt-60 mx-auto">
        <div className="flex flex-col items-center gap-2 md:ml-40">
          <div className="flex items-center gap-4 justify-center">
            <div className="h-16 w-16">
            </div>
            <h2 className="text-2xl font-bold ">Hi, I&apos;m Tejas Vaidya.</h2>
          </div>
          <p className="text-center text-muted-foreground">
            How can help you today
          </p>
        </div>
        <div className="fixed left-0 top-30 right-0 bottom-0 mx-auto flex px-4 justify-center items-center">
          <ChatInput />
        </div>
      </div>
    </div>
  );
}
