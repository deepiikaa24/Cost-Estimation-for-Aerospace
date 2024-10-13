import React, { useEffect, useRef } from 'react';

const GradioEmbed = () => {
  const iframeRef = useRef(null);

  useEffect(() => {
    const handleIframeLoad = () => {
      if (iframeRef.current) {
        iframeRef.current.style.height = `${iframeRef.current.contentWindow.document.body.scrollHeight}px`;
      }
    };

    if (iframeRef.current) {
      iframeRef.current.addEventListener('load', handleIframeLoad);
    }

    return () => {
      if (iframeRef.current) {
        iframeRef.current.removeEventListener('load', handleIframeLoad);
      }
    };
  }, []);

  return (
    <div className="gradio-embed">
      <iframe
        ref={iframeRef}
        src="http://127.0.0.1:7860"
        width="100%"
        height="500px"
        frameBorder="0"
        title="Gradio Interface"
      />
    </div>
  );
};

export default GradioEmbed;