const plantUMLDarkMode = `
  !include https://raw.githubusercontent.com/patrik-csak/one-dark-plantuml-theme/v1.0.1/theme.puml
`;

// convertToPlantUmlImage 
async function convertToPlantUmlImage(plantUmlCode) {
  const plantUmlServerUrl = await getPlantUMLServerUrl();
  const encodedCode = plantumlEncoder.encode(plantUMLDarkMode + plantUmlCode);

  const response = await fetch(`${plantUmlServerUrl}/svg/${encodedCode}`);

  if (!response.ok) {
    throw new Error("Failed to fetch PlantUML image");
  }
  const svgText = await response.text();
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgText);
}

// add the copy button on code block.
function addCopyBtn(document,codeBlock) {
  // Create a wrapper for the code block and the copy button.
  let wrapper = document.createElement("div");
  wrapper.style.position = "relative";

  // Move the code block inside the wrapper.
  codeBlock.parentNode.insertBefore(wrapper, codeBlock);
  wrapper.appendChild(codeBlock);

  // Add copy button
  let copyBtn = document.createElement("button");
  copyBtn.textContent = "Copy";
  copyBtn.style.position = "absolute";
  copyBtn.style.right = "0px";
  copyBtn.style.top = "0px";
  copyBtn.style.zIndex = 1;
  copyBtn.className = "copy-btn";

  // Attach click event
  copyBtn.onclick = function () {
    let text = codeBlock.textContent;
    navigator.clipboard
      .writeText(text)
      .then(() => {
        // Change the button text to "Copied!"
        copyBtn.textContent = "Copied!";

        // Change the button text back to "Copy" after 2 seconds
        setTimeout(() => {
          copyBtn.textContent = "Copy";
        }, 2000);
      })
      .catch((err) => {
        console.error("Could not copy text: ", err);
      });
  };

  // Append the copy button to the wrapper.
  wrapper.appendChild(copyBtn);
}

// handleConvertMarkdownToHtml
async function handleConvertMarkdownToHtml(response) {
  if (response && response.htmlContent) {
    // add article tage to apply the markdown style(dark-dimmed).
    const articleElement = document.createElement('article');
    articleElement.innerHTML = response.htmlContent;
    articleElement.classList.add('markdown-body');
    document.body.innerHTML = '';
    document.body.appendChild(articleElement);

    const codeBlocks = Array.from(
      document.querySelectorAll("code[class^=language-]")
    );

    for (const codeBlock of codeBlocks) {
      // plantuml
      if (codeBlock.className == "language-plantuml") {
        const plantUmlCode = codeBlock.innerText;
        const plantUmlImage = await convertToPlantUmlImage(plantUmlCode);

        const imgElement = document.createElement("img");
        imgElement.src = plantUmlImage;
        imgElement.alt = "Generated PlantUML Diagram";

        codeBlock.parentElement.replaceChild(imgElement, codeBlock);
      } else {
        addCopyBtn(document,codeBlock);
      }
    };
  } else {
    console.error("Error: Unable to get the converted HTML content.");
  }
}

// This function is automatically invoked when the MD file is loaded.
// Send a message to the background service to convert the Markdown file to an HTML file.
chrome.runtime.sendMessage(
  { action: "convertMarkdownToHtml", markdown: document.body.textContent },
  handleConvertMarkdownToHtml
);




