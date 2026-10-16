// Fills in the <head> tags in index.template.html from config/site.json
// and writes the result to index.html. Run via `npm run build:html`
// whenever config/site.json changes.
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const templatePath = path.join(root, "index.template.html");
const configPath = path.join(root, "config", "site.json");
const outputPath = path.join(root, "index.html");

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const { site } = JSON.parse(fs.readFileSync(configPath, "utf8"));
let html = fs.readFileSync(templatePath, "utf8");

const replacements = {
  "{{TITLE}}": site.title,
  "{{DESCRIPTION}}": site.description,
  "{{OG_TITLE}}": site.ogTitle,
  "{{OG_DESCRIPTION}}": site.ogDescription,
  "{{OG_IMAGE}}": site.ogImage,
  "{{OG_URL}}": site.ogUrl,
};

for (const [token, value] of Object.entries(replacements)) {
  html = html.split(token).join(escapeHtml(value));
}

fs.writeFileSync(outputPath, html);
console.log(`Built index.html from index.template.html + config/site.json`);
