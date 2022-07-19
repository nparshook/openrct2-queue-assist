# OpenRCT2 Queue Assist
An OpenRCT2 Plugin to assist with styling your ride queues.
- Current Version: 0.2
  - Minimal functionality, a lot of work left to do.

## 🔬 Contents
- [Features](#✔️-features)
- [Installation](#🚀-installation)
- [Usage](#📚-usage)
  - [Toggle Visibility](#👀-toggle-queue-visibility)
  - [Edit Queue Style](#🔧-edit-queue-style)
- [Building From Source](#🔨-building)
  - [Hot Reload Support](#hot-reload-support)
- [Future Work](#future-work)
- [License](#⚖️-license)
- [Thanks](#thanks)

## ✔️ Features
- Select a ride to highlight it's queue.
- Highlight orphaned queue paths.
- Toggle a ride's queue or orphan queue paths visibility.
- Change the surface and railings style of a ride's queue.

## 🚀 Installation
1. Download the latest version of the plugin from the [Releases page](https://github.com/nparshook/openrct2-queue-assist/releases).
2. To install it, put the downloaded `*.js` file into your `/OpenRCT2/plugin` folder.
    - Easiest way to find the OpenRCT2-folder is by launching the OpenRCT2 game, click and hold on the red toolbox in the main menu, and select "Open custom content folder".
    - Otherwise this folder is commonly found in `C:\Users\<YOUR NAME>\Documents\OpenRCT2\plugin` on Windows.
    - If you already had this plugin installed before, you can safely overwrite the old file.
3. Once the file is there, it should show up ingame in the dropdown menu under the map icon.

## 📚 Usage
- Orphan: A queue path that is not connected to a ride.

### 👀 Toggle Queue Visibility
1. Check either the ride checkbox and select a ride or check the orphans checkbox.
2. Press the toggle visibility button.
    - This does not change the type of the queue, just switches its visibility.

### 🔧 Edit Queue Style
1. Check the ride checkbox and select a ride from the dropdown.
2. Select a surface style.
    - Defaults to the queue's current surface style.
3. Select a railings style.
    - Defaults to the queue's current railings style.
4. Press the `Apply Queue Style` button.

## 🔨 Building
This project is based on [wisnia74's Typescript modding template](https://github.com/wisnia74/openrct2-typescript-mod-template) and uses [Nodemon](https://nodemon.io/), [ESLint](https://eslint.org/) and [TypeScript](https://www.typescriptlang.org/) from this template.

1. Install latest version of [Node](https://nodejs.org/en/) and make sure to include NPM in the installation options.
2. Clone the project to a location of your choice on your PC.
3. Open command prompt, use `cd` to change your current directory to the root folder of this project and run `npm install`.
4. Find `openrct2.d.ts` TypeScript API declaration file in OpenRCT2 files and copy it to `lib` folder (this file can usually be found in `C:/Users/<YOUR NAME>/Documents/OpenRCT2/bin/` or `C:/Program Files/OpenRCT2/`).
    - Alternatively, you can make a symbolic link instead of copying the file, which will keep the file up to date whenever you install new versions of OpenRCT2.
5. Run `npm run build` (release build) or `npm run build:dev` (develop build) to build the project.
    - The default output folder for a release build is `(project directory)/dist` and can be changed in `rollup.config.js`
      - Set the variable `const developOutput = {your desired path}`;
    - Running a develop build will automatically install the plugin for you. It assumes the the plugin directory is located in the standard location.
      - For example on windows this would be `C:/Users/<YOUR NAME>/Documents/OpenRCT2/plugin/`

### 🔥 Hot Reload Support
This project supports the [OpenRCT2 hot reload feature](https://github.com/OpenRCT2/OpenRCT2/blob/master/distribution/scripting.md#writing-scripts) for development.

1. Make sure you've enabled it by setting `enable_hot_reloading = true` in your `/OpenRCT2/config.ini`.
2. If your plugins are not installed in the default location change `rollup.config.js` to point to your plugins.
    - Set the variable `const developOutput = {your desired path}`.
    - Make sure this path uses `/` instead of `\` slashes!
3. Open command prompt and use `cd` to change your current directory to the root folder of this project.
4. Run `npm start` to start the hot reload server.
5. Use the `/OpenRCT2/bin/openrct2.com` executable to [start OpenRCT2 with console](https://github.com/OpenRCT2/OpenRCT2/blob/master/distribution/scripting.md#writing-scripts) and load a save or start new game.
6. Each time you save any of the files in `./src/`, the server will run a develop build and install the plugin file inside your local OpenRCT2 plugin directory.
7. OpenRCT2 will notice file changes and it will reload the plugin.

## 🔭 Future Work
- Rework the UI.
- Add simple/advanced queue styling.
  - Simple: Can select the queue style of flat and sloped sections separately.
  - Advanced: Create sections in your queue and style them.
- If my [PR](https://github.com/OpenRCT2/OpenRCT2/pull/17567) gets merged, change style dropdowns to use image buttons with the surface/railings preview images.
- Feel free to make a [suggestion](https://github.com/nparshook/openrct2-queue-assist/issues/new/choose).

## ⚖️ License
This plugin is licensed under the MIT licence.

## 🙏 Thanks
- [OpenRCT2](https://github.com/OpenRCT2/OpenRCT2)
- [wisnia74](https://github.com/wisnia74/openrct2-typescript-mod-template) for the awesome template.
- [Basssiiie](https://github.com/Basssiiie/OpenRCT2-ProxyPather) I used this as an example for learning more about the plugins.
