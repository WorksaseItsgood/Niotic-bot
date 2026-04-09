const fs = require('fs');
const path = require('path');

function walkDir(dir) {
    let files = [];
    const list = fs.readdirSync(dir);
    for (const file of list) {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            files = files.concat(walkDir(filePath));
        } else if (filePath.endsWith('.js')) {
            files.push(filePath);
        }
    }
    return files;
}

const allJsFiles = walkDir(path.join(__dirname, 'src'));

for (const file of allJsFiles) {
    let content = fs.readFileSync(file, 'utf-8');
    let original = content;
    
    // Fix escaped backticks \` => `
    content = content.replace(/\\`/g, '`');
    
    // Fix escaped interpolation \${ => ${
    content = content.replace(/\\\${/g, '${');
    
    // Fix escaped single quotes inside single quotes but wait, if it's l\'Anti-Raid, replacing \\' with ' gives l'Anti-Raid which breaks '... l'Anti-Raid ...'
    // Better to convert all strings matching '...l\'...' to use double quotes.
    // Instead of complex regex, I will just do a specific manual replace:
    content = content.replace(/'Vous n\\'avez pas la permission.'/g, '"Vous n\'avez pas la permission."');
    content = content.replace(/'Une erreur est survenue lors de l\\'exécution de cette commande!'/g, '"Une erreur est survenue lors de l\'exécution de cette commande!"');
    content = content.replace(/'Ouvre le dashboard de configuration de l\\'Anti-Raid.'/g, '"Ouvre le dashboard de configuration de l\'Anti-Raid."');
    content = content.replace(/'L\\'utilisateur à ajouter à la whitelist.'/g, '"L\'utilisateur à ajouter à la whitelist."');
    content = content.replace(/'L\\'édition des seuils/g, '"L\'édition des seuils');
    
    // Also, clean up any remaining \' that might be causing syntax error if they are at the wrong place
    content = content.replace(/\\'/g, "'"); // This could break if single quoted string. Let's fix wrapping single quotes then.
    
    // Let's just fix the specific broken strings:
    content = content.replace(/'Ouvre le dashboard de configuration de l'Anti-Raid.'/g, '"Ouvre le dashboard de configuration de l\\'Anti-Raid."');
    content = content.replace(/'Vous n'avez pas la permission.'/g, '"Vous n\\'avez pas la permission."');
    content = content.replace(/'Une erreur est survenue lors de l'exécution de cette commande!'/g, '"Une erreur est survenue lors de l\\'exécution de cette commande!"');
    content = content.replace(/'L'utilisateur à ajouter à la whitelist.'/g, '"L\\'utilisateur à ajouter à la whitelist."');

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf-8');
        console.log("Fixed " + file);
    }
}
