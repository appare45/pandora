import { useRef, useState } from 'react';
import Action_button from './ActionButton';
import ActionCard from './ActionCard';

function FilePreview(props: { files: FileList }) {
  const elements: JSX.Element[] = [];
  for (let i = 0; i < props.files.length; i++) {
    const file = props.files[i];
    if (file.type.match(/image\/.+/)) {
      elements.push(<img src={URL.createObjectURL(file)} />);
    }
  }
  return (
    <div className="flex overflow-x-scroll h-40">
      {elements.map((element) => (
        <figure className="flex-1 min-w-full overflow-hidden">{element}</figure>
      ))}
    </div>
  );
}

export default function ContentsUpload() {
  const input = useRef<null | HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<null | FileList>();
  return (
    <ActionCard>
      <div>
        <div className="text-gray-500 flex justify-center p-3 flex-col items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-10"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <input
            type="file"
            name="ファイルを選択"
            id="file"
            required
            multiple
            accept="image/*,video/*"
            onChange={(e) => setSelectedFiles(input.current.files)}
            ref={input}
            className="p-1"
          />
          <p className="text-sm">アップロードするファイルを選択してください</p>
        </div>
      </div>
      {selectedFiles?.length && <FilePreview files={selectedFiles} />}
      <Action_button>アップロード</Action_button>
    </ActionCard>
  );
}
