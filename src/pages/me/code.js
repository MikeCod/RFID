

// GENERATION DU STANDARD DE SECURITE 
// On recupère le dictionnaire de donnée d'un user (MikeCod)
function findFormDictionary(inputDict) {
    // Vérifier si l'input est un objet et n'est pas vide
    if (typeof inputDict === 'object' && inputDict !== null) {
        // Parcourir les clés du dictionnaire
        for (let key in inputDict) {
            // Si la clé est "form", retourner le dictionnaire associé
            if (key === 'form') {
                return inputDict[key];
            }
            // Si la valeur associée à la clé est elle-même un objet, récursivement chercher dans cet objet
            if (typeof inputDict[key] === 'object' && inputDict[key] !== null) {
                const result = findFormDictionary(inputDict[key]);
                // Si le résultat est trouvé, le retourner
                if (result !== undefined) {
                    return result;
                }
            }
        }
    }
    // Si la clé "form" n'est pas trouvée, retourner undefined
    return undefined;
}

