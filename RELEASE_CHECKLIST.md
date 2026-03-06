# MD to Perfect PDF - Release Checklist

This checklist is the standard flow for shipping updates to the existing Chrome Web Store listing.

## 1) Start from latest `main`

```bash
git checkout main
git pull origin main
git checkout -b feat/<short-feature-name>
```

## 2) Build feature in source code

- Make changes in `extension/` (source files).
- Keep `extension-release/` as the upload-ready output.
- If website/docs changed, update `website/` and `README.md`.

## 3) Local testing (required)

1. Open `chrome://extensions`
2. Enable `Developer mode`
3. Click `Load unpacked`
4. Select `extension-release/` (or `extension/` during development)
5. Test:
   - Editor + preview render
   - Dark/light theme behavior
   - Font selection behavior
   - Export modal options
   - PDF export with long code, wide tables, and page breaks
   - No unexpected network/server calls

## 4) Sync release folder

- Ensure `extension-release/` contains exactly the final files you want to upload.
- Remove temp/debug artifacts.
- Confirm all referenced assets/icons exist.

## 5) Bump extension version (mandatory)

Edit:

- `extension-release/manifest.json`

Increase:

- `"version": "x.y.z"` (must be higher than current store version)

Optional but recommended:

- Keep `extension/manifest.json` version aligned.

## 6) Final release validation

- Permissions in manifest are minimal and justified.
- No remote executable code.
- Privacy behavior matches actual app behavior.
- Store listing text/screenshots match the current UI.
- Support + homepage + privacy URLs are valid:
  - Homepage: `https://kardam-codes.github.io/MD_to_Perfect_PDF/website/`
  - Support: `https://github.com/Kardam-Codes/MD_to_Perfect_PDF/issues`
  - Privacy: `https://kardam-codes.github.io/MD_to_Perfect_PDF/website/privacy.html`

## 7) Create upload zip (contents of `extension-release/`, not parent folder)

PowerShell example from repo root:

```powershell
Compress-Archive -Path .\extension-release\* -DestinationPath .\md-to-perfect-pdf-vX.Y.Z.zip -Force
```

Verify zip includes:

- `manifest.json` at zip root
- `editor.html`, `popup.html`, JS/CSS files
- `icons/`

## 8) Commit, push, PR

```bash
git add -A
git commit -m "Release vX.Y.Z: <short summary>"
git push origin feat/<short-feature-name>
```

- Open PR to `main`
- Merge after review/testing

## 9) Upload update in Chrome Web Store

1. Open Developer Dashboard
2. Open existing extension item
3. Upload new zip
4. Update store listing fields/screenshots if needed
5. Verify Privacy practices tab answers still accurate
6. Submit for review

## 10) Post-submit monitoring

- Watch review status and policy feedback.
- If rejected, patch and resubmit with a new version.
- Track issues in:
  - `https://github.com/Kardam-Codes/MD_to_Perfect_PDF/issues`

---

## Quick pre-upload command checklist

```bash
git status
```

- working tree clean

```bash
git log --oneline -n 5
```

- latest release commit present

Manual check:

- manifest version incremented
- release zip created from `extension-release/`
- URLs and privacy declarations are still correct
