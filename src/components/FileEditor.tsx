// "use client";
// // import Loader from "@/components/Loader";
// // import { useGetFile } from "@/hooks/File/useGetFile";
// // import { useUpdateFile } from "@/hooks/File/useUpdateFile";
// import { IDomEditor, IEditorConfig, IToolbarConfig } from "@wangeditor/editor";
// // import { Editor } from "@wangeditor/editor-for-react";
// import "@wangeditor/editor/dist/css/style.css";
// import mammoth from "mammoth";
// import dynamic from "next/dynamic";
// import { useParams, useRouter } from "next/navigation";
// import * as pdfjsLib from "pdfjs-dist";
// import "pdfjs-dist/build/pdf.worker.mjs";
// import { useEffect, useRef, useState } from "react";
// import "../../styles/editor.css";
// // import useActiveSectionStore from "@/store/activeSectionStore";
// // import DefineWordModal from "../Modal/DefineWordModal";
// // import htmlToDocx from "html-to-docx/dist/html-to-docx.esm";
// // import { useAutoSave } from "@/hooks/Autosave/useAutoSave";
// // import useFileStore from "@/store/useFileNameStore";
// import WordSpacingEditor from "./WordSpacingEditor";
// import BackgroundEditor from "./BackgroundEditor";
// import LetterSpacingEditor from "./LetterSpacingEditor";
// import htmlToFormattedText from "html-to-formatted-text";
// import FileLayout from "./Filelayout";

// const Editor = dynamic(
//   () => import("@wangeditor/editor-for-react").then((mod) => mod.Editor),
//   { ssr: false }
// );

// const Toolbar = dynamic(
//   () => import("@wangeditor/editor-for-react").then((mod) => mod.Toolbar),
//   { ssr: false }
// );

// interface Props {
//   customToolbar?: React.ReactNode;
//   sideContent?: React.ReactNode;
//   onLoadText?: (text: string) => void;
// }

// const FileViewer = ({ customToolbar, sideContent, onLoadText }: Props) => {
//   const [editor, setEditor] = useState<IDomEditor | null>(null);
//   const [html, setHtml] = useState("");
//   const [content, setContent] = useState("");
//   const params = useParams();

//   const fileId = params.id as string;

//   if (!fileId) {
//     return <div>Invalid File ID</div>;
//   }

// //   const { data: file, isFetching } = useGetFile(fileId);
// //   const { mutate: updateFile, isPending: isUpdating } = useUpdateFile();
//   const [isLoading, setIsLoading] = useState(false);
//   const [openDefinitionOnClick, setOpenDefinitionOnClick] = useState(false);
//   const [selectedWord, setSelectedWord] = useState("");
// //   const { setFileName, setFileId } = useFileStore();

//   const toolbarConfig: Partial<IToolbarConfig> = {
//     toolbarKeys: [
//       "undo",
//       "redo",
//       "fontFamily",
//       "fontSize",
//       "bold",
//       "italic",
//       "underline",
//       "sup",
//       "sub",
//       "justifyLeft",
//       "justifyCenter",
//       "justifyRight",
//       "bgColor",
//       "color",
//       "lineHeight",
//     ],
//   };

//   const editorConfig: Partial<IEditorConfig> = {
//     placeholder: "Type here...",
//     MENU_CONF: {
//       fontFamily: {
//         fontFamilyList: [
//           { value: "OpenDyslexic, sans-serif", name: "Open Dyslexic" },
//           { value: "ABeeZee, sans-serif", name: "ABeeZee" },
//           { value: "Andika, sans-serif", name: "Andika" },
//           { value: "Arial, sans-serif", name: "Arial" },
//           { value: "Calibri, sans-serif", name: "Calibri" },
//           { value: "CenturyGothic, sans-serif", name: "Century Gothic" },
//           { value: "Comic Sans MS, sans-serif", name: "Comic Sans MS" },
//           { value: "Courier New, monospace", name: "Courier New" },
//           { value: "DyslexieRegular, sans-serif", name: "Dyslexie Regular" },
//           { value: "Fira Sans, sans-serif", name: "Fira Sans" },
//           { value: "Helvetica, sans-serif", name: "Helvetica" },
//           { value: "Lato, sans-serif", name: "Lato" },
//           { value: "Lexend, sans-serif", name: "Lexend" },
//           { value: "Libre Franklin, sans-serif", name: "Libre Franklin" },
//           { value: "Mabry Pro, sans-serif", name: "Mabry Pro" },
//           { value: "Nunito, sans-serif", name: "Nunito" },
//           { value: "Open Sans, sans-serif", name: "Open Sans" },
//           { value: "Poppins, sans-serif", name: "Poppins" },
//           { value: "PT Sans, sans-serif", name: "PT Sans" },
//           { value: "Roboto, sans-serif", name: "Roboto" },
//           {
//             value: "SylexiadSansSpacedMed, sans-serif",
//             name: "SylexiadSansSpacedMed",
//           },
//           { value: "Tahoma, sans-serif", name: "Tahoma" },
//           { value: "Trebuchet MS, sans-serif", name: "Trebuchet MS" },
//           { value: "Verdana, sans-serif", name: "Verdana" },
//         ],
//       },
//     },
//   };

//   const stripHtmlTags = (htmlString: string) => {
//     const tempDiv = document.createElement("div");
//     tempDiv.innerHTML = htmlString;
//     return tempDiv.textContent || tempDiv.innerText || "";
//   };

//   useEffect(() => {
//     import("@wangeditor/editor").then(({ i18nChangeLanguage }) => {
//       i18nChangeLanguage("en");
//     });
//     // console.log(editorConfig.MENU_CONF);
//   }, [editorConfig]);

//   useEffect(() => {
//     return () => {
//       if (editor) {
//         editor.destroy();
//         setEditor(null);
//       }
//     };
//   }, [editor]);

//   const fetchFileContent = async (fileUrl: string, fileType: string) => {
//     setIsLoading(true);

//     console.log(fileUrl);
//     const response = await fetch(fileUrl);
//     const blob = await response.blob();

//     if (fileType === "application/pdf") {
//       return extractTextFromPdf(blob);
//     } else if (
//       fileType ===
//       "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
//     ) {
//       // console.log("docx going to be fetched");
//       return extractTextFromDocx(blob);
//     } else if (fileType === "text/plain") {
//       return blob.text();
//     } else {
//       return "Unsupported file type.";
//     }
//   };

//   const extractTextFromPdf = async (blob: Blob) => {
//     const arrayBuffer = await blob.arrayBuffer();
//     const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
//     let extractedText = "";

//     for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
//       const page = await pdf.getPage(pageNumber);
//       const textContent = await page.getTextContent();
//       const pageText = textContent.items.map((item: any) => item.str).join(" ");
//       extractedText += pageText + "\n";
//     }

//     return extractedText;
//   };

//   const extractTextFromDocx = async (blob: Blob) => {
//     const arrayBuffer = await blob.arrayBuffer();
//     // console.log("Docx extract arrayBuffer" + arrayBuffer);
//     const result = await mammoth.convertToHtml({ arrayBuffer });
//     // console.log("Docx extract" + result.value);
//     return result.value;
//   };

// //   useEffect(() => {
// //     if (file && file.data?.url && file.data?.fileExtension) {
// //       fetchFileContent(file.data.url, file.data.fileExtension).then(
// //         (fileContent) => {
// //           setHtml(fileContent);
// //         //   setFileId(file.data.id);
// //         //   setFileName(file.data.originalName);
// //           setContent(fileContent);
// //           setTimeout(() => {}, 1000);
// //           setIsLoading(false);
// //           onLoadText && onLoadText(fileContent);
// //         }
// //       );
// //     }
// //     return () => {
// //     //   setFileName(null);
// //     //   setFileId(null);
// //     };
// //   }, [file]);

//   // const handleUpdateFile = async () => {
//   //   if (!html || !file?.data?.name) {
//   //     console.log("rest");
//   //     return;
//   //   }

//   //   const fileExtension = file.data.fileExtension;
//   //   let blob;

//   //   if (
//   //     fileExtension ===
//   //     "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
//   //   ) {
//   //     //blob = htmlDocx.asBlob(html);
//   //     blob = await htmlToDocx(html);
//   //   } else {
//   //     const plainTextContent = stripHtmlTags(html);
//   //     blob = new Blob([plainTextContent], { type: "text/plain" });
//   //   }

//   //   const formData = new FormData();
//   //   const fileName = `${file.data.name}.${
//   //     fileExtension ===
//   //     "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
//   //       ? "docx"
//   //       : "txt"
//   //   }`;

//   //   formData.append("file", blob, fileName);
//   //   formData.append("name", file.data.name);

//   //   updateFile({
//   //     file: blob,
//   //     name: file.data.name,
//   //   });
//   // };

// //   const lexUpdateFile = async (html: string) => {
//     // setSaving(true);
//     // if (!file?.data?.name) {
//     //   console.log("rest");
//     //   return;
//     // }

//     const fileExtension = file.data.fileExtension;
//     let blob;

//     if (
//       fileExtension ===
//       "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
//     ) {
//       //blob = htmlDocx.asBlob(html);
//       blob = await htmlToDocx(html);
//     } else {
//       // const plainTextContent = stripHtmlTags(html);
//       const plainTextContent = htmlToFormattedText(html);
//       blob = new Blob([plainTextContent], { type: "text/plain" });
//     }

//     const formData = new FormData();
//     // const fileName = `${file.data.name}.${
//     //   fileExtension ===
//     //   "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
//     //     ? "docx"
//     //     : "txt"
//     // }`;

//     // // formData.append("file", blob, fileName);
//     // // formData.append("name", file.data.name);

//     // // updateFile({
//     // //   file: blob,
//     // //   name: file.data.name,
//     // // });

//     // // setSaving(false);
//   };

//   const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
// //   const { setSaving } = useAutoSave();

//   const handleChange = (editor: IDomEditor) => {
//     // console.log(html);

//     if (saveTimeout.current) {
//       clearTimeout(saveTimeout.current);
//       console.log("cleared");
//     }

//     saveTimeout.current = setTimeout(() => {
//       lexUpdateFile(editor.getHtml());
//     }, 3000);
//   };

//   useEffect(() => {
//     return () => {
//       if (saveTimeout.current) {
//         clearTimeout(saveTimeout.current);
//       }
//     };
//   }, [content]);

//   // handleChange()

//   const editorContent = (
//     <Editor
//       defaultConfig={editorConfig}
//       value={content}
//       onCreated={setEditor}
//       onChange={(editor) => {
//         setHtml(editor.getHtml());
//         handleChange(editor);
//       }}
//       mode="default"
//       className="h-full bg-transparent"
//       style={{
//         // height: "500px",
//         overflowY: "hidden",
//         // backgroundColor: "#ffffffff",
//       }}
//     />
//   );

//   // const saveButton = (
//   //   <div className="flex justify-end my-4">
//   //     <button
//   //       onClick={handleUpdateFile}
//   //       className="bg-orange text-white rounded-full px-4 py-2"
//   //     >
//   //       {isUpdating ? <Loader loading={isUpdating} /> : "Save"}
//   //     </button>
//   //   </div>
//   // );

//   const router = useRouter();
//   const { activeSection } = useActiveSectionStore();

//   useEffect(() => {
//     if (activeSection === "keywords") {
//       router.push(`/notes/view/${params.id}/keywords`);
//     }
//     if (activeSection === "text-to-speech") {
//       router.push(`/notes/view/${params.id}/text-to-speech`);
//     }
//     if (activeSection === "view") {
//       router.push(`/notes/view/${params.id}`);
//     }
//   }, [activeSection, router]);

//   const editorRef = useRef(null);

//   const getWordAtRange = (range: Range) => {
//     const startOffset = range.startOffset;
//     const textNode = range.startContainer;

//     if (textNode.nodeType === Node.TEXT_NODE) {
//       const text = textNode.textContent;
//       const beforeCursor = text?.slice(0, startOffset);
//       const afterCursor = text?.slice(startOffset);

//       const start = beforeCursor?.search(/\b\w+$/);
//       const end = afterCursor?.search(/\W/);

//       const wordStart = start !== -1 ? start : 0;
//       const wordEnd = end && end !== -1 ? startOffset + end : text?.length;

//       return text?.slice(wordStart, wordEnd).trim();
//     }
//     return null;
//   };

//   const handleTextClick = (event: React.MouseEvent<HTMLDivElement>) => {
//     // const { clientX, clientY } = event;
//     // const range = document.caretRangeFromPoint(clientX, clientY);

//     const selectedText = window.getSelection()?.toString().trim();

//     if (selectedText) {
//       if (selectedText.split(" ").length > 1) {
//         return;
//       } else {
//         const word = selectedText;
//         if (word) {
//           setSelectedWord(word);
//           setOpenDefinitionOnClick(true);
//         }
//       }
//     }
//   };

//   return (
//     <div>
//       <FileLayout
//         sideContent={sideContent}
//         toolbar={
//           customToolbar ? (
//             customToolbar
//           ) : (
//             <div className="flex items-center ">
//               <Toolbar
//                 editor={editor}
//                 defaultConfig={toolbarConfig}
//                 mode="default"
//                 className="bg-transparent"
//               />

//               {!isFetching && (
//                 <div className="flex items-center justify-start space-x-1">
//                   <BackgroundEditor />

//                   <WordSpacingEditor />

//                   <LetterSpacingEditor />
//                 </div>
//               )}
//             </div>
//           )
//         }
//       >
//         {isFetching ? (
//           <Loader loading size={30} color="#2D2E47" />
//         ) : (
//           <>
//             <div onClick={handleTextClick} className="">
//               {editorContent}
//             </div>
//             {/* {saveButton} */}
//           </>
//         )}
//       </FileLayout>

//     </div>
//   );
// };

// export default FileViewer;

"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { IDomEditor, IEditorConfig, IToolbarConfig } from "@wangeditor/editor";
import "@wangeditor/editor/dist/css/style.css"; // Editor styles

const Editor = dynamic(
  () => import("@wangeditor/editor-for-react").then((mod) => mod.Editor),
  { ssr: false }
);

const Toolbar = dynamic(
  () => import("@wangeditor/editor-for-react").then((mod) => mod.Toolbar),
  { ssr: false }
);

const FileViewer = () => {
  const [editor, setEditor] = useState<IDomEditor | null>(null);
  const [html, setHtml] = useState("<p>Start editing...</p>");

  // const editorRef = useRef<HTMLDivElement>(null);

  const editorConfig: Partial<IEditorConfig> = {
    placeholder: "Type here...",
    MENU_CONF: {
      fontFamily: {
        fontFamilyList: [
          { value: "OpenDyslexic, sans-serif", name: "Open Dyslexic" },
          { value: "ABeeZee, sans-serif", name: "ABeeZee" },
          { value: "Andika, sans-serif", name: "Andika" },
          { value: "Arial, sans-serif", name: "Arial" },
          { value: "Calibri, sans-serif", name: "Calibri" },
          { value: "CenturyGothic, sans-serif", name: "Century Gothic" },
          { value: "Comic Sans MS, sans-serif", name: "Comic Sans MS" },
          { value: "Courier New, monospace", name: "Courier New" },
          { value: "DyslexieRegular, sans-serif", name: "Dyslexie Regular" },
          { value: "Fira Sans, sans-serif", name: "Fira Sans" },
          { value: "Helvetica, sans-serif", name: "Helvetica" },
          { value: "Lato, sans-serif", name: "Lato" },
          { value: "Lexend, sans-serif", name: "Lexend" },
          { value: "Libre Franklin, sans-serif", name: "Libre Franklin" },
          { value: "Mabry Pro, sans-serif", name: "Mabry Pro" },
          { value: "Nunito, sans-serif", name: "Nunito" },
          { value: "Open Sans, sans-serif", name: "Open Sans" },
          { value: "Poppins, sans-serif", name: "Poppins" },
          { value: "PT Sans, sans-serif", name: "PT Sans" },
          { value: "Roboto, sans-serif", name: "Roboto" },
          {
            value: "SylexiadSansSpacedMed, sans-serif",
            name: "SylexiadSansSpacedMed",
          },
          { value: "Tahoma, sans-serif", name: "Tahoma" },
          { value: "Trebuchet MS, sans-serif", name: "Trebuchet MS" },
          { value: "Verdana, sans-serif", name: "Verdana" },
        ],
      },
    },
    onCreated: (editorInstance: IDomEditor) => {
      setEditor(editorInstance);
    },
    onDestroyed: () => {
      setEditor(null);
    },
  };

  useEffect(() => {
    import("@wangeditor/editor").then(({ i18nChangeLanguage }) => {
      i18nChangeLanguage("en");
    });
    // console.log(editorConfig.MENU_CONF);
  }, [editorConfig]);

  // Toolbar configuration
  const toolbarConfig: Partial<IToolbarConfig> = {
    toolbarKeys: [
      "undo",
      "redo",
      "fontFamily",
      "fontSize",
      "bold",
      "italic",
      "underline",
      "sup",
      "sub",
      "justifyLeft",
      "justifyCenter",
      "justifyRight",
      "bgColor",
      "color",
      "lineHeight",
    ],
  };
  // Editor configuration

  useEffect(() => {
    return () => {
      if (editor) {
        editor.destroy();
        setEditor(null);
      }
    };
  }, [editor]);

  useEffect(() => {
    console.log(`This is the print ${window?.Telegram?.WebApp?.initData}`);
    // }
  }, []);

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="w-4/5 bg-white rounded shadow-lg p-4">
        <Toolbar
          editor={editor}
          defaultConfig={toolbarConfig}
          className="border-b mb-4 rounded-3xl"
        />
        <Editor
          defaultConfig={editorConfig}
          value={html}
          onChange={(editor) => setHtml(editor.getHtml())}
          mode="default"
          style={{ height: "500px", overflowY: "auto" }}
        />
      </div>
    </div>
  );
};

export default FileViewer;
