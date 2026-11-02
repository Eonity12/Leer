# Reader

A manga reader that installs on your iPhone home screen. No App Store, no sideloading, no signing, nothing to expire.

## Install in 5 steps

1. On github.com, create a new **public** repository (e.g. `reader`).
2. Upload **everything in this folder** to it (Add file → Upload files). Keep the `icons` folder intact and include `.nojekyll`.
3. In the repo: **Settings → Pages → Build and deployment**, set Source to *Deploy from a branch*, branch `main`, folder `/ (root)`, then Save.
4. After a minute, open `https://YOURNAME.github.io/reader/` **in Safari** on your iPhone.
5. Tap **Share → Add to Home Screen**. Launch it from the new icon.

Updating later: upload the changed file to the repo, wait a minute, then use Settings → Reload app.

## Using it

- **Browse**: MangaDex (built in) plus any source lists you add.
- **Library**: tap "+ Library" on a series. Reading progress is remembered per chapter and resumes where you stopped.
- **Reader**: tap the centre to show or hide the bar. In paged modes, tap the screen edges or swipe to turn pages. Swipe from the left edge to go back.
- **Settings**: reading mode (vertical, paged right-to-left, paged left-to-right), data saver, source lists, backup.
- **Backup**: your library and progress live on the phone. Use Settings → Copy backup now and then and keep the text somewhere safe (Notes works). iOS can clear web-app data if the app goes unused for a long time.

## Adding a GitHub source list

In Settings → Source lists, enter either `user/repo` (loads `sources.json` from that repo's `main` branch) or a direct link to any JSON file on GitHub.

### Format

```json
{
  "name": "My List",
  "series": [
    {
      "id": "series-1",
      "title": "Series Title",
      "cover": "covers/series-1.jpg",
      "description": "Optional.",
      "chapters": [
        { "id": "c1", "number": "1", "title": "Optional", "pages": ["p/1.jpg", "p/2.jpg"] },
        { "id": "c2", "number": "2", "pagesUrl": "p/ch2.json" }
      ]
    },
    { "id": "series-2", "title": "Big Series", "cover": "https://…", "chaptersUrl": "series-2/chapters.json" }
  ]
}
```

- Any URL may be absolute or relative to the JSON file.
- A series has either `chapters` or `chaptersUrl` (a JSON array, or `{ "chapters": [...] }`).
- A chapter has either `pages` or `pagesUrl` (a JSON array of image URLs, or `{ "pages": [...] }`).
- Chapters are sorted by `number`.
- See `sources.example.json`.

## Limits

- It is a web app: it needs a connection to read, and it won't have every native-app capability.
- Aidoku's own source packages (`.aix`) are not supported; lists use the JSON format above.
- Image hosts that block hot-linking will show broken pages. MangaDex works.
