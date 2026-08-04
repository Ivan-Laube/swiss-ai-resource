---
title: "Privacy policy"
description: "Information on the processing of personal data on aicompliant.ch (Art. 19 FADP): controller, purposes, processors, retention, and deletion."
last_verified: "2026-08-04"
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

This privacy policy informs you under **Art. 19 of the Federal Act on Data Protection (FADP / DSG)** how personal data is processed on **aicompliant.ch**. Fields marked `PLACEHOLDER` must be replaced with final details before production launch.

## 1. Controller

Controller of the processing:

| | |
|---|---|
| **Name / company** | PLACEHOLDER_LEGAL_NAME |
| **Address** | PLACEHOLDER_STREET, PLACEHOLDER_POSTAL_CITY, Switzerland |
| **Email** | PLACEHOLDER_CONTACT_EMAIL |

Further provider details: [Legal notice](/en/impressum/).

## 2. What data we process

### 2.1 Website visits (technical)

When you visit the website, technical connection data may arise (e.g. IP address, timestamp, user agent) insofar as this is required by the hosting/CDN provider (Cloudflare) to deliver and protect the site. The site itself is a **static export** and does **not** store visitor profiles in our application code.

### 2.2 Survey (optional email)

If you take part in the AI adoption survey, we store:

- your **answers** (without identification), together with language, survey version, and timestamp;
- optionally your **email address**, if you request the benchmark report (opt-in).

Answers and email addresses are stored in **separate tables** in a Cloudflare D1 database, each with **its own identifiers and no shared key**. Email and an individual response therefore cannot be linked technically. Answers **without** email are anonymous; even with opt-in, the answer remains separate from and unlinkable to the email address.

### 2.3 Spam protection (Turnstile)

When you submit the survey, Cloudflare Turnstile may run a security check. Technical data may be sent to Cloudflare to limit automated submissions.

### 2.4 Website Quick-Check

If you submit a URL for checking, your browser sends the URL to our scanner Worker. The Worker fetches the target page and evaluates publicly visible signals. **We do not permanently store scan results or submitted URLs.**

## 3. Purposes of processing

| Data | Purpose |
|---|---|
| Technical connection data | Delivery, operation, and protection of the website |
| Survey answers | Anonymised statistics and benchmark (aggregation; cells with fewer than five answers are not published) |
| Optional email | One-time or as-needed notification when the benchmark report is available |
| Turnstile | Abuse / spam protection |
| Quick-Check URL | One-off evaluation of the submitted URL; no permanent storage on our side |

The legal basis is in particular processing to perform a contract or pre-contractual measures, or our legitimate interest in operating the information services and preventing abuse, insofar as the FADP requires such a basis. The optional email relies on your **consent** (opt-in), which you may withdraw at any time.

## 4. Processors and Cloudflare

We use services of **Cloudflare, Inc.** (and affiliates) for:

- hosting / CDN of the website (Cloudflare Pages);
- the survey API and storage in **Cloudflare D1**;
- the website scanner (Cloudflare Worker, without permanent storage);
- optionally **Cloudflare Turnstile**.

Cloudflare acts as a **processor** for the purposes we define. Depending on Cloudflare configuration, processing may also take place outside Switzerland or the EU/EEA. We select providers and settings with a view to an adequate level of protection (including the provider’s contractual safeguards).

## 5. Retention

| Data | Retention |
|---|---|
| Survey answers | Until evaluation and publication of anonymised aggregates; raw answers are not kept longer than needed for the benchmark purpose (target: deletion or anonymisation at the latest **24 months** after submission, unless a longer legal duty applies) |
| Optional emails | Until the report notification is sent or until you request deletion; automatic deletion after at most **24 months**; manual deletion from the signup table on request |
| Quick-Check | No permanent storage on our side |
| Server/CDN logs | Per Cloudflare’s standard settings; typically short-term for operations and security |

## 6. Your rights and deletion

You may request access, rectification, and deletion of your personal data and object to processing where the FADP so provides. For an optional email on file, a message to **PLACEHOLDER_CONTACT_EMAIL** requesting deletion is usually sufficient; we then delete the email address from the signup table. Survey answers are unaffected and are not linked to the email.

Survey answers cannot later be linked to a person (including via the optional email) and therefore cannot be deleted on request in a targeted way.

You may also lodge a complaint with the **Federal Data Protection and Information Commissioner (FDPIC / EDÖB)**.

## 7. No obligation to provide data / consequences

You can use the website and most features without providing personal data. Without an email opt-in you will not receive a benchmark report notification; anonymous survey participation remains possible.

## 8. Changes

We may update this privacy policy if the offering or the law changes. The version published on this page is authoritative (`last_verified` in the page header).
