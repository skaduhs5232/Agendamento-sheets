const fs = require("fs");
const path = require("path");

// Carrega a configuração do JSON
const config = require("./config.json");

// Função para adicionar o link do CSS global ao arquivo HTML
function addGlobalStylesheet(htmlFilePath, stylesheetPath) {
  const fileContent = fs.readFileSync(htmlFilePath, "utf-8");

  // Verifica se o CSS já foi adicionado
  if (fileContent.includes(stylesheetPath)) {
    console.log(`${htmlFilePath} já contém o CSS global.`);
    return;
  }

  const updatedContent = fileContent.replace(
    /(<\/head>)/i,
    `    <link rel="stylesheet" href="${stylesheetPath}">\n$1`
  );

  fs.writeFileSync(htmlFilePath, updatedContent, "utf-8");
  console.log(`CSS global adicionado ao ${htmlFilePath}`);
}

// Função para adicionar o link do favicon ao arquivo HTML
function addFavicon(htmlFilePath, faviconPath) {
  const fileContent = fs.readFileSync(htmlFilePath, "utf-8");

  // Verifica se o favicon já foi adicionado
  if (fileContent.includes(faviconPath)) {
    console.log(`${htmlFilePath} já contém o favicon.`);
    return;
  }

  const updatedContent = fileContent.replace(
    /(<\/head>)/i,
    `    <link rel="icon" href="${faviconPath}" type="image/x-icon">\n$1`
  );

  fs.writeFileSync(htmlFilePath, updatedContent, "utf-8");
  console.log(`Favicon adicionado ao ${htmlFilePath}`);
}

// Aplica a configuração a todos os arquivos HTML especificados
config.htmlFiles.forEach((htmlFile) => {
  const htmlFilePath = path.resolve(__dirname, htmlFile);
  addGlobalStylesheet(htmlFilePath, config.globalStylesheet);
  addFavicon(htmlFilePath, config.faviconPath); // Adiciona o favicon
});

console.log("Configuração aplicada com sucesso!");
