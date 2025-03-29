# MeicoHsiao Portfolio (Deployed Site)

This repository contains the **compiled and published output** of my portfolio, hosted via GitHub Pages at:

**https://meicopotato.github.io/portfolio/**

---

## About the Project

The main landing page is an interactive terminal interface that accepts commands such as `resume`, `about`, `contact`, `projects`, and `gaming`.


---

## Tech Stack

- **Blazor WebAssembly (.NET 9)**
- **Tailwind CSS** with custom configuration
- **Razor Components**
- **Custom Fonts**:
  - `Hack` (terminal interface)
  - `Inter` (application windows)
- **Minimal JavaScript** for interop (dragging, window stacking)

---

## Deployment Workflow

This deployment is **automated** via GitHub Actions from the private development repository:
[MeicoPotato/portfolio-dev](https://github.com/MeicoPotato/portfolio-dev)

The workflow:
1. Builds the Blazor project using `dotnet publish`
2. Outputs to `dist/wwwroot`
3. Pushes the static files here for hosting via GitHub Pages

---