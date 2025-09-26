import React, { useEffect, useState } from 'react';

const SK = () => {
  const [content, setContent] = useState('');

  useEffect(() => {
    fetch('/S&K.txt')
      .then((res) => res.text())
      .then((text) => setContent(text));
  }, []);

  const formatText = (text) => {
    text = text.replace(
      /^\*?(.*?)\n/,
      "<b>$1</b><br/><br/>"
    );

    text = text.replace(
      /^(\d+\.)/gm,
      "<b>$1</b>"
    );

    return text.replace(/\n/g, "<br/>"); 
  };

  return (
    <div className="mt-[21px] ml-[54px] mr-[54px] text-justify">
      <div dangerouslySetInnerHTML={{ __html: formatText(content) }} />
    </div>
  );
};

export default SK;
