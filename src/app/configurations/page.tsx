"use client";
import { Button } from "~/components/ui/button";
import { RiFileUploadLine } from "react-icons/ri";
import { ChangeEvent, useRef } from "react";

export default function ConfigurationsPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    // Do something with the selected file
    console.log("Selected file:", file);
  };

  return (
    <div className="flex flex-col gap-6">
      <header className="flex w-full items-center justify-between">
        <div className="flex flex-col">
          <h2 className="mb-2 text-4xl font-bold">Configurations</h2>
          <p className="text-md text-gray-600">
            Configure Public Holidays and Other Settings
          </p>
        </div>
        <div className="flex">
          <Button
            onClick={handleButtonClick}
            className="bg-blue-500 hover:bg-blue-600"
          >
            <RiFileUploadLine className="mr-2 h-5 w-5" />
            Upload Holidays CSV
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </div>
      </header>
    </div>
  );
}
