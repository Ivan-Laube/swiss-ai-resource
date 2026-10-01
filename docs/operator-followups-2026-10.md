# Operator follow-ups (October 2026)

Three open points after the redesign launch. Each section has the **why**, the **steps** (click paths or exact commands), a **check** that it worked, and **rollback**. Steps marked 🤖 are code changes Claude can make for you; ask for them by name.

| # | Task | Effort | Risk if skipped |
|---|---|---|---|
| A | Put preview deployments behind Cloudflare Access | ~10 min | Unreviewed branch builds are public |
| B | Require CI to pass on `main` (deploy key for the bots) | ~20 min + 🤖 PR | A red build can land on `main` and deploy |
| C | Work through the remaining Dependabot PRs | ~15 min + 🤖 PR | Dependencies drift; alerts pile up |

Do them in this order. B and C are independent of A.

---

## A. Cloudflare Access for preview deployments

### Why

`OPERATOR_CHECKLIST.md` item 7 marks "Pages preview Access" as done, but on 2026-10-01 every preview hostname answered **200 without a login**:

| URL | What it is | Today | Target |
|---|---|---|---|
| `https://deps-security-bumps.swiss-ai-resource.pages.dev/` | branch alias preview | 200 (public) | Access login |
| `https://23c8f167.swiss-ai-resource.pages.dev/` | per-commit preview | 200 (public) | Access login |
| `https://swiss-ai-resource.pages.dev/` | production alias (same content as aicompliant.ch) | 200 (public) | stays public (see note) |

Either the Access application was removed, or it never matched these hostnames.

### Steps

1. Open the [Cloudflare dashboard](https://dash.cloudflare.com/), then **Workers & Pages → swiss-ai-resource → Settings → General**.
2. In the **Preview access** row, click **Restrict previews**.
   - If the row says "Preview deployments are public by default" with a **Restrict previews** button, protection is **off**. That was the state on 2026-10-01.
   - Cloudflare then creates a Zero Trust Access application for the project's preview deployment URLs. As the dashboard notes, production `pages.dev` and custom domains are not affected.
3. In **Zero Trust → Access → Applications**, open the new application for `swiss-ai-resource` and check:
   - **Application domain** covers `*.swiss-ai-resource.pages.dev`. The leading `*.` is required: without it, branch aliases such as `deps-security-bumps.…` and commit hashes such as `23c8f167.…` aren't covered.
   - **Policies** contains one **Allow** policy with **Include → Emails → `i.laube@gmail.com`**, plus anyone else who should review previews.
   - **Login methods** include **One-time PIN** (email code) unless you use an identity provider.
4. Save if you changed anything.

> **Note: production alias.** The wildcard `*.swiss-ai-resource.pages.dev` doesn't match the bare `swiss-ai-resource.pages.dev`, so that alias stays public. That's fine: it serves exactly what aicompliant.ch serves, and every page's canonical URL points to aicompliant.ch. Don't add the bare hostname to the Access app. Pages uses it for production.

### Check

Run this from any terminal (or ask Claude to):

```bash
curl -s -o /dev/null -w "%{http_code} %{redirect_url}\n" https://deps-security-bumps.swiss-ai-resource.pages.dev/de/
```

- **Expected:** `302 https://<your-team>.cloudflareaccess.com/...`, a redirect to the Access login.
- **Still `200`:** the hostname isn't covered. Recheck the application domain in step 3.

Also confirm that production is unaffected (expect `200`):

```bash
curl -s -o /dev/null -w "%{http_code}\n" https://aicompliant.ch/de/
```

Then set item 7 in `OPERATOR_CHECKLIST.md` back to done, with today's date and "re-verified: preview returns 302 to Access".

### Side effects

- **Checks against previews need a login.** `npm run check:live-headers -- <preview-url>` and Lighthouse runs against a preview will see the Access login page instead of the site. For those, temporarily add your IP to the policy (Include → IP ranges), or ask Claude to set up an Access **service token** for automated checks. Production checks are unaffected.
- **The Cloudflare bot's preview links** in PRs now lead to the Access login. That's expected.

### Rollback

In the Access application, set the policy to **Bypass → Everyone**, or delete the application. Previews become public again immediately.

---

## B. Require CI on `main`, with a deploy key for the bots

### Why

Nothing stops a commit with failing CI from landing on `main`, and `main` deploys to production automatically. The existing ruleset **`protect-main`** only blocks deleting `main` and force-pushing to it.

Requiring the CI checks would block two bots that push to `main` directly with the default Actions token:

- `translate-on-de-merge.yml`: commits regenerated EN/FR/IT translations.
- `monthly-sources.yml`: commits snapshot refreshes and the `last_verified` / `last_checked` bumps.

On a personal-account repo, GitHub can't exempt the Actions token from a ruleset. A ruleset **can** exempt **deploy keys**, so the bots will push with a deploy key instead.

### Steps

**Do the steps in this order.** If you require the checks (step 5) before the bots use the key (step 4), the next bot run fails.

#### 1. Create the key pair (your computer)

In PowerShell or Git Bash, in a temporary folder outside the repo:

```powershell
ssh-keygen -t ed25519 -C "swiss-ai-resource bots" -f swiss-ai-bot-deploy-key
```

At both passphrase prompts, press **Enter**: the key must have **no passphrase**, because the workflow can't type one.

> Don't add `-N ""` in Windows PowerShell 5.1. PowerShell drops the empty argument, and `ssh-keygen` fails with "Too many arguments". In Git Bash, `-N ""` works.

This creates `swiss-ai-bot-deploy-key` (private) and `swiss-ai-bot-deploy-key.pub` (public). To copy them for steps 2 and 3 in PowerShell:

```powershell
Get-Content swiss-ai-bot-deploy-key.pub | Set-Clipboard        # public key, for step 2
Get-Content swiss-ai-bot-deploy-key -Raw | Set-Clipboard       # private key, for step 3
```

#### 2. Add the public key to the repo

1. GitHub → **Ivan-Laube/swiss-ai-resource → Settings → Deploy keys → Add deploy key**.
2. **Title:** `bots-push-main`
3. **Key:** paste the whole content of `swiss-ai-bot-deploy-key.pub`.
4. ✅ **Allow write access**
5. **Add key**.

#### 3. Add the private key as an Actions secret

1. **Settings → Secrets and variables → Actions → New repository secret**.
2. **Name:** `BOT_DEPLOY_KEY`
3. **Secret:** paste the whole content of `swiss-ai-bot-deploy-key`, including the `-----BEGIN…` and `-----END…` lines.
4. **Add secret**.
5. **Delete both key files from your computer.** The secret is the only copy you need; if it's ever lost, create a new key.

#### 4. 🤖 Switch the two bot workflows to the deploy key

Ask Claude: *"Switch the translate and monthly-sources workflows to push with BOT_DEPLOY_KEY."* The change is small: in both workflows, the `actions/checkout` step gets

```yaml
        with:
          ssh-key: ${{ secrets.BOT_DEPLOY_KEY }}
          # translate-on-de-merge.yml keeps its existing `fetch-depth: 0`
```

The existing `git push` lines then push over SSH with the key. `gh pr create` in the monthly job keeps using the Actions token, which is fine because opening a PR isn't blocked.

Merge that PR while the checks are still optional.

> **Behaviour change to expect.** Pushes made with a deploy key **trigger other workflows**; pushes made with the Actions token didn't. After this change, bot commits run CI and the Live security headers check, as your own commits do. There's no loop:
> - The translate bot only writes `content/en|fr|it`, which doesn't retrigger itself.
> - The monthly `last_verified` bump touches `content/de`, which starts the translate workflow. That workflow finds no prose changes and exits without calling the Anthropic API.

#### 5. Add the bypass and the required checks to `protect-main`

1. **Settings → Rules → Rulesets → `protect-main`**.
2. **Bypass list → Add bypass → Deploy keys → Add selected.** Set its mode to **Always allow**.
   - Keep the existing **Repository admin** bypass. It lets you push small fixes directly and merge in an emergency.
3. Under **Branch rules**, enable **Require status checks to pass**:
   - Leave **Require branches to be up to date before merging** **off**. With it on, every PR would need re-running after each merge to `main`.
   - **Add checks:** `verify`, `e2e`, `survey-worker`, `survey-pipeline`, each with source **GitHub Actions**. Type the name, then pick the entry from the dropdown.
   - Don't add `Cloudflare Pages`. It's an external deploy status, not a test.
4. Keep **Restrict deletions** and **Block force pushes** enabled.
5. **Save changes.**

#### 6. Turn on auto-merge (optional, recommended)

1. **Settings → General → Pull Requests → ✅ Allow auto-merge**.

From then on you can say *"merge #NN once CI is green"*, and the PR merges by itself when the four checks pass.

### Check

1. **Bots can still push:** **Actions → Monthly source snapshots → Run workflow** (it's the real job, so running it early is harmless). Expect a green run.
   - If it had something to commit, the commit appears on `main` and **Settings → Rules → Insights** shows a push **bypassed** by the deploy key.
   - A run with nothing to commit is also fine; the next real bot push will show the bypass.
2. **Red PRs are blocked:** on any open PR with a failing or pending required check, the merge box says **"Required statuses must pass before merging"**. As admin you'll also see a **"Merge without waiting for requirements (bypass rules)"** option; that's the admin bypass from step 5.2.

### Rollback

- **Checks:** in `protect-main`, untick **Require status checks to pass**. The repo is back to today's state immediately.
- **Deploy key:** to stop the bots using it, delete it under **Settings → Deploy keys**, then revert the workflow change. Otherwise the bots' pushes start failing.

### Key rotation (yearly, or if the key might have leaked)

1. Repeat steps 1–3 with a new key, using the same secret name `BOT_DEPLOY_KEY`; updating the secret overwrites it.
2. Delete the old entry under **Deploy keys**.

No workflow change is needed.

---

## C. Remaining Dependabot PRs

### Status (2026-10-01)

Dependabot closed #4, #6, #8 and #14 as superseded after #15 merged (Next.js 16.3.6, Wrangler 4.145 / undici 7.29.1; 0 open security alerts expected after GitHub's rescan).

| PR | Change | Recommendation | Why |
|---|---|---|---|
| [#1](https://github.com/Ivan-Laube/swiss-ai-resource/pull/1) | `actions/checkout` 4.4.0 → **7.0.1** (major) | **Merge** | CI green. Touches all four workflows, pinned to a commit SHA as before. Merge **after** B.4 so the two don't conflict, or ask Claude to rebase whichever lands second. |
| [#2](https://github.com/Ivan-Laube/swiss-ai-resource/pull/2) | `actions/setup-node` 4.4.0 → **7.0.0** (major) | **Merge** | CI green. Same notes as #1. |
| [#7](https://github.com/Ivan-Laube/swiss-ai-resource/pull/7) | `tsx` 4.23.0 → 4.23.15 (patch) | **Merge via batch** | Runs every script and the unit tests. Low risk. |
| [#9](https://github.com/Ivan-Laube/swiss-ai-resource/pull/9) | `marked` 18.0.6 → 18.0.14 (patch) | **Merge via batch** | Renders all guide pages. The visual snapshots will catch any rendering change. |
| [#10](https://github.com/Ivan-Laube/swiss-ai-resource/pull/10) | `zod` 4.4.3 → 4.6.5 (minor) | **Merge via batch** | Check that `jitless` (in `src/lib/zod.ts`) still removes the CSP violation; the e2e privacy project does this automatically. |
| [#11](https://github.com/Ivan-Laube/swiss-ai-resource/pull/11) | `react-dom` 19.2.4 → 19.3.0, `@types/react-dom` | **Don't merge as is → batch with `react` 19.3.0** | The PR leaves `react` on 19.2.4. React refuses mismatched `react`/`react-dom` versions, so the whole site would fail to hydrate. Both must move together (pinned exactly, as today). |
| [#12](https://github.com/Ivan-Laube/swiss-ai-resource/pull/12) | `@anthropic-ai/sdk` 0.110 → 0.128 (pre-1.0 minor, may break) | **Merge via batch, after a dry run** | Used only by the translate / classify / vendor-extract scripts (`src/lib/anthropic.ts`). Verify with `npm run translate -- --dry-run` and `npm run classify:snapshots -- --dry-run`. Production pages don't use it. |
| [#3](https://github.com/Ivan-Laube/swiss-ai-resource/pull/3) | `@types/node` 20 → **26** | **Close; move to `^22` instead** | Types should match the runtime. `engines` and CI use Node 22, and Node 26 types would let code use APIs that don't exist at runtime. |
| [#5](https://github.com/Ivan-Laube/swiss-ai-resource/pull/5) | `typescript` 5.9 → **7.0** | **Close for now** | `typescript-eslint` (via `eslint-config-next`) supports TypeScript only below 6.1, so lint would break. Revisit when Next.js / typescript-eslint support TS 7. |

### Steps

1. **Merge #1 and #2.** Both are green, so you can do it in the GitHub UI after B.4.
   - If GitHub reports a conflict, comment `@dependabot rebase` on the PR and merge once it's green again.
2. 🤖 Ask Claude: *"Batch the Dependabot updates #7, #9, #10, #11 (with react 19.3.0) and #12 into one PR, set @types/node to ^22, run the full suite and the SDK dry runs."*
   - That gives one PR, like #15, with one review and one CI run, and no lockfile conflicts between five PRs.
   - After it merges, Dependabot closes #7, #9, #10, #11 and #12 by itself.
3. **Close #3 and #5** with a comment, so Dependabot doesn't keep reopening them:

   ```text
   @dependabot ignore this major version
   ```

   Then add the ignore rules in step 4, so the decision lives in the repo rather than in Dependabot's memory.
4. 🤖 Ask Claude to update `.github/dependabot.yml` to:
   - **group** routine patch and minor updates into one weekly PR, so there are fewer PRs and lockfile conflicts;
   - **ignore** `@types/node` majors above 22 and `typescript` majors (to revisit later);
   - keep **`react` and `react-dom` in the same group**, so they always move together. That prevents the #11 problem from coming back.

   Target shape:

   ```yaml
   version: 2
   updates:
     - package-ecosystem: npm
       directory: /
       schedule:
         interval: weekly
       open-pull-requests-limit: 10
       groups:
         react:
           patterns: ["react", "react-dom", "@types/react", "@types/react-dom"]
         nextjs:
           patterns: ["next", "eslint-config-next"]
         minor-and-patch:
           update-types: ["minor", "patch"]
       ignore:
         - dependency-name: "@types/node"
           update-types: ["version-update:semver-major"]
         - dependency-name: "typescript"
           update-types: ["version-update:semver-major"]

     - package-ecosystem: github-actions
       directory: /
       schedule:
         interval: weekly
       open-pull-requests-limit: 5
       groups:
         actions:
           patterns: ["*"]
   ```

   With the ignore rule in place, raise `@types/node` deliberately when you move the runtime (CI, `engines`, Cloudflare Pages build image) to a newer Node.

### Check

- **Open PRs:** only grouped Dependabot PRs remain, or none.
- **Security alerts:** **Security → Dependabot** shows **0 open alerts**.
- **Production:** after each merge to `main`, the **Live security headers** workflow is green, so the deployed site still serves its headers and CSP.

---

## Summary checklist

- [x] **A.** Preview URLs return `302` to Cloudflare Access; production `200`. `OPERATOR_CHECKLIST.md` item 7 re-verified (2026-10-01).
- [x] **B.1–3** Deploy key created, added with write access, private key saved as `BOT_DEPLOY_KEY`, local files deleted (2026-10-01).
- [ ] **B.4** 🤖 Bot workflows push with `BOT_DEPLOY_KEY` (PR merged).
- [ ] **B.5** `protect-main`: deploy-key bypass, required checks `verify`, `e2e`, `survey-worker`, `survey-pipeline`.
- [ ] **B.6** Allow auto-merge enabled (optional).
- [ ] **B. check** Manual "Monthly source snapshots" run is green.
- [ ] **C.1** #1 and #2 merged.
- [ ] **C.2** 🤖 Batch PR (#7, #9, #10, #11 + `react`, #12, `@types/node ^22`) merged.
- [ ] **C.3** #3 and #5 closed with `@dependabot ignore this major version`.
- [ ] **C.4** 🤖 `dependabot.yml` grouping and ignore rules merged.
