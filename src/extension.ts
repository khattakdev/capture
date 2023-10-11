// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as fs from "fs";
const puppeteer = require("puppeteer");
// import * as puppeteer from "puppeteer";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "capture" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    "capture.snapshot",
    async () => {
      // The code you place here will be executed every time your command is executed
      // Display a message box to the user
      const browser = await puppeteer.launch();
      const page = await browser.newPage();

      await page.setContent(
        `<pre><code>const i = "Hello World!";</code></pre>`
      );
      const imageBuffer = await page.screenshot();

      const fileUri = await vscode.window.showSaveDialog({
        filters: {
          Images: ["png"],
        },
        saveLabel: "save Images",
        title: "Save Code Snippet Image",
      });

      if (fileUri) {
        fs.writeFile(fileUri.fsPath, imageBuffer, (err) => {
          if (err) {
            vscode.window.showErrorMessage("Failed to save imaged!");
          } else {
            vscode.window.showInformationMessage("Image saved!");
          }
        });
      }
      await browser.close();
      vscode.window.showInformationMessage("Snapshot taken!");
    }
  );

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
