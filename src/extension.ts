// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as fs from "fs";
import * as puppeteer from "puppeteer";
import generateTemplate from "./template";
const { copyImg } = require('img-clipboard');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "capture" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand("capture.snapshot", async () => {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
      const document = editor.document;
      const selection = editor.selection;
      const text = document.getText(selection);

      const browser = await puppeteer.launch();
      const page = await browser.newPage();

      if (text.trim() === "") {
        vscode.window.showErrorMessage("You have not highlighted anything.");
        return;
      } 
        
      const configuration = vscode.workspace.getConfiguration('capture');
      const themeName = configuration.get('themeName', 'one-dark-pro');

      const content = await generateTemplate(text,themeName);
      await page.setContent(content);
      const contentHeight = content.split("\n").length;
      const totalHeight = contentHeight * 3;
      await page.setViewport({
        width: 800,
        height: totalHeight + 50,
      });
      const imageBuffer = await page.screenshot({
        fullPage: true,
      });

      const now = new Date();
      const dateAndTime = now.toISOString().replace(/[:.]/g, "-"); // Format the date and time
      const defaultFileName = `capture_${dateAndTime}.png`; 

      // Show a save dialog to choose the image file location
      const fileUri = await vscode.window.showSaveDialog({
        filters: {
          images: ["png"],
        },
        saveLabel: "Save Image",
        title: "Save Code Snippet Image",
        defaultUri: vscode.Uri.file(defaultFileName),
      });

      if (fileUri) {
        fs.writeFile(fileUri.fsPath, imageBuffer, (err) => {
          if (err) {
            vscode.window.showErrorMessage("Failed to save image!");
          } else {
            // Create a vscode.Uri for the saved image
            const imageUri = vscode.Uri.file(fileUri.fsPath);
            // copy to clipboard
            copyImg(fileUri.fsPath);
            // Show an information message with a clickable link to open the image
            vscode.window.showInformationMessage("Image saved and copied to clipboard. Click to open.", "Open Image").then((choice) => {
              if (choice === "Open Image") {
                vscode.env.openExternal(imageUri);
              }
            });
          }
        });
      }
      await browser.close();
    }
  });

  // Add the command to the context subscriptions
  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
