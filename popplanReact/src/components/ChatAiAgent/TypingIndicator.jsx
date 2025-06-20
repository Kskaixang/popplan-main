import React, { useEffect, useState } from 'react';
//這邊只是對話中動畫
const TypingIndicator = () => {
  const [dotCount, setDotCount] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setDotCount(c => (c >= 3 ? 1 : c + 1));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <style>{`
        .bubble {
          display: inline-flex;
          align-items: center;
          padding: 8px 14px;
          background: #ececec;
          border-radius: 18px 18px 18px 4px;
          font-family: monospace;
          font-weight: 700;
          font-size: 20px;
          color: #444;
          user-select: none;
          position: relative;
          width: fit-content;
        }
        .bubble::before {
          content: '';
          position: absolute;
          bottom: 0;
          left: -12px;
          width: 0;
          height: 0;
          border-top: 12px solid #ececec;
          border-right: 12px solid transparent;
        }
        .dots {
          margin-left: 8px;
          display: flex;
          gap: 4px;
        }
        .dot {
          width: 8px;
          height: 8px;
          background: #444;
          border-radius: 50%;
          opacity: 0.3;
          animation: blink 1.5s infinite;
        }
        .dot:nth-child(1) {
          animation-delay: 0s;
        }
        .dot:nth-child(2) {
          animation-delay: 0.3s;
        }
        .dot:nth-child(3) {
          animation-delay: 0.6s;
        }
        @keyframes blink {
          0%, 20%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
      `}</style>

      <span className="dots" aria-hidden="true">
        {[...Array(dotCount)].map((_, i) => (
          <span key={i} className="dot"></span>
        ))}
      </span>
    </>
  );
};

export default TypingIndicator;
