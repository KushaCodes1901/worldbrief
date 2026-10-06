# Publish WorldBrief, using free services only

The local project is prepared before account setup. Never buy a domain, choose a paid plan, add a paid integration, or start a Pro trial for this project.

**Launched 6 October 2026:** [worldbrief.vercel.app](https://worldbrief.vercel.app), using Vercel Hobby and the public [GitHub repository](https://github.com/KushaCodes1901/worldbrief). Production is Ready, uses Node.js 24.x in `fra1`, and serves real Currents headlines. The news key is a sensitive variable scoped to Production only. The instructions below describe setup and future checks; the initial deployment is complete.

## 1. Public GitHub repository

The public repository has been created: [KushaCodes1901/worldbrief](https://github.com/KushaCodes1901/worldbrief). The creation instructions below are retained for reproducing this project; use the existing repository for the current deployment.

Create **worldbrief** under your personal GitHub account using [New repository](https://github.com/new). Select **Public**. If a repository with that name exists, stop and choose a separate name with Shkamb; do not overwrite it. For a terminal push, leave README, gitignore and licence initialization unchecked because this project already includes those files.

Before any push:

```sh
npm run scan:secrets
git status --short
```

Review all staged files. Never stage `.env.local`, `.next`, `node_modules`, `.vercel`, or real provider responses. Use a GitHub noreply author address if you want to keep your personal email out of public commits. Push the prepared commit to the verified repository; GitHub login may be required. If GitHub's connector is used to upload files, scan the exact publishable file set first.

Once the public repository exists, set its URL in `WORLDBRIEF_GITHUB_URL` locally and in Vercel. Add its actual URL to README. Do not insert placeholder account names into working links.

## 2. Currents private key

Open [Currents documentation](https://currentsapi.services/en/docs/), select free signup, and retrieve your API key from your account dashboard. Confirm the Developer $0 plan and its current quota. Keep one account/key, as required by the terms. For local testing, put the key in `.env.local`, with `WORLDBRIEF_DEMO_MODE=false`, and restart `npm run dev`. Do not paste the key into chat.

Visit the homepage, then a topic. Check that sample labels are absent, returned source links open original articles and dates/authors are displayed when available. Revisit the same feed within an hour and compare the headlines, Runtime Cache read/write metrics and account usage. The magazine interface does not display a feed-retrieval timestamp. Do not reset caches repeatedly. Review the publisher-specific permissions described in CONTENT_USE.md before expanding the use of third-party content.

## 3. Vercel Hobby deployment

1. Open [Vercel](https://vercel.com/signup) and sign in or create an account. Choose personal projects / **Hobby**. You must complete any account terms, CAPTCHA or required login yourself. Do not select Pro, trials or paid add-ons.
2. Add New → Project. Import the real `worldbrief` repository. If GitHub authorization is needed, grant only the repository access required for this project.
3. Confirm framework **Next.js**, root directory `./`, Node.js **24.x**, build `npm run build`; leave the default output directory. `vercel.json` selects the Frankfurt runtime region.
4. Add `CURRENTS_API_KEY` in private Environment Variables, scoped to **Production only**. Paste it directly into Vercel yourself. Add `WORLDBRIEF_DEMO_MODE=false` and the real `WORLDBRIEF_GITHUB_URL` for Production. Leave the key out of Preview; optionally set demo mode true in Preview for clearly fictional previews.
5. Deploy. Wait for **Ready**. Keep the default free `*.vercel.app` address. Changing production environment variables requires a redeployment.
6. Open the production domain in a signed-out browser/private window. The actual public production address must show WorldBrief without a Vercel login. If protected, inspect Deployment Protection and select settings that leave the production domain public; retain preview protection. Do not weaken unrelated project/account protection.

## 4. Verify production before claiming success

- Homepage returns actual news, with no Sample content banner. Six topic links produce the intended feeds (a genuinely empty feed is allowed).
- Headlines link directly to publishers, open externally and include safe attributes; source domains, dates and available authors are present.
- At 375px, the layout remains readable without horizontal scrolling; Tab shows visible focus.
- Repeat visits to the same feed inside an hour retain its headlines. In Vercel Observability → Runtime Cache, select the **Runtime Cache** radio option (not Data Cache), then confirm actual hits and no additional writes for repeated requests. Check Currents usage too. Stable headlines alone are supporting evidence, not proof of shared caching across server instances.
- In browser Network, requests stay on the application domain except intentional external links; no Currents authenticated requests originate from the browser. Inspect HTML and JavaScript for your key locally without copying it into chat or logs. Run `npm run scan:secrets` again locally.
- Confirm no unexpected requests are generated by hovering or viewing topic links. No automatic retry loops run when the provider is unavailable.
- Record the actual public URL in README and the repository's About/website field. Update publishing/test status with observed results only.

If access, a key, or permissions are missing, keep the implementation and state the exact remaining action. A build passing does not establish live API or deployment success.

## Initial launch evidence

- All eight public pages returned HTTP 200 without authentication; homepage and all six topics each returned 20 articles, without fictional sample content.
- Six local topic illustrations and production image optimization loaded. The 375px and desktop layouts showed no page overflow; keyboard focus was visible and source links had `noopener noreferrer` and `_blank`.
- A WorldBrief headline opened its corresponding DW article in a separate browser tab. Publisher availability, paywalls and cookie notices remain controlled by each publisher.
- The exact private key was absent from the eight public HTML responses and nine browser JavaScript assets. Local screenshots and verification scripts remain ignored under `.local/launch-qa`.
- Vercel Runtime Cache initially displayed 11 reads and 7 writes. After three more homepage requests it displayed 14 reads, 7 writes and a 50% hit rate in `fra1`. Reads increased without another cache write.
- The repository About/website field points to the verified live domain. GitHub Actions passed on the redesign commit; later pushes to `main` automatically create a new production deployment.
- Remaining operational responsibility: monitor Currents and Vercel usage and review third-party content permissions. Cache behavior is observed, not a distributed quota guarantee.
