import { useRef, useState } from 'react';
import Action_button from './ActionButton';
import ActionCard from './ActionCard';
import TrueFalseSelect from './TrueFalseSelect';

function FilePreview(props: { file: File }): JSX.Element {
  const videoRef = useRef<HTMLVideoElement>();
  const [onFace, setOnFace] = useState<boolean>();
  return (
    <div className="p-2 rounded bg-gray-50 my-2 flex-1 md:flex md:items-center w-7xl">
      {props.file.type.match(/image\/.+/) ? (
        <img
          src={URL.createObjectURL(props.file)}
          className="w-full md:max-w-sm h-36 object-contain"
        />
      ) : (
        <video
          src={URL.createObjectURL(props.file)}
          className="w-full h-36 md:max-w-sm object-contain"
          controls
          disablePictureInPicture
          controlsList="nodownload"
          ref={videoRef}
        />
      )}
      <div className="md:flex-grow md:mx-3">
        <div className="flex justify-between items-baseline">
          <p className="truncate">{props.file.name}</p>
          <p className="opacity-70 text-sm">
            {!!props.file.type.match(/video\/.+/) &&
              videoRef.current?.duration &&
              (Math.round(videoRef.current.duration) < 60
                ? `${Math.round(videoRef.current.duration)}秒`
                : `${Math.round(videoRef.current.duration / 60)}分`)}
          </p>
        </div>
        <TrueFalseSelect
          onChange={setOnFace}
          trueString="顔が写っている"
          falseString="顔が写っていない"
          selected={onFace}
        />
      </div>
    </div>
  );
}

export default function ContentsUpload() {
  const input = useRef<null | HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<null | FileList>();
  const filePreview: JSX.Element[] = [];
  if (!!selectedFiles?.length) {
    for (let index = 0; index < selectedFiles.length; index++) {
      filePreview.push(<FilePreview file={selectedFiles[index]} />);
    }
  }

  return (
    <ActionCard>
      <div className="w-full">
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
            onChange={() => setSelectedFiles(input.current.files)}
            ref={input}
            className="p-1"
          />
          <p className="text-sm">アップロードするファイルを選択してください</p>
        </div>
        <div className="md:flex md:flex-col items-center">
          {!!selectedFiles?.length && filePreview}
        </div>
        <Action_button>アップロード</Action_button>
      </div>
    </ActionCard>
  );
}
