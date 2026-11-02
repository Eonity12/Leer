# Setting up the MangaDex relay (free, about 10 minutes)

Do this on a computer if you can; Cloudflare's dashboard is cramped on a phone.

1. Go to **dash.cloudflare.com** and create a free account (email and password).
2. In the left menu open **Workers & Pages**, then **Create**, then **Create Worker**. Name it `leer-relay` and press **Deploy**. (Pick the "Hello World" starter if asked.)
3. Press **Edit code**. Select everything in the editor and delete it. Open `relay/worker.js` in this repo, copy the whole file, paste it into the editor, and press **Deploy**.
4. Copy the Worker's address. It looks like `https://leer-relay.yourname.workers.dev`.
5. In Leer, open **Settings → MangaDex relay**, paste the address, press **Save**, then **Test connection**. It should say "Relay works".

## Option B: deploy straight from GitHub (no code editor, easier on a phone)

This repo includes `relay/wrangler.toml`, so Cloudflare can build the relay from it.

1. In Cloudflare open **Workers & Pages → Create application**, then choose **Connect to Git** (sometimes labelled "Import a repository").
2. Authorise GitHub when asked and pick the **Leer** repository.
3. Set the project name to exactly `leer-relay`.
4. Leave **Root directory** blank (the repo's top-level `wrangler.toml` already points at the relay). Leave the build command empty and keep the default deploy command (`npx wrangler deploy`).
5. Press **Save and Deploy**, then copy the Worker's address (`https://leer-relay.yourname.workers.dev`) into Leer's Settings.

If Cloudflare's pages are fiddly on a phone, tap the left icon in Safari's address bar and choose **Request Desktop Website**.

## Notes

- Quick check that the right thing is deployed: open the Worker's address in Safari. The relay answers "Forbidden" to a plain visit, which is correct. If you see "Hello World", a web page, or anything else, Cloudflare has deployed the wrong thing.

- Free plan allowance: 100,000 requests per day, far more than reading needs.
- The Worker only answers requests coming from `https://eonity12.github.io` and only forwards to MangaDex hosts. If you host Leer somewhere else, edit `ALLOWED_ORIGINS` at the top of `worker.js`. This is a soft lock: it stops casual misuse, not someone determined to spoof headers.
- If Test connection reports HTTP 403 from MangaDex, MangaDex may be blocking Cloudflare's addresses. Tell Claude and an alternative host can be used.
