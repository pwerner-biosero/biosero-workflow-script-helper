# Biosero Workflow Script Helper

This extension helps users to automatically extract and manage scripts within the Biosero Workflow platform.

## Features

- **Script Extraction**: Quickly extract scripts from your current project.
- **Automation**: Simplify routine tasks with automated script analysis.



## Requirements

Before you start using the [Your Extension Name] extension, make sure you have the following installed:
- **Visual Studio Code**: Download and install from [here](https://code.visualstudio.com/).
- **Node.js**: Required for running and building the extension. Download and install from [here](https://nodejs.org/).

## Installation

1. **Clone the repository**:
   ```bash
   git clone git@github.com:pwerner-biosero/biosero-workflow-script-helper.git
   cd your-repository-name

2. Install Dependencies
    npm install

3. Type code . in the terminal to launch vscode in this directory

4. Run and Ebug the application using the Run Extension configuration. This open the Extension Development Host which is a new instance of vscode.

## Usage

To use the Extenstion:
1. Create a directory in your project root and include a workflow.wfx

2. Right Click on the workflow.wfx file and select Export Workflow Scripts. This will extract all C# Scripts form the workflw.wfx file

3. Right Click on any of the newly created CSharp files To merge changes from any C# file into the workflow.wfx

## Known Issues

None at this time.

## Release Notes

### 1.0.0

Initial release of Biosero Workflow Script Helper.
