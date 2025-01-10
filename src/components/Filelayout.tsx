import React from "react";

interface FileLayoutProps {
  toolbar?: React.ReactNode;
  children: React.ReactNode;
  sideContent?: React.ReactNode;
}

const FileLayout: React.FC<FileLayoutProps> = ({
  toolbar,
  children,
  sideContent,
}) => {
  return (
    <div className="flex  gap-5  w-full">
      <div className={`flex-1  ${sideContent ? "border-r px-5" : ""}`}>
        {toolbar && (
          <div className="mb-5 bg-[#F9F7F3] rounded-3xl p-4 py-6">
            {toolbar}
          </div>
        )}
        <div className="max-w-[1040px] mx-auto">{children}</div>
      </div>
      {sideContent && (
        <aside className="w-1/4 h-screen overflow-y-auto  py-8 px-6 border rounded-2xl  shadow-md">
          {sideContent}
        </aside>
      )}
    </div>
  );
};

export default FileLayout;
