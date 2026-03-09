# ⚙ Pre-requisites:

## Node.js

- To install Node.js, simply go to their official website: [**Node.js Website**](https://nodejs.org/pt-br/download).
- Then click the "**Windows Installer (.msi)**" button.
- Open the installer and follow the instructions (you can just keep clicking next to install without worry).

## Pnpm and its imports:

### 🤔 What is pnpm?:
- **pnpm (Performant npm)** is a fast, disk-space-efficient package manager for Node.js. It replaces npm and yarn by using a content-addressable storage system to share dependency files across all projects on a machine, rather than duplicating them in every node_modules folder.

### ✨ Key Benefits:
- **Space Efficiency**:
  > Drastically reduces disk usage by storing packages in a single global content-addressable store.
    
- **Speed**:
  > Generally faster than npm/yarn because it avoids unnecessary file copying.
     
- **Security & Structure**:
  > Creates a non-flat node_modules structure, preventing projects from accessing dependencies that are not explicitly declared.
    
- **Monorepo Support**:
  > Excellent built-in support for workspace/monorepo setups.
    
- **Compatibility**:
  > Fully compatible with the npm registry and uses the same package.json format

### 💿 How to install it?:

- To install pnpm, simply open up your terminal and type in **`npm install -g pnpm`** and wait for it to finish.


## 📁 Modules we're gonna use and how to install them:

- If you're in the root folder of the project just run: **`pnpm add bootstrap@latest react-icons@latest @cloudinary/url-gen @cloudinary/react @mui/material @emotion/react @emotion/styled`** on the terminal.
> (**Note**: if you don't want to write this all by hand just `ctrl+c` to copy it, and on the terminal **right click** to paste it).
- If you're not in the root folder of the project then run this first: **`cd 'name_folder_project'`**. For example: **`cd project-cantina-tcc`**, and then you run the previous "pnpm" code.

# ▲ Vercel Website (Our website hoster)

> [**https://project-cantina-tcc.vercel.app**](https://project-cantina-tcc.vercel.app)

> **Note**: on every github commit, vercel will automatically update the website with a slight delay.

# 🍔 Our Project Stack:
## Front-End:
- ✔ Framework: [**React**](https://react.dev) + [**Vite**](https://vite.dev)
- ✔ Components Library for React: [**MUI (Material UI)**](https://mui.com/material-ui/getting-started/)
- ✔ Extra Useful CSS Classes: [**Bootstrap**](https://getbootstrap.com)

## Back-end:
- ✔ Image Hosting: [**Cloudinary**](https://cloudinary.com)
- ✔ Website Hosting: [**Vercel**](https://vercel.com)
- ❓ PIX/Payment Api: ???
- ❓ Database: ???

# 🎬 How to run our project:
- To run our project simply go to its root folder and in the terminal type **`npm run dev`**
- It should give you **three** links, if on PC use the localhost, if you wanna see what it looks like on mobile, then use the second one on your mobile device.

## ❌ In case of errors:
- If you get an error, try going into Powershell and typing **`Set-ExecutionPolicy RemoteSigned`** and type a or y when the prompt is given.