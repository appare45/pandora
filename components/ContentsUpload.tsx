import { useRef, useState } from 'react';
import Action_button from './ActionButton';
import ActionCard from './ActionCard';

function FilePreview(props: { files: FileList }): JSX.Element {
  const elements: JSX.Element[] = [];
  for (let i = 0; i < props.files.length; i++) {
    const videoRef = useRef<HTMLVideoElement>();
    const file = props.files[i];
    elements.push(
      <div className="p-2 rounded bg-gray-50 my-2">
        {file.type.match(/image\/.+/) ? (
          <img
            src={URL.createObjectURL(file)}
            className="w-full h-48 object-contain"
          />
        ) : (
          <video
            src={URL.createObjectURL(file)}
            className="w-full h-48 object-contain"
            controls
            disablePictureInPicture
            controlsList="nodownload"
            ref={videoRef}
          />
        )}
        <div className="flex justify-between items-baseline">
          <p className="truncate">{file.name}</p>
          <p className="opacity-70 text-sm">
            {!!videoRef.current?.duration
              ? Math.round(videoRef.current.duration) < 60
                ? `${Math.round(videoRef.current.duration)}秒`
                : `${Math.round(videoRef.current.duration / 60)}分`
              : file.size > 10000
              ? `${Math.round(file.size / 125000)}MB`
              : `${Math.round(file.size / 125)}KB`}
          </p>
        </div>
      </div>
    );
  }
  return <div className="">{elements}</div>;
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
