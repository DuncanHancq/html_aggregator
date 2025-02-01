const fs = require('fs').promises; // Importer le module fs

// Fonction pour lire la configuration à partir du fichier JSON
async function readConfig() {
    const configData = await fs.readFile('config.json', 'utf-8');
    return JSON.parse(configData);
}

// Fonction pour récupérer le contenu des fichiers
async function fetchFiles(files) {
    const content = {
        cdn: '',
        html: '',
        css: '',
        js: ''
    };

    for (const file of files) {
        const text = await fs.readFile(file.path, 'utf-8');

        switch (file.type) {
            case 'cdn':
                content.cdn += text;
                break;
            case 'html':
                content.html += text;
                break;
            case 'css':
                content.css += text;
                break;
            case 'js':
                content.js += text;
                break;
            default:
                console.log(`Le fichier suivant à été ignoré : ${file.path}\n`);
                break;
        }
    }

    return content;
}

// Fonction pour créer le fichier HTML agrégé
async function createAggregatedFile() {
    const config = await readConfig();
    const content = await fetchFiles(config.files);

    // Lire le template HTML
    const template = await fs.readFile('template.html', 'utf-8');

    // Insérer le contenu agrégé dans le template
    const aggregatedHTML = template.replace('## CDN ##', `${content.cdn}`)
                                   .replace('## HTML ##', `${content.html}`)
                                   .replace('## CSS ##', `${content.css}`)
                                   .replace('## JS ##', `${content.js}`);

    // Écrire le fichier HTML agrégé
    await fs.writeFile(config.outputFile, aggregatedHTML, 'utf-8');
    console.log(`Fichier HTML agrégé créé : ${config.outputFile}`);
}

// Appel de la fonction pour créer le fichier
createAggregatedFile();