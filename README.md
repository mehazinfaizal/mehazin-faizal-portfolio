# Mehazin Faizal — Portfolio ID Card

An interactive, responsive React + TypeScript portfolio built around a tactile two-sided ID card.

## Run locally on Windows PowerShell

PowerShell may block the `npm.ps1` shim under the current execution policy. From the project folder, call the Windows command shim directly:

```powershell
cd .\outputs
npm.cmd install
npm.cmd run dev
```

## Run locally on macOS/Linux

```sh
cd outputs
npm install
npm run dev
```

## Production build

```sh
npm.cmd run build
npm.cmd run preview
```

The production site is generated in `dist/`. Vite preview and static hosting need history fallback support so direct routes such as `/about` and `/projects/youtube` resolve to `index.html`.

## Notes

- Portfolio facts, skills, certifications, projects, and contact details were populated from the supplied resume and the public GitHub profile.
- The card portrait remains an illustrated placeholder.
- The reverse-side QR area is explicitly reserved and does not pretend to encode a destination.
- The contact form validates locally, uses a hidden honeypot, and opens a prefilled email draft. It does not send data to a server or report delivery.
- Replace the placeholder portrait and provide a real QR destination or contact backend if desired.
