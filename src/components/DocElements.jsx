import React from 'react';

export function DocHeading({ level = 2, id, children, className = '' }) {
  const Tag = `h${level}`;
  return (
    <Tag id={id} className={`docs-heading docs-h${level} ${className}`.trim()}>
      {children}
    </Tag>
  );
}

export function DocParagraph({ children, className = '' }) {
  return (
    <p className={`docs-paragraph ${className}`.trim()}>
      {children}
    </p>
  );
}

export function InlineCode({ children, className = '' }) {
  return (
    <code className={`docs-inline-code ${className}`.trim()}>
      {children}
    </code>
  );
}
