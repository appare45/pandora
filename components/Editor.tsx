import Head from 'next/head';
import 'react';
import React, { useEffect, useRef, useState } from 'react';

function Preview(props: { currentDocument: string[] }) {
  const [renderedHtml, updateRenderedHtml] = useState<JSX.Element[]>();
  class EmbedTweet extends React.Component<{ id: string | number }> {
    // Twitter埋め込み
    private target: React.RefObject<HTMLDivElement>;
    constructor(props) {
      super(props);
      this.target = React.createRef();
    }
    componentDidMount() {
      window['twttr'].widgets
        .createTweet(this.props.id, this.target.current, { align: 'left' })
        .then(console.log(`loaded${this.props.id}`));
    }

    render() {
      return <div ref={this.target}></div>;
    }
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

  function renderPreview(document: readonly string[]) {
    const renderedHtmls: JSX.Element[] = [];
    document.forEach((line) => {
      let renderedElement: JSX.Element;
      if (line == '') {
        // 改行
        renderedElement = <br />;
      } else if (!!line.match(/^#.+/gm)) {
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
      } else if (!!line.match(/!\[.*]\(.+\)/gm)) {
        // Image
        // https://daringfireball.net/projects/markdown/syntax#img
        renderedElement = renderImage(
          line.replace(/.+\]\(/gm, '').replace(/\)/, ''),
          line.replace(/!\[/gm, '').replace(/\].+/gm, '')
        );
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
      } else {
        // 段落
        renderedElement = renderParagraph(line);
      }
      renderedHtmls.push(renderedElement);
    });
    updateRenderedHtml(renderedHtmls);
  }
  useEffect(() => {
    renderPreview(props.currentDocument);
  }, [props.currentDocument]);
  return (
    <div className="bg-gray-50 w-full p-1 h-96 overflow-scroll break-words">
      {renderedHtml}
    </div>
  );
}
function Editor(props: { update: Function }) {
  const ref = useRef<HTMLTextAreaElement>();
  const [currentValue, setCurrentValue] = useState<string>('');
  useEffect(() => {
    props.update(currentValue.split('\n'));
  }, [currentValue]);
  return (
    <>
      <textarea
        className="bg-gray-100 w-full p-1 h-96 resize-y"
        onInput={() => setCurrentValue(ref.current.value)}
        ref={ref}
        value={currentValue}
      ></textarea>
    </>
  );
}
export default function Editors() {
  const [editingDocument, updateEditingDocument] = useState<string[]>([]);
  return (
    <>
      <Head>
        <script src="https://platform.twitter.com/widgets.js"></script>
      </Head>
      <div className="p-5 flex flex-col">
        <Preview currentDocument={editingDocument} />
        <Editor update={updateEditingDocument} />
      </div>
    </>
  );
}
