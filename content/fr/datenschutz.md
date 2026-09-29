---
title: "Politique de protection des données"
description: "Informations sur le traitement des données personnelles sur aicompliant.ch (art. 19 LPD) : responsable, finalités, sous-traitants, conservation et suppression."
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

Cette politique de protection des données vous informe conformément à l'**art. 19 LPD** de la manière dont des données personnelles sont traitées sur **aicompliant.ch**.

## 1. Responsable

Responsable du traitement des données :

| | |
|---|---|
| **Nom** | Ivan Laube |
| **Adresse** | Vorhaldenstrasse 10, 8049 Zurich, Suisse |
| **E-mail** | [i.laube@gmail.com](mailto:i.laube@gmail.com) |

Autres informations sur le fournisseur : [Impressum](/de/impressum/).

## 2. Quelles données nous traitons

### 2.1 Consultation du site (technique)

Lors de la consultation du site, des données de connexion techniques peuvent être générées (p. ex. adresse IP, horodatage, user-agent), dans la mesure où cela est nécessaire pour la fourniture et la sécurisation du site par le prestataire d'hébergement/CDN (Cloudflare). Le site lui-même est conçu comme un **export statique** et ne stocke **aucun** profil de visiteur dans notre code applicatif.

### 2.2 Enquête (facultative, y compris e-mail)

Si vous participez à l'enquête sur l'adoption de l'IA, nous enregistrons :

- vos **réponses** (sans identification), avec la langue, la version de l'enquête et l'horodatage ;
- éventuellement votre **adresse e-mail**, si vous demandez le rapport de référence (opt-in).

Les réponses et les adresses e-mail sont stockées dans des **tables séparées** au sein d'une base de données Cloudflare D1, chacune disposant de **ses propres identifiants et sans clé commune**. Une association technique entre l'e-mail et une réponse individuelle n'est donc pas possible. Les réponses **sans** e-mail sont anonymes ; même en cas d'opt-in, la réponse reste séparée de l'adresse e-mail et ne peut lui être associée.

### 2.3 Protection anti-spam (Turnstile et limitation de débit)

Lors de l'envoi de l'enquête et lors du contrôle rapide du site (Website Quick-Check), Cloudflare Turnstile peut effectuer un contrôle de sécurité. Des données techniques peuvent alors être transmises à Cloudflare afin de compliquer les envois automatisés.

Afin de limiter les abus, nous conservons brièvement pour l'enquête un **hachage à sens unique de l'adresse IP du client** (SHA-256, sans IP en clair) accompagné de la date UTC et d'un compteur (au maximum 20 envois réussis par jour et par hachage). Ces entrées de quota sont supprimées automatiquement après quelques jours et servent exclusivement à la lutte contre les abus — elles ne sont associées ni aux réponses de l'enquête ni aux adresses e-mail.

### 2.4 Website Quick-Check

Lorsque vous faites vérifier une URL, votre navigateur envoie l'URL et un jeton Turnstile à notre worker de scan. Le worker récupère la page cible et évalue des signaux visibles publiquement. **Aucun résultat de scan ni aucune URL saisie n'est stocké durablement chez nous.**

## 3. Finalités du traitement

| Données | Finalité |
|---|---|
| Données de connexion techniques | Fourniture, exploitation et sécurisation du site |
| Réponses à l'enquête | Statistiques anonymisées et rapport de référence (agrégation ; les cellules comptant moins de cinq réponses ne sont pas publiées) |
| E-mail facultatif | Notification unique ou ponctuelle dès que le rapport de référence est disponible |
| Turnstile / limitation de débit | Protection contre les abus / le spam (y compris quotas de hachage IP de courte durée) |
| URL du Quick-Check | Analyse unique de l'URL soumise ; pas de stockage durable chez nous |

La base juridique est en particulier le traitement en exécution d'un contrat ou de mesures précontractuelles, ainsi que notre intérêt légitime à l'exploitation des offres d'information et à la lutte contre les abus, dans la mesure où la LPD l'exige. L'e-mail facultatif repose sur votre **consentement** (opt-in), que vous pouvez révoquer à tout moment.

## 4. Sous-traitants et Cloudflare

Nous utilisons des services de **Cloudflare, Inc.** (et de sociétés affiliées) pour :

- l'hébergement / le CDN du site (Cloudflare Pages) ;
- l'API de l'enquête et le stockage dans **Cloudflare D1** ;
- le scanner de site (Cloudflare Worker, sans stockage durable) ;
- optionnellement **Cloudflare Turnstile**.

Cloudflare agit ici en tant que **sous-traitant** dans le cadre des finalités que nous définissons. Selon la configuration de Cloudflare, les traitements peuvent également avoir lieu en dehors de la Suisse ou de l'UE/EEE. Nous choisissons les prestataires et les paramètres de manière à viser un niveau de protection adéquat (notamment par des garanties contractuelles du prestataire).

## 5. Conservation

| Données | Conservation |
|---|---|
| Réponses à l'enquête | Jusqu'à l'évaluation et la publication d'agrégats anonymisés ; les réponses brutes ne sont pas conservées plus longtemps que nécessaire aux fins du rapport de référence (objectif : suppression ou anonymisation au plus tard **24 mois** après la soumission, sauf obligation légale plus longue) |
| E-mails facultatifs | Jusqu'à l'envoi de la notification du rapport ou jusqu'à votre demande de suppression ; suppression automatique au plus tard après **24 mois** ; suppression manuelle de la table d'inscription sur demande |
| Quotas de hachage IP (enquête) | Quelques jours (suppression automatique des entrées journalières plus anciennes) ; uniquement à des fins de lutte contre les abus |
| Quick-Check | Aucun stockage durable chez nous |
| Journaux serveur / CDN | Selon les paramètres standard de Cloudflare ; généralement de courte durée, à des fins d'exploitation et de sécurité |

## 6. Vos droits et suppression

Vous pouvez demander l'accès, la rectification et la suppression de vos données personnelles, ainsi que vous opposer au traitement, dans la mesure où la LPD le prévoit. Pour l'e-mail facultatif enregistré, il suffit généralement d'envoyer un message à **[i.laube@gmail.com](mailto:i.laube@gmail.com)** en demandant sa suppression ; nous supprimons alors l'adresse e-mail de la table d'inscription. Les réponses à l'enquête n'en sont pas affectées et ne sont pas associées à l'e-mail.

Les réponses à l'enquête ne peuvent pas être ultérieurement rattachées à une personne (même via l'e-mail facultatif) et ne peuvent donc pas être supprimées de manière ciblée.

Vous pouvez également déposer une plainte auprès du **Préposé fédéral à la protection des données et à la transparence (PFPDT)**.

## 7. Absence d'obligation de fournir des données / conséquences

L'utilisation du site et de la plupart des fonctionnalités est possible sans fournir de données personnelles. Sans opt-in par e-mail, vous ne recevrez pas de notification concernant le rapport de référence ; la participation anonyme à l'enquête reste possible.

## 8. Modifications

Nous pouvons adapter cette politique de protection des données si l'offre ou la situation juridique évolue. La version publiée sur cette page fait foi (`last_verified` en en-tête de page).
