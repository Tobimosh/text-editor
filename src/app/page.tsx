import dynamic from "next/dynamic";

const DynamicFileViewer = dynamic(() => import("../components/FileEditor"), {
  ssr: false,
  loading: () => <p>loading</p>,
});

export default function Home() {
  return <DynamicFileViewer />;
}
