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




