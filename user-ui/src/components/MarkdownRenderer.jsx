import React from 'react';

export default function MarkdownRenderer({ text }) {
  if (! text) return null;

  // Parse markdown and convert to React elements
  const parseMarkdown = (markdown) => {
    const lines = markdown.split('\n');
    const elements = [];
    let currentParagraph = [];

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();

      // Handle headings (# ## ### etc)
      if (trimmedLine. startsWith('#')) {
        if (currentParagraph.length > 0) {
          elements. push(
            <p key={`p-${index}`} className="md-paragraph">
              {parseLine(currentParagraph.join(' '))}
            </p>
          );
          currentParagraph = [];
        }

        const headingLevel = trimmedLine.match(/^#+/)[0]. length;
        const headingText = trimmedLine.replace(/^#+\s/, '');
        const HeadingTag = `h${Math.min(headingLevel, 6)}`;

        elements.push(
          React.createElement(
            HeadingTag,
            { key: `h-${index}`, className: `md-heading md-h${headingLevel}` },
            parseLine(headingText)
          )
        );
      }
      // Handle list items (- or *)
      else if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
        if (currentParagraph.length > 0) {
          elements.push(
            <p key={`p-${index}`} className="md-paragraph">
              {parseLine(currentParagraph.join(' '))}
            </p>
          );
          currentParagraph = [];
        }

        const listText = trimmedLine.replace(/^[-*]\s/, '');
        elements.push(
          <li key={`li-${index}`} className="md-list-item">
            {parseLine(listText)}
          </li>
        );
      }
      // Handle empty lines
      else if (trimmedLine === '') {
        if (currentParagraph.length > 0) {
          elements.push(
            <p key={`p-${index}`} className="md-paragraph">
              {parseLine(currentParagraph.join(' '))}
            </p>
          );
          currentParagraph = [];
        }
      }
      // Regular text
      else {
        currentParagraph.push(line);
      }
    });

    // Push remaining paragraph
    if (currentParagraph.length > 0) {
      elements.push(
        <p key={`p-end`} className="md-paragraph">
          {parseLine(currentParagraph.join(' '))}
        </p>
      );
    }

    // Wrap list items in ul
    const wrappedElements = [];
    let currentList = [];

    elements.forEach((el, idx) => {
      if (el. type === 'li') {
        currentList.push(el);
      } else {
        if (currentList.length > 0) {
          wrappedElements.push(
            <ul key={`ul-${idx}`} className="md-list">
              {currentList}
            </ul>
          );
          currentList = [];
        }
        wrappedElements. push(el);
      }
    });

    if (currentList.length > 0) {
      wrappedElements.push(
        <ul key="ul-end" className="md-list">
          {currentList}
        </ul>
      );
    }

    return wrappedElements;
  };

  const parseLine = (line) => {
    const parts = [];
    const regex = /\*\*([^*]+)\*\*|__([^_]+)__|_([^_]+)_|`([^`]+)`/g;
    let lastPos = 0;
    let match;

    while ((match = regex.exec(line)) !== null) {
      // Add text before match
      if (match. index > lastPos) {
        parts.push(line.substring(lastPos, match.index));
      }

      // Add formatted text
      if (match[1]) {
        // Bold
        parts.push(
          <strong key={`bold-${parts.length}`} className="md-bold">
            {match[1]}
          </strong>
        );
      } else if (match[2] || match[3]) {
        // Italic
        parts.push(
          <em key={`italic-${parts. length}`} className="md-italic">
            {match[2] || match[3]}
          </em>
        );
      } else if (match[4]) {
        // Code
        parts.push(
          <code key={`code-${parts.length}`} className="md-code">
            {match[4]}
          </code>
        );
      }

      lastPos = regex.lastIndex;
    }

    // Add remaining text
    if (lastPos < line.length) {
      parts.push(line.substring(lastPos));
    }

    return parts. length > 0 ? parts : line;
  };

  return <div className="markdown-renderer">{parseMarkdown(text)}</div>;
}