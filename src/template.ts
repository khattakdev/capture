const handleMultiLines = (content: string) => {
  const lines = content.split("\n");
  const joinLines = lines.map((line) => `<pre><code>${line}</code></pre>`);
  const htmlContent = joinLines.join("");
  return htmlContent;
};

const generateTemplate = (content: string) => {
  return `
    <html lang="en">
    <head>
      <style>
        body {
          background: #282c33;
          padding: 0px;
          margin: 0px;
        }
  
        .header {
          background: #343840;
          height: 50px;
          width: full;
          position: relative;
        }
  
        .dots {
          position: absolute;
          top: 50%;
          left: 4%;
          transform: translateY(-50%);
          display: flex;
        }
  
        .dot {
          height: 15px;
          width: 15px;
          border-radius: 50%;
          margin: 0px 5px;
        }
  
        .dot-1 {
          left: 2%;
          background: #e74c3c;
        }
  
        .dot-2 {
          background: #f1c40f;
        }
  
        .dot-3 {
          background: #2ecc71;
        }
  
        .body {
          color: white;
          padding: 5px;
          font-size: 28px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="dots">
          <div class="dot dot-1"></div>
          <div class="dot dot-2"></div>
          <div class="dot dot-3"></div>
        </div>
      </div>
      <div class="body">
           ${handleMultiLines(content)}
      </div>
    </body>
  </html>`;
};

export default generateTemplate;
