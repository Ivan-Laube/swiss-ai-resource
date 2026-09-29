---
title: "Privacy Policy"
description: "Information on the processing of personal data (Personendaten) on aicompliant.ch (Art. 19 DSG): controller, purposes, processors, retention and deletion."
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

This privacy policy informs you, in accordance with **Art. 19** of the Federal Act on Data Protection (Bundesgesetz über den Datenschutz, DSG), about how personal data (Personendaten) is processed on **aicompliant.ch**.

## 1. Controller

Responsible for the data processing:

| | |
|---|---|
| **Name** | Ivan Laube |
| **Address** | Vorhaldenstrasse 10, 8049 Zürich, Switzerland |
| **Email** | [i.laube@gmail.com](mailto:i.laube@gmail.com) |

Further provider (Anbieter) details: [Legal Notice](/de/impressum/).

## 2. What data we process

### 2.1 Website access (technical)

When the website is accessed, technical connection data may be generated (e.g. IP address, timestamp, user agent), to the extent required by our hosting/CDN provider (Cloudflare) to deliver and secure the site. The website itself is built as a **static export** and does not store any visitor profiles in our application code.

### 2.2 Survey (optional, including email)

If you take part in the AI adoption survey, we store:

- your **answers** (without identification), together with language, survey version, and timestamp;
- optionally, your **email address**, if you request the benchmark report (opt-in).

Answers and email addresses are stored in **separate tables** in a Cloudflare D1 database, each with its **own identifiers and without a shared key**. It is therefore not technically possible to link an email address to an individual answer. Answers submitted **without** an email are anonymous; even with opt-in, the answer remains separate from the email address and cannot be linked to it.

### 2.3 Spam protection (Turnstile and rate limiting)

When submitting the survey and when using the website quick-check, Cloudflare Turnstile may perform a security check. In doing so, technical data may be transmitted to Cloudflare to make automated submissions more difficult.

To limit abuse, we temporarily store, for the survey, a **one-way hash of the client IP** (SHA-256, without the plaintext IP) together with the UTC date and a counter (a maximum of 20 successful submissions per day and hash). These quota entries are automatically deleted after a few days and serve solely to prevent abuse — they are not linked to survey answers or email addresses.

### 2.4 Website quick-check

If you have a URL checked, your browser sends the URL and a Turnstile token to our scanner worker. The worker retrieves the target page and evaluates publicly visible signals. **No scan results and no submitted URLs are stored by us on a permanent basis.**

## 3. Purposes of processing

| Data | Purpose |
|---|---|
| Technical connection data | Delivery, operation, and security of the website |
| Survey answers | Anonymized statistics and benchmarking (aggregation; cells with fewer than five answers are not published) |
| Optional email | One-time or as-needed notification once the benchmark report becomes available |
| Turnstile / rate limiting | Protection against abuse/spam (including short-lived IP-hash quotas) |
| Quick-check URL | One-time evaluation of the submitted URL; no permanent storage by us |

The legal basis is, in particular, processing for the performance of a contract or pre-contractual measures, or our legitimate interest in operating our information services and preventing abuse, to the extent required by the DSG. The optional email is based on your **consent** (opt-in), which you may withdraw at any time.

## 4. Processors (Auftragsbearbeiter) and Cloudflare

We use services from **Cloudflare, Inc.** (and affiliated companies) for:

- hosting/CDN of the website (Cloudflare Pages);
- the survey API and storage in **Cloudflare D1**;
- the website scanner (Cloudflare Worker, without permanent storage);
- optionally, **Cloudflare Turnstile**.

Cloudflare acts as a processor (Auftragsbearbeiter) within the scope of the purposes we specify. Depending on Cloudflare's configuration, processing may also take place outside Switzerland or the EU/EEA. We select providers and settings with the aim of ensuring an adequate level of protection (including contractual safeguards from the provider).

## 5. Retention

| Data | Retention period |
|---|---|
| Survey answers | Until evaluation and publication of anonymized aggregates; raw answers are not retained longer than necessary for the benchmark purpose (goal: deletion or anonymization no later than **24 months** after submission, unless a longer statutory retention obligation applies) |
| Optional emails | Until the report notification is sent or until you request deletion; automatic deletion no later than after **24 months**; manual deletion from the signup table upon request |
| IP-hash quotas (survey) | A few days (automatic deletion of older daily entries); used solely for abuse prevention |
| Quick-check | No permanent storage by us |
| Server/CDN logs | According to Cloudflare's standard settings; typically retained briefly for operations and security |

## 6. Your rights and deletion

You may request information, correction, and deletion of your personal data, and may object to processing, to the extent provided by the DSG. If you have provided an optional email address, it is generally sufficient to send a message to **[i.laube@gmail.com](mailto:i.laube@gmail.com)** requesting deletion; we will then delete the email address from the signup table. Survey answers are unaffected by this and are not linked to the email address.

Survey answers cannot subsequently be attributed to a specific person (not even via the optional email) and therefore cannot be deleted on a targeted basis.

You may also file a complaint with the **Federal Data Protection and Information Commissioner (Eidgenössischer Datenschutz- und Öffentlichkeitsbeauftragter, EDÖB)**.

## 7. No obligation to provide data / consequences

The website and most of its functions can be used without providing any personal data. Without email opt-in, you will not receive a notification about the benchmark report; anonymous participation in the survey remains possible.

## 8. Changes

We may amend this privacy policy if our offering or the legal situation changes. The version published on this page at any given time is authoritative (see `last_verified` in the page header).
