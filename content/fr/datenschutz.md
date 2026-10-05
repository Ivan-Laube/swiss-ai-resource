---
title: "Déclaration de protection des données"
description: "Informations sur le traitement des données personnelles sur aicompliant.ch (art. 19 LPD): responsable, finalités, sous-traitants, conservation et suppression."
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

Cette déclaration de protection des données vous informe, conformément à l'**art. 19 LPD**, sur la manière dont les données personnelles sont traitées sur **aicompliant.ch**.

## 1. Responsable

Responsable du traitement des données :

| | |
|---|---|
| **Nom** | Ivan Laube |
| **E-mail** | [i.laube@gmail.com](mailto:i.laube@gmail.com) |

Autres informations sur le fournisseur : [Impressum](/de/impressum/).

## 2. Quelles données nous traitons

### 2.1 Accès au site web (technique)

Lors de l'accès au site web, des données de connexion techniques peuvent être générées (p. ex. adresse IP, horodatage, user-agent), dans la mesure où cela est nécessaire au fournisseur d'hébergement / CDN (Cloudflare) pour la diffusion et la sécurisation du site. Le site web lui-même est conçu comme un **export statique** et ne stocke **aucun** profil de visiteur dans notre code applicatif.

### 2.2 Sondage (facultatif, y compris e-mail)

Si vous participez au sondage sur l'adoption de l'IA, nous enregistrons :

- vos **réponses** (sans identification), accompagnées de la langue, de la version du sondage et de l'horodatage ;
- facultativement votre **adresse e-mail**, si vous demandez le rapport de benchmark (opt-in).

Les réponses et les adresses e-mail sont stockées dans des **tables séparées** au sein d'une base de données Cloudflare D1, chacune avec ses **propres identifiants et sans clé commune**. Une mise en relation technique entre l'e-mail et une réponse individuelle n'est ainsi pas possible. Les réponses **sans** e-mail sont anonymes ; même en cas d'opt-in, la réponse reste séparée de l'adresse e-mail et ne peut pas être reliée.

### 2.3 Protection anti-spam (Turnstile et limitation de débit)

Lors de l'envoi du sondage et lors du Quick-Check du site web, Cloudflare Turnstile peut effectuer une vérification de sécurité. Des données techniques peuvent alors être transmises à Cloudflare afin de compliquer les envois automatisés.

Afin de limiter les abus, nous conservons brièvement, pour le sondage, un **hachage à sens unique de l'IP client** (SHA-256, sans IP en clair) accompagné de la date UTC et d'un compteur (au maximum 20 envois réussis par jour et par hachage). Ces entrées de quota sont supprimées automatiquement après quelques jours et servent exclusivement à la prévention des abus — elles ne sont pas reliées aux réponses du sondage ni aux adresses e-mail.

### 2.4 Quick-Check du site web

Lorsque vous faites vérifier une URL, votre navigateur envoie l'URL ainsi qu'un jeton Turnstile à notre worker scanner. Le worker récupère la page cible et analyse les signaux visibles publiquement. **Aucun résultat de scan ni aucune URL saisie n'est stocké durablement chez nous.**

### 2.5 Pas de cookies, pas de tracking ; statistiques d'utilisation

Ce site web n'utilise **aucun cookie** et ne recourt à **aucun outil d'analyse ou de tracking** (pas de pixel de suivi, pas de fingerprinting, aucun script tiers hormis Turnstile). Une bannière de cookies n'est donc pas nécessaire. Le Quick-Check dépose brièvement, pour transmettre une URL depuis la page d'accueil vers le formulaire, une entrée dans le stockage de session (sessionStorage) de votre navigateur ; celle-ci est immédiatement supprimée lors de sa lecture et n'est pas transmise vers nos systèmes.

Afin de mesurer l'utilisation du site et des outils, nous utilisons exclusivement des **comptages côté serveur** :

- **Pages vues :** les statistiques de trafic agrégées de Cloudflare (p. ex. nombre de requêtes par page), générées à partir des données de connexion de toute façon générées (ch. 2.1) – sans script, cookie ni identifiant dans votre navigateur.
- **Utilisation des outils :** pour chaque Quick-Check ou soumission de sondage, nos workers comptabilisent un point de données comprenant l'outil, le résultat (p. ex. réussi, rejeté) et le statut HTTP. **Aucune** adresse IP, URL, réponse de sondage ou autre identifiant ; un point de données ne peut être attribué à aucune personne.

## 3. Finalités du traitement

| Données | Finalité |
|---|---|
| Données de connexion techniques | Diffusion, exploitation et sécurisation du site web |
| Réponses au sondage | Statistiques anonymisées et benchmark (agrégation ; les cellules comptant moins de cinq réponses ne sont pas publiées) |
| E-mail facultatif | Notification unique ou ponctuelle dès que le rapport de benchmark est disponible |
| Turnstile / limitation de débit | Protection contre les abus / le spam (y compris quotas de hachage IP de courte durée) |
| URL du Quick-Check | Analyse unique de l'URL soumise ; pas de stockage durable chez nous |

La base légale est notamment le traitement aux fins de l'exécution d'un contrat ou de mesures précontractuelles, ainsi que notre intérêt légitime à l'exploitation des offres d'information et à la prévention des abus, dans la mesure où la LPD l'exige. L'e-mail facultatif repose sur votre **consentement** (opt-in), que vous pouvez révoquer à tout moment.

## 4. Sous-traitants et Cloudflare

Nous utilisons des services de **Cloudflare, Inc.** (et des sociétés affiliées) pour :

- l'hébergement / CDN du site web (Cloudflare Pages) ;
- l'API du sondage et le stockage dans **Cloudflare D1** ;
- le scanner de sites web (Cloudflare Worker, sans stockage durable) ;
- des comptages d'utilisation anonymes (Cloudflare Workers Analytics Engine) et des statistiques de trafic agrégées ;
- facultativement **Cloudflare Turnstile**.

Cloudflare agit à cet égard comme **sous-traitant** dans le cadre des finalités que nous définissons. Selon la configuration de Cloudflare, des traitements peuvent également avoir lieu en dehors de la Suisse ou de l'UE/EEE. Nous choisissons nos fournisseurs et paramètres de manière à viser un niveau de protection adéquat (notamment des garanties contractuelles du fournisseur).

## 5. Conservation

| Données | Conservation |
|---|---|
| Réponses au sondage | Jusqu'à l'évaluation et la publication des agrégats anonymisés ; les réponses brutes ne sont pas conservées au-delà de ce qui est nécessaire pour le benchmark (objectif : suppression ou anonymisation au plus tard **24 mois** après la soumission, sauf obligation légale plus longue) |
| E-mails facultatifs | Jusqu'à l'envoi de la notification du rapport ou jusqu'à votre demande de suppression ; suppression automatique au plus tard après **24 mois** ; suppression manuelle de la table d'inscription sur demande |
| Quotas de hachage IP (sondage) | Quelques jours (suppression automatique des entrées journalières plus anciennes) ; uniquement pour la prévention des abus |
| Quick-Check | Pas de stockage durable chez nous |
| Comptages d'utilisation (outils) | Trois mois (suppression automatique par Cloudflare) ; sans lien avec une personne |
| Journaux serveur / CDN | Selon les réglages standards de Cloudflare ; en général de courte durée, pour l'exploitation et la sécurité |

## 6. Vos droits et suppression

Vous pouvez demander l'accès, la rectification et la suppression de vos données personnelles, ainsi que vous opposer au traitement, dans la mesure où la LPD le prévoit. Pour un e-mail facultativement enregistré, un message adressé à **[i.laube@gmail.com](mailto:i.laube@gmail.com)** demandant la suppression suffit en règle générale ; nous supprimons alors l'adresse e-mail de la table d'inscription. Les réponses du sondage n'en sont pas affectées et ne sont pas reliées à l'e-mail.

Les réponses au sondage ne peuvent pas être rattachées a posteriori à une personne (même via l'e-mail facultatif) et ne peuvent donc pas faire l'objet d'une suppression ciblée.

Vous pouvez en outre déposer une plainte auprès du **Préposé fédéral à la protection des données et à la transparence (PFPDT)**.

## 7. Aucune obligation de communication / conséquences

L'utilisation du site web et de la plupart de ses fonctions est possible sans indication de données personnelles. Sans opt-in pour l'e-mail, vous ne recevrez pas de notification concernant le rapport de benchmark ; la participation anonyme au sondage reste possible.

## 8. Modifications

Nous pouvons adapter cette déclaration de protection des données si l'offre ou la situation juridique évolue. La version publiée sur cette page fait foi (`last_verified` en en-tête de page).
