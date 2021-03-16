import Head from 'next/head';
import 'react';
import React, { useEffect, useRef, useState } from 'react';

class EmbedTweet extends React.Component<{ id: string | number }> {
  // Twitter埋め込み
  private target: React.RefObject<HTMLDivElement>;
  constructor(props) {
    super(props);
    this.target = React.createRef();
  }
  componentDidMount() {
    window['twttr'].widgets
      .createTweet(this.props.id, this.target.current, { align: 'center' })
      .then(console.log(`Tweet loaded ${this.props.id}`));
  }

  render() {
    return <div ref={this.target}></div>;
  }
}

function EmbedGoogleDocs(url: string) {
  return (
    <div className="w-full h-72 my-5 md:h-80 flex justify-center">
      <iframe src={url} className="h-full w-full max-w-xl "></iframe>
    </div>
  );
}

function renderHeading(content: string, level: number): JSX.Element {
  // Heading
  // Warning: Not supported end hash type
  // MDN Docs: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Heading_Elements
  // MD Docs: https://daringfireball.net/projects/markdown/syntax#header
  return React.createElement(
    `h${level}`,
    {
      className: `font-bold ${level == 3 && 'text-lg'} ${
        level == 2 && 'text-xl'
      } ${level == 1 && 'text-2xl'}`,
    },
    content.trim().slice(level)
  );
}
function renderImage(src: string, alt?: string): JSX.Element {
  // Image
  return React.createElement('img', { src: src, alt: alt });
}

function renderParagraph(content: string): JSX.Element {
  return React.createElement('p', [], content);
}

function parseMarkdown(document: string): JSX.Element[] {
  // Markdown parser
  if (document == '') {
    return [<p className="text-gray-400">Pandoraエディターへようこそ</p>];
  }
  const renderedElements: JSX.Element[] = [];
  let watchingElementType: 'unordered list' | 'ordered list' | null = null;
  let watchingElements: JSX.Element[] | null = [];
  document.split('\n').forEach((line, index) => {
    let renderedElement: JSX.Element;
    if (line == '') {
      // 改行
      renderedElement = <br />;
    } else if (!!line.match(/^# .+$/gm)) {
      //  Headings
      let headingLevel = 0;
      for (let index = 0; index < line.length; index++) {
        if (line[index] === '#') {
          headingLevel++;
        } else {
          break;
        }
      }
      if (headingLevel > 4) headingLevel = 4;
      renderedElement = renderHeading(line.match(/#.+/gm)[0], headingLevel);
    } else if (!!line.match(/^!\[.*]\(.+\)$/gm)) {
      // Image
      // https://daringfireball.net/projects/markdown/syntax#img
      renderedElement = renderImage(
        line.replace(/.+\]\(/gm, '').replace(/\)/, ''),
        line.replace(/!\[/gm, '').replace(/\].+/gm, '')
      );
    } else if (!!line.match(/^- /gm)) {
      // unordered list
      watchingElementType = 'unordered list';
      watchingElements.push(<li>{line.replace(/^- /gm, '')}</li>);
    } else if (!!line.match(/^[1-9]*\. .+$/gm)) {
      // unordered list
      watchingElementType = 'ordered list';
      watchingElements.push(<li>{line.replace(/^[1-9]*\./gm, '')}</li>);
    } else if (
      !!line.match(/^https:\/\/twitter\.com\/.+\/status\/[0-9]+\??.+?$/gm)
    ) {
      // Twitter
      renderedElement = (
        <EmbedTweet
          id={line
            .replace(/^https:\/\/twitter\.com\/.+\/status\//, '')
            .replace(/\?.+?$/, '')}
        />
      );
    } else if (
      !!line.match(
        /^https:\/\/docs.google.com\/spreadsheets\/d\/.+\/edit[#?]?.*$/gm
      )
    ) {
      // Google Spreadsheets
      renderedElement = EmbedGoogleDocs(
        line.replace(/\/edit[#?]?.*$/gm, '/pubhtml')
      );
    } else if (
      !!line.match(
        /^https:\/\/docs.google.com\/presentation\/d\/.+\/edit[#?]?.*$/gm
      )
    ) {
      // Google slides
      renderedElement = EmbedGoogleDocs(
        line.replace(/\/edit[#?]?.*$/gm, '/embed')
      );
    } else if (
      !!line.match(
        /^https:\/\/docs.google.com\/document\/d\/.+\/edit[#?]?.*$/gm
      )
    ) {
      // Google Documents
      renderedElement = EmbedGoogleDocs(
        line.replace(/\/edit[#?]?.*$/gm, '/pub')
      );
    } else if (
      !!line.match(/^https:\/\/drive\.google\.com\/file\/d\/.+\/view[?#]?.*$/gm)
    ) {
      // Google Drive
      renderedElement = EmbedGoogleDocs(
        line.replace(/\/view[#?]?.*$/gm, '/preview')
      );
    } else if (
      !!line.match(
        /^https:\/\/docs\.google\.com\/forms\/d\/e\/.+\/viewform[?#]?usp=.*/gm
      )
    ) {
      // Google Forms
      renderedElement = EmbedGoogleDocs(
        line.replace(/\/viewform[?#]?usp=.*/gm, '/viewform?embedded=true')
      );
    } else if (!!line.match(/^https:\/\/youtu\.be\/.+$/gm)) {
      // YouTube
      renderedElement = EmbedGoogleDocs(
        line.replace(
          /^https:\/\/youtu\.be\//gm,
          'https://www.youtube-nocookie.com/embed/'
        )
      );
    } else if (!!line.match(/^https:\/\/www\.youtube\.com\/watch\?v=.+$/gm)) {
      // YouTube
      renderedElement = EmbedGoogleDocs(
        line.replace(
          /^https:\/\/www\.youtube\.com\/watch\?v=/gm,
          'https://www.youtube-nocookie.com/embed/'
        )
      );
    } else {
      // 段落
      renderedElement = renderParagraph(line);
    }
    if (!!watchingElementType && watchingElements.length > 0) {
      // 確認中にそれ以外が表れたときに要素を終了させる
      if (
        watchingElementType === 'unordered list' &&
        (!line.match(/^- /gm) || index == document.split('\n').length - 1)
      ) {
        renderedElements.push(
          <ul className=" list-inside list-disc">{watchingElements}</ul>
        );
        watchingElementType = null;
        watchingElements = [];
      } else if (
        watchingElementType === 'ordered list' &&
        (!line.match(/^[1-9]*\. .+$/gm) ||
          index == document.split('\n').length - 1)
      ) {
        renderedElements.push(
          <ol className="list-inside list-decimal">{watchingElements}</ol>
        );
        watchingElementType = null;
        watchingElements = [];
      }
    }

    renderedElements.push(renderedElement);
  });
  return renderedElements;
}
function Preview(props: { currentDocument: string }) {
  const [renderedHtml, updateRenderedHtml] = useState<JSX.Element[]>();
  useEffect(() => {
    updateRenderedHtml(parseMarkdown(props.currentDocument));
  }, [props.currentDocument]);
  return (
    <div className="bg-gray-50 w-full p-3 h-96 overflow-y-scroll break-words md:h-screen">
      {renderedHtml}
    </div>
  );
}
function Editor(props: { update: Function }) {
  const ref = useRef<HTMLTextAreaElement>();
  const [currentValue, setCurrentValue] = useState<string>('');
  useEffect(() => {
    props.update(currentValue);
  }, [currentValue]);
  return (
    <>
      <textarea
        className="bg-gray-100 w-full p-1 h-96 resize-y md:h-screen"
        onInput={() => setCurrentValue(ref.current.value)}
        ref={ref}
        value={currentValue}
      ></textarea>
    </>
  );
}
export default function Editors() {
  const [editingDocument, updateEditingDocument] = useState<string>('');
  return (
    <>
      <Head>
        <script src="https://platform.twitter.com/widgets.js" async></script>
      </Head>
      <div className="p-5 flex flex-col md:flex-row">
        <Preview currentDocument={editingDocument} />
        <Editor update={updateEditingDocument} />
      </div>
    </>
  );
}
