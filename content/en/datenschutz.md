---
title: "Privacy Policy"
description: "Information on the processing of personal data on aicompliant.ch (Art. 19 DSG): controller, purposes, processors, retention, and deletion."
last_verified: "2026-09-28"
volatility: "stable"
translation_status: "draft"
reviewed_by: null
review_date: null
review_scope: null
sources:
  - title: "Fedlex – Bundesgesetz über den Datenschutz (DSG), Art. 19"
    url: "https://www.fedlex.admin.ch/eli/cc/2022/491/de#art_19"
  - title: "EDÖB – KI und Datenschutz"
    url: "https://www.edoeb.admin.ch/de/ki-und-datenschutz"
---

This privacy policy informs you, in accordance with **Art. 19 DSG** of the Federal Act on Data Protection (Bundesgesetz über den Datenschutz, DSG), how personal data (Personendaten) are processed on **aicompliant.ch**.

## 1. Controller

Responsible for the data processing:

| | |
|---|---|
| **Name** | Ivan Laube |
| **Email** | [i.laube@gmail.com](mailto:i.laube@gmail.com) |

For further provider (Anbieter) information, see [Impressum](/de/impressum/).

## 2. What Data We Process

### 2.1 Website Access (Technical)

When you access the website, technical connection data may be generated (e.g., IP address, timestamp, user agent) to the extent required by the hosting/CDN provider (Anbieter) (Cloudflare) to deliver and secure the site. The website itself is built as a **static export** and our application code does **not** store any visitor profiles.

### 2.2 Survey (Optional, Including Email)

If you participate in the AI adoption survey, we store:

- your **responses** (without identification), together with language, survey version, and timestamp;
- optionally, your **email address**, if you request the benchmark report (opt-in).

Responses and email addresses are stored in **separate tables** in a Cloudflare D1 database, each with **its own identifiers and no shared key**. This means it is technically not possible to link an email address to an individual response. Responses **without** an email address are anonymous; even with opt-in, the response remains separate from the email address and cannot be linked.

### 2.3 Spam Protection (Turnstile and Rate Limiting)

When submitting the survey and using the Website Quick-Check, Cloudflare Turnstile may perform a security check. In doing so, technical data may be transmitted to Cloudflare to make automated submissions more difficult.

To limit abuse, for the survey we briefly store a **one-way hash of the client IP address** (SHA-256, without the plain-text IP) together with the UTC day and a counter (a maximum of 20 successful submissions per day and hash). These quota entries are automatically deleted after a few days and serve solely to prevent abuse — they are not linked to survey responses or email addresses.

### 2.4 Website Quick-Check

If you have a URL checked, your browser sends the URL and a Turnstile token to our scanner worker. The worker retrieves the target page and evaluates publicly visible signals. **No scan results and no submitted URLs are permanently stored by us.**

### 2.5 No Cookies, No Tracking; Usage Statistics

This website does **not use cookies** and does **not use any analytics or tracking tools** (no tracking pixels, no fingerprinting, no third-party scripts other than Turnstile). A cookie banner is therefore not necessary. The Quick-Check briefly stores an entry in your browser's session storage (sessionStorage) to pass a URL from the homepage to the form; this entry is deleted immediately upon being read and is not transmitted to us.

To see how heavily the site and its tools are used, we rely exclusively on **server-side counts**:

- **Page views:** Cloudflare's aggregated traffic statistics (e.g., the number of requests per page), generated from the connection data that is generated anyway (see section 2.1) — without any script, cookie, or identifier in your browser.
- **Tool usage:** For each Quick-Check or survey submission, our workers count one data point with the tool, the result (e.g., success
