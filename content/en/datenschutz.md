---
title: "Privacy Policy"
description: "How aicompliant.ch processes personal data (Personendaten) (Art. 19 DSG): the controller (Verantwortlicher), purposes, Cloudflare as processor (Auftragsbearbeiter), disclosure abroad, retention, and your rights."
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

This privacy policy informs you, in accordance with **Art. 19 of the Federal Act on Data Protection (Bundesgesetz über den Datenschutz, DSG)**, about which personal data (Personendaten) we process on **aicompliant.ch**, for what purposes, and for how long.

## 1. Controller (Verantwortlicher)

The following party is responsible for the data processing:

| | |
|---|---|
| **Name** | Ivan Laube |
| **Email** | [i.laube@gmail.com](mailto:i.laube@gmail.com) |

Further details: [Imprint](/de/impressum/).

## 2. What Data We Process

### 2.1 Visiting the Website

When you visit the website, technical connection data is generated (e.g., IP address, timestamp, browser, and operating system). Our hosting provider Cloudflare needs this data to deliver the pages and protect them against attacks. The website consists of static pages; we ourselves do not create profiles of visitors.

### 2.2 Survey (Optional, with Email Address)

If you take part in the survey on AI use, we store:

- your **responses**, together with the language, survey version, and time of participation;
- optionally, your **email address**, if you request the benchmark report, together with the language and calendar week of registration.

Responses and email addresses are stored in **separate tables** in a Cloudflare D1 database, with **their own identifiers and no shared key**. The responses do not indicate whether an email address was provided, and for the email address we store only the calendar week, not the exact time. There is therefore no stored link between the email address and the response. We do not combine the two or evaluate them together. Without an email address, your participation is anonymous.

### 2.3 Protection Against Abuse (Turnstile and Submission Limits)

When you submit the survey and when you use the Website Quick Check, Cloudflare Turnstile checks whether the request comes from a human. For this purpose, technical data from your browser and your IP address are transmitted to Cloudflare.

To limit abuse of the survey, we also briefly store a **hash value of your IP address** together with the date and a counter (a maximum of 20 submissions per day). The hash value is generated using a secret key and the respective date (HMAC-SHA-256); it therefore changes daily and cannot be traced back to the IP address without this key. We do not store the IP address itself. These entries are automatically deleted after ten days at the latest. They serve only to prevent abuse and are not linked to responses or email addresses.

### 2.4 Website Quick Check

If you have a URL checked, your browser sends the URL and a Turnstile token to our scanner. The scanner retrieves the specified website and evaluates publicly visible characteristics. **We do not permanently store entered URLs or results.**

### 2.5 AI Check and Decision Aids

Your answers in the AI Check and in the decision aids are processed only in your browser and are not transmitted to us. A copied link to a result from the decision aids contains your answers; you decide for yourself to whom you share it.

### 2.6 No Cookies, No Tracking; Usage Statistics

This website does not use **cookies** and does not use **analytics or tracking tools** such as tracking pixels. Apart from Cloudflare Turnstile when submitting forms (section 2.3), we do not load any third-party scripts. To pass a URL from the homepage to the Quick Check, the website briefly stores an entry in your browser's session storage (sessionStorage). It is deleted immediately upon being read and is not transmitted to us.

To see how much the website and the tools are used, we rely only on **server-side counts**:

- **Page views:** aggregated statistics from Cloudflare (e.g., number of views per page), derived from the connection data described in section 2.1, without any script, cookie, or identifier in your browser.
- **Tool usage:** for each Quick Check and each survey submission, we count one data point consisting of the tool, the result (e.g., successful, rejected), and the technical status. It contains **no** IP address, URL, response, or other identifier and cannot be attributed to any individual.

## 3. Purposes and Principles of Processing

| Data | Purpose |
|---|---|
| Technical connection data | Delivery, operation, and protection of the website |
| Survey responses | Anonymized statistics and benchmark (values based on fewer than five responses are not published) |
| Email address (optional) | Notification once the benchmark report is available |
| Turnstile and IP hash value | Protection against abuse and spam |
| Quick Check URL | One-time check of the entered website |

We process personal data (Personendaten) in accordance with the principles of the DSG (Art. 6), only for the purposes stated above, and only to the extent necessary. We process the email address with your **consent**, which you may withdraw at any time. The other processing activities serve our interest in offering a secure and functioning service.

## 4. Processors (Auftragsbearbeiter) and Disclosure Abroad

We use services provided by **Cloudflare, Inc.** (USA) and its affiliated companies for:

- hosting and delivery of the website (Cloudflare Pages);
- the survey and storage in **Cloudflare D1**;
- the website scanner (Cloudflare Workers, without permanent storage);
- anonymous usage counts (Cloudflare Workers Analytics Engine) and aggregated traffic statistics;
- the spam protection service **Cloudflare Turnstile**.

Cloudflare processes the data as a **processor (Auftragsbearbeiter)** on our behalf. Cloudflare, Inc. is headquartered in the USA and operates data centers in many countries; data may therefore be processed in the USA and in other countries. For the USA, we rely on Cloudflare's certification under the **Swiss-U.S. Data Privacy Framework** (Annex 1 of the Data Protection Ordinance (Datenschutzverordnung, DSV)). For countries without an adequate level of data protection, the standard contractual clauses in Cloudflare's Data Processing Addendum apply.

## 5. Retention

| Data | Retention |
|---|---|
| Survey responses | Automatically deleted after **24 months**; only anonymized aggregate results are published |
| Email addresses | Until notification about the report is sent or until you withdraw consent, at the latest after **24 months** (automatic deletion) |
| IP hash values (survey) | Automatically deleted after ten days at the latest |
| Quick Check | No permanent storage |
| Usage counts | Three months (automatically deleted by Cloudflare); not linked to any individual |
| Server and CDN logs | According to Cloudflare's default settings, generally kept briefly for operation and security |

## 6. Your Rights

You may request information about your personal data (Personendaten), request its correction or deletion, object to processing, and request the release of your data under the conditions of Art. 28 DSG (Art. 25 et seq. and Art. 32 DSG). You may withdraw consent at any time.

To have your email address deleted, a brief message to **[i.laube@gmail.com](mailto:i.laube@gmail.com)** is sufficient. We will then delete the address from the registration table.

Because we do not link survey responses to individuals, we cannot delete them selectively upon request. They are automatically deleted after 24 months.

You may also contact the **Federal Data Protection and Information Commissioner (Eidgenössischer Datenschutz- und Öffentlichkeitsbeauftragter, EDÖB)**.

## 7. Voluntary Nature

You can use the website and most of its features without providing personal data. Without an email address, you will not receive a notification about the benchmark report; you can still participate in the survey anonymously.

## 8. Changes

We will update this privacy policy if the service or the legal situation changes. The version published on this page at any given time is authoritative; the date of the last review is shown at the top of the page.
