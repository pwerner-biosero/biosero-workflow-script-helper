const vscode = require('vscode');

const fs = require('fs');
const path = require('path');


function activate(context) {
   // const treeDataProvider = new WFXDataProvider();
   // vscode.window.createTreeView('wfxTreeView', { treeDataProvider });
    //context.subscriptions.push(treeDataProvider);

    
    let UpdateWorkflow = vscode.commands.registerCommand('extension.UpdateWorkflow', function (uri) {
        if (uri && uri.fsPath) {
            let directoryPath = path.dirname(uri.fsPath);
            let scriptFileName = path.basename(uri.fsPath, '.cs'); // Get the name without extension
    
            fs.readdir(directoryPath, (err, files) => {
                if (err) {
                    vscode.window.showErrorMessage(`Error reading directory: ${err}`);
                    return;
                }
    
                let wfxFiles = files.filter(file => path.extname(file).toLowerCase() === '.wfx');
    
                if (wfxFiles.length === 1) {
                    let wfxFilePath = path.join(directoryPath, wfxFiles[0]);
                    fs.readFile(wfxFilePath, 'utf8', (err, data) => {
                        if (err) {
                            vscode.window.showErrorMessage(`Error reading .wfx file: ${err}`);
                            return;
                        }
    
                        let jsonData;
                        try {
                            jsonData = JSON.parse(data);
                        } catch (error) {
                            vscode.window.showErrorMessage('Error parsing JSON from .wfx file');
                            return;
                        }
    
                        let scriptIndex = jsonData.scripts.findIndex(s => s.name === scriptFileName);
                        fs.readFile(uri.fsPath, 'utf8', (err, scriptContent) => {
                            if (err) {
                                vscode.window.showErrorMessage(`Error reading C# script file: ${err}`);
                                return;
                            }
    
                            let scriptObject = {
                                name: scriptFileName,
                                code: scriptContent,
                                language: "C#"
                            };
    
                            if (scriptIndex !== -1) {
                                // Update existing script
                                jsonData.scripts[scriptIndex] = scriptObject;
                            } else {
                                // Add new script
                                jsonData.scripts.push(scriptObject);
                            }
    
                            // Save updated JSON back to the .wfx file
                            fs.writeFile(wfxFilePath, JSON.stringify(jsonData, null, 2), 'utf8', err => {
                                if (err) {
                                    vscode.window.showErrorMessage(`Error writing to .wfx file: ${err}`);
                                } else {
                                    vscode.window.showInformationMessage('Successfully updated .wfx file');
                                }
                            });
                        });
                    });
                } else if (wfxFiles.length > 1) {
                    vscode.window.showErrorMessage('Error: More than one .wfx file found in the directory.');
                } else {
                    vscode.window.showErrorMessage('No .wfx files found in the directory.');
                }
            });
        } else {
            vscode.window.showErrorMessage('No file or directory context provided.');
        }
    });
    

    context.subscriptions.push(UpdateWorkflow);

    let GenerateScripts = vscode.commands.registerCommand('extension.GenerateScripts', function (uri) {
        // This code will be executed when the context menu item is clicked
        vscode.window.showInformationMessage(`Running action for ${uri.fsPath}`);
        GetScriptsFromWorkflow(uri.fsPath);
    });

    context.subscriptions.push(GenerateScripts);
}

function deactivate() {}


class MyTreeItem extends vscode.TreeItem {
    constructor(label, collapsibleState = vscode.TreeItemCollapsibleState.None) {
        super(label, collapsibleState);
        this.children = [];
    }
}


// class WFXDataProvider {
//     constructor() {
//         this.rootPath = vscode.workspace.workspaceFolders ? vscode.workspace.workspaceFolders[0].uri.fsPath : null;
//         this.tree = null;
//     }

//     getTreeItem(element) {
//         return element;
//     }

//     getChildren(element) {
//         if (!this.rootPath) {
//             vscode.window.showInformationMessage("Open a folder or workspace first!");
//             return Promise.resolve([]);
//         }
        
//         if (element === undefined) {
//             // If tree is not initialized, read the directory and build the tree
//             if (!this.tree) {
//                 return readDirectory(this.rootPath).then(items => {
//                     this.tree = items;
//                     return items;
//                 }).catch(err => {
//                     console.error('Error reading directory:', err);
//                     return [];
//                 });
//             } else {
//                 return Promise.resolve(this.tree);
//             }
//         } else {
//             // Return children of the given element
//             return Promise.resolve(element.children);
//         }
//     }
// }



function deactivate() {}
const excludedExtensions = ['.tmp','.js','.json'];
const excludedDirectories = ['node_modules', '.git', '.vscode'];

function readDirectory(dirPath) {
    return new Promise((resolve, reject) => {
        fs.readdir(dirPath, { withFileTypes: true }, (err, dirents) => {
            if (err) {
                reject(err);
                return;
            }
            let promises = [];
            let items = [];
            for (let dirent of dirents) {
                let fullPath = path.join(dirPath, dirent.name);
                if (dirent.isDirectory()) {
                    // Filter out excluded directories
                    if (!excludedDirectories.includes(dirent.name)) {
                        let item = new MyTreeItem(dirent.name, vscode.TreeItemCollapsibleState.Collapsed);
                        promises.push(readDirectory(fullPath).then(children => {
                            item.children = children;
                        }));
                        items.push(item);
                    }
                } else {
                    // Check file extension to decide if it should be excluded
                    let ext = path.extname(dirent.name);
                    if (!excludedExtensions.includes(ext)) {
                        items.push(new MyTreeItem(dirent.name, vscode.TreeItemCollapsibleState.None));
                    }
                }
            }
            Promise.all(promises).then(() => resolve(items));
        });
    });
}

function GetScriptsFromWorkflow(file) {
    fs.readFile(file, 'utf8', (err, data) => {
        if (err) {
            console.error(`Error reading ${file}:`, err);
            return;
        }
        console.log(file);
        const scripts = JSON.parse(data);

        for (const script of scripts.scripts) {
            const name = script.name;
            const filename = path.join(path.dirname(file), `${name}.cs`);
            const code = script.code;

            fs.writeFileSync(filename, code);
        }
    });
}


module.exports = {
    activate,
    deactivate
};
