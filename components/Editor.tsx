import 'react';
import React, { useEffect, useRef, useState } from 'react';
function Preview(props: { children; currentDocument: string[] }) {
  const [renderedHtml, updateRenderedHtml] = useState<JSX.Element>();
  function renderTitle(content: string, level: number) {
    return React.createElement(
      `h${level}`,
      { className: 'font-bold' },
      content
    );
  }
  function renderPreview(document: string[]) {
    document.forEach((line) => {
      if (!!line.match(/#.+/gm)) {
        updateRenderedHtml(renderTitle(line.match(/#.+/gm)[0], 1));
        console.log(renderedHtml);
      }
    });
  }
  useEffect(() => {
    renderPreview(props.currentDocument);
  }, [props.currentDocument]);
  return <div className="bg-gray-50 w-full h-40 p-1">{renderedHtml}</div>;
}
function Editor(props: { update: Function }) {
  const ref = useRef<HTMLTextAreaElement>();
  return (
    <textarea
      className="bg-gray-100 w-full h-40 p-1"
      onKeyUp={() => props.update(ref.current.value.split('\n'))}
      ref={ref}
    ></textarea>
  );
}
export default function Editors() {
  const [editingDocument, updateEditingDocument] = useState<string[]>([]);
  return (
    <div className="p-5">
      <Editor update={updateEditingDocument} />
      <Preview currentDocument={editingDocument}>これはテストです</Preview>
    </div>
  );
}
