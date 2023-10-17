const shiki = require("shiki");

const highlightCode = async (content: string,themeName: string) => {
  const highlighter = await shiki.getHighlighter({
    theme: themeName, // You can specify other themes like 'dark-plus', 'light-plus', etc.
  });

  const htmlContent = highlighter.codeToHtml(content, "javascript");
  return await htmlContent;
};

const generateTemplate = async (content: string, themeName: string) => {
  // get background color from the theme.
  const highlighter = await shiki.getHighlighter({
    theme: themeName,
  });
  const backgroundClr = highlighter.getBackgroundColor();
  
  return `
    <html lang="en">
    <head>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.26.0/themes/prism.css" rel="stylesheet" />
      <style>

        body {
          background: ${backgroundClr};
          padding: 0px;
          margin: 0px;
          font-family: 'Cascadia Code PL', sans-serif;
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
          height: 30px;
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
           ${await highlightCode(content,themeName)}
      </div>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.26.0/prism.js"></script>
    </body>
  </html>`;
};

export default generateTemplate;
