# turnstile

A drop-in Cloudflare Turnstile bot check for any React form. It has no
dependencies beyond React, so copy this folder into another project as it is.

## In the browser

```tsx
const { attachWidget, getToken } = useTurnstile()

async function handleSubmit() {
  const token = await getToken() // a fresh single-use token
  await fetch(url, { method: "POST", body: JSON.stringify({ ..., turnstileToken: token }) })
}

return <form>... <div ref={attachWidget} /> ...</form>
```

- Set `NEXT_PUBLIC_TURNSTILE_SITE_KEY` (a public value, built into the page),
  or pass `useTurnstile({ siteKey })`. With no key the check is off and
  `getToken()` returns `undefined`.
- Ask for a token once per request: Cloudflare accepts each token only once.
  The hook gets the next one ready in the background after you take one.
- The widget stays hidden unless Cloudflare needs the visitor to do something.
  While it is showing its tick box, `isInteractionRequired` is true, so disable
  your submit button with it: `disabled={isSending || isInteractionRequired}`.

## On the server

The server must verify the token with Cloudflare's `siteverify` and refuse the
request if it fails. The mail proxy does this in `lib/verify-turnstile.ts`
(a single file that can be copied the same way). The secret key lives only on
the server, never in the page.

## Getting keys

Create a free Turnstile widget in the Cloudflare dashboard: the site key goes
in the page, the secret key on the server. For local testing, Cloudflare
publishes test keys that always pass or always fail.
