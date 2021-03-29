import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import Action_button from './ActionButton';
import ActionCard from './ActionCard';
import TrueFalseSelect from './TrueFalseSelect';

interface fileData {
  file: File;
  onFace: boolean | null;
}

const fileDataContext = createContext<fileData[]>([]);

// メディア（要素）
const MediaMemo = React.memo(
  (props: {
    file: File;
    videoRef?: React.MutableRefObject<HTMLVideoElement>;
  }) => {
    const [previewState, updatePreviewState] = useState<'fill' | 'contain'>(
      'contain'
    );
    return (
      <>
        {props.file.type.match(/image\/.+/) ? (
          <img
            src={URL.createObjectURL(props.file)}
            className={`flex-1 w-full md:w-auto md:max-w-sm h-48 cursor-pointer ${
              previewState == 'contain' ? 'object-contain' : 'object-cover'
            }`}
            onClick={() => {
              updatePreviewState(previewState == 'fill' ? 'contain' : 'fill');
            }}
          />
        ) : (
          <video
            src={URL.createObjectURL(props.file)}
            className="w-full md:w-auto h-48 md:max-w-sm object-contain flex-1"
            controls
            disablePictureInPicture
            controlsList="nodownload"
            ref={props.videoRef}
          />
        )}
      </>
    );
  }
);

// ビデオの長さ表示用
function VideoDuration(props: { element: HTMLVideoElement }) {
  return (
    <span className=" whitespace-nowrap">
      {!!props.element?.duration &&
        (Math.round(props.element?.duration) < 60
          ? `${Math.round(props.element?.duration)}秒`
          : `${Math.round(props.element?.duration / 60)}分`)}
    </span>
  );
}

function FilePreview(props: { fileData: fileData }): JSX.Element {
  const videoRef = useRef<HTMLVideoElement>();
  const [onFace, setOnFace] = useState<boolean>();
  return (
    <div className="p-2 rounded bg-gray-50 my-2 flex-1 md:flex md:items-center w-full shadow-md md:px-6">
      <MediaMemo file={props.fileData.file} videoRef={videoRef} />
      <div className="md:flex-1 md:mx-4 md:ml-6">
        <div className="flex justify-between items-baseline mb-2 ">
          <p className="truncate md:text-lg">{props.fileData.file.name}</p>
          <p className="opacity-70 text-sm">
            {!!props.fileData.file.type.match(/video\/.+/) && (
              <VideoDuration element={videoRef.current} />
            )}
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
  const [filePreview, setFilePreview] = useState<JSX.Element[]>([]);

  const [fileData, setFileData] = useState<fileData[]>(
    useContext<fileData[]>(fileDataContext)
  );

  useEffect(() => {
    if (!!selectedFiles?.length) {
      const fileDataTemp: fileData[] = [];
      for (let index = 0; index < selectedFiles.length; index++) {
        fileDataTemp.push({ file: selectedFiles[index], onFace: null });
      }
      setFileData(fileDataTemp);
    } else {
      setFileData([]);
    }
  }, [selectedFiles]);

  useEffect(() => {
    const filePreviewTemp: JSX.Element[] = [];
    if (!!fileData?.length) {
      fileData.forEach((file) => {
        filePreviewTemp.push(<FilePreview fileData={file} />);
      });
      setFilePreview(filePreviewTemp);
    } else {
      setFilePreview([]);
    }
  }, [fileData]);

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
          {filePreview.length < 1 && (
            <p className="text-sm mb-2">
              アップロードするファイルを選択してください
            </p>
          )}
          <input
            type="file"
            name="ファイルを選択"
            id="file"
            required
            multiple
            accept="image/*,video/*"
            onChange={() => setSelectedFiles(input.current.files)}
            ref={input}
            className=" w-28"
          />
        </div>
        <div className="md:flex md:flex-col items-center">
          {!!filePreview?.length && filePreview}
        </div>
        <Action_button
          enabled={!!fileData?.length}
          action={() => console.info(fileData)}
        >
          アップロード
        </Action_button>
      </div>
    </ActionCard>
  );
}
