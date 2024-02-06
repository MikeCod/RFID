
const fs = require('fs');
const form = {
  
    "name": "Nightmare",
    "email": "mike@dark.or",
    "password": "a39582b95b893d5042d946af0029bb6efdd3dca2dc17be8474920278684a84aa",
    "phone": "+33666666666",
    "form": {
        "target_1": 1,
        "target-area": 0,
        "doors": 1,
        "critical": 1,
        "security-type": 0,
        "technology": 0,
        "technology-1": 1,
        "nfc": 0,
        "permissions": 5,
        "permissions-revokation": 0,
        "permissions-revokation-recent": 0,
        "kpi-respected": 0,
        "enterprise-size": 2,
        "enterprise-domain": 4,
        "enterprise-security-level":1
      }
}

function generateMarkdownText(formData) {
    let markdownText = `
# USER INFORMATION

- **Name:** ${formData.name}
- **Email:** ${formData.email}
- **Phone:** ${formData.phone}
`;
if (formData.form.doors === 1 && formData.form.critical === 1 && formData.form["security-type"] === 0) {
    markdownText += `
## Physical Access

Solution : Un système plus robuste et des fonctionnalités de gestion avancées sont nécessaires pour gérer efficacement un plus grand nombre de portes.
La gestion des utilisateurs devient plus complexe. Des fonctionnalités avancées telles que la gestion des groupes d'utilisateurs, les autorisations granulaires et les horaires d'accès doivent être prises en compte.
Un système centralisé avec une interface utilisateur avancée est souvent nécessaire pour gérer efficacement l'accès à plusieurs portes depuis un emplacement central.
`;
}   
if (formData.form.technology === 0 && formData.form["technology-1"] === 1 && formData.form.nfc === 0) {
    markdownText += `
## Technology Information

Les NFC de type A et Bsont largement compatibles avec de nombreux dispositifs et systèmes de lecture NFC, ce qui facilite leur intégration dans les solutions de sécurité d'accès existantes.
NFC de type A offrent une capacité de stockage raisonnable pour stocker des informations d'identification ou des données d'accès, ce qui les rend adaptés à une variété d'applications de sécurité.
De Plus Les fournisseurs de services de stockage externalisé investissent souvent dans des centres de données hautement sécurisés avec des mesures de sécurité physiques avancées, telles que la surveillance 24/7
`;
}
    return markdownText;
}

const markdownContent = generateMarkdownText(form);

// Écrire le contenu Markdown dans un fichier
fs.writeFileSync('output.md', markdownContent);
