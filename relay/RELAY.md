# Setting up the MangaDex relay (free, about 10 minutes)

Do this on a computer if you can; Cloudflare's dashboard is cramped on a phone.

1. Go to **dash.cloudflare.com** and create a free account (email and password).
2. In the left menu open **Workers & Pages**, then **Create**, then **Create Worker**. Name it `leer-relay` and press **Deploy**. (Pick the "Hello World" starter if asked.)
3. Press **Edit code**. Select everything in the editor and delete it. Open `relay/worker.js` in this repo, copy the whole file, paste it into the editor, and press **Deploy**.
4. Copy the Worker's address. It looks like `https://leer-relay.yourname.workers.dev`.
5. In Leer, open **Settings → MangaDex relay**, paste the address, press **Save**, then **Test connection**. It should say "Relay works".

## Notes

- Free plan allowance: 100,000 requests per day, far more than reading needs.
- The Worker only answers requests coming from `https://eonity12.github.io` and only forwards to MangaDex hosts. If you host Leer somewhere else, edit `ALLOWED_ORIGINS` at the top of `worker.js`. This is a soft lock: it stops casual misuse, not someone determined to spoof headers.
- If Test connection reports HTTP 403 from MangaDex, MangaDex may be blocking Cloudflare's addresses. Tell Claude and an alternative host can be used.
