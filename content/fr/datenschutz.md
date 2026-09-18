---
title: "Politique de confidentialité"
description: "Informations sur le traitement des données personnelles sur aicompliant.ch (art. 19 LPD) : responsable, finalités, sous-traitants, conservation et suppression."
last_verified: "2026-09-18"
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

La présente politique de confidentialité vous informe, conformément à l'**art. 19 LPD**, sur le traitement des données personnelles sur **aicompliant.ch**.

## 1. Responsable du traitement

Responsable du traitement :

| | |
|---|---|
| **Nom** | Ivan Laube |
| **Adresse** | Vorhaldenstrasse 10, 8049 Zürich, Suisse |
| **E-mail** | [i.laube@gmail.com](mailto:i.laube@gmail.com) |

Autres indications sur le fournisseur : [Mentions légales](/fr/impressum/).

## 2. Quelles données nous traitons

### 2.1 Consultation du site (technique)

Lors de la consultation du site, des données techniques de connexion peuvent être générées (p. ex. adresse IP, horodatage, user-agent) dans la mesure où le prestataire d'hébergement/CDN (Cloudflare) en a besoin pour la livraison et la sécurisation du site. Le site lui-même est un **export statique** et ne stocke **aucun** profil de visiteur dans notre code d'application.

### 2.2 Sondage (e-mail facultatif)

Si vous participez au sondage sur l'adoption de l'IA, nous enregistrons :

- vos **réponses** (sans identification), avec la langue, la version du sondage et l'horodatage ;
- éventuellement votre **adresse e-mail**, si vous demandez le rapport de benchmark (opt-in).

Les réponses et les adresses e-mail sont stockées dans des **tables distinctes** d'une base Cloudflare D1, chacune avec **ses propres identifiants et sans clé commune**. Une association technique entre e-mail et réponse individuelle n'est donc pas possible. Les réponses **sans** e-mail sont anonymes ; même avec opt-in, la réponse reste séparée de l'adresse e-mail et non associable.

### 2.3 Protection anti-spam (Turnstile)

Lors de l'envoi du sondage, Cloudflare Turnstile peut effectuer un contrôle de sécurité. Des données techniques peuvent être transmises à Cloudflare pour limiter les envois automatisés.

### 2.4 Quick-Check du site web

Si vous faites vérifier une URL, votre navigateur envoie l'URL à notre Worker de scan. Le Worker récupère la page cible et évalue des signaux publiquement visibles. **Nous ne stockons pas durablement les résultats de scan ni les URL soumises.**

## 3. Finalités du traitement

| Données | Finalité |
|---|---|
| Données techniques de connexion | Livraison, exploitation et sécurisation du site |
| Réponses au sondage | Statistiques anonymisées et benchmark (agrégation ; les cellules avec moins de cinq réponses ne sont pas publiées) |
| E-mail facultatif | Notification ponctuelle ou selon besoin lorsque le rapport de benchmark est disponible |
| Turnstile | Protection contre les abus / le spam |
| URL Quick-Check | Évaluation ponctuelle de l'URL soumise ; pas de stockage durable de notre côté |

La base juridique est notamment le traitement pour l'exécution d'un contrat ou de mesures précontractuelles, ou notre intérêt légitime à exploiter les offres d'information et à prévenir les abus, dans la mesure où la LPD l'exige. L'e-mail facultatif repose sur votre **consentement** (opt-in), que vous pouvez retirer à tout moment.

## 4. Sous-traitants et Cloudflare

Nous utilisons des services de **Cloudflare, Inc.** (et sociétés affiliées) pour :

- l'hébergement / CDN du site (Cloudflare Pages) ;
- l'API du sondage et le stockage dans **Cloudflare D1** ;
- le scanner de site (Cloudflare Worker, sans stockage durable) ;
- éventuellement **Cloudflare Turnstile**.

Cloudflare agit comme **sous-traitant** dans le cadre des finalités que nous définissons. Selon la configuration Cloudflare, des traitements peuvent aussi avoir lieu hors de Suisse ou de l'UE/EEE. Nous choisissons prestataires et paramètres de manière à viser un niveau de protection adéquat (y compris les garanties contractuelles du prestataire).

## 5. Conservation

| Données | Conservation |
|---|---|
| Réponses au sondage | Jusqu'à l'évaluation et la publication d'agrégats anonymisés ; les réponses brutes ne sont pas conservées plus longtemps que nécessaire pour le benchmark (objectif : suppression ou anonymisation au plus tard **24 mois** après l'envoi, sauf obligation légale plus longue) |
| E-mails facultatifs | Jusqu'à l'envoi de la notification du rapport ou jusqu'à votre demande de suppression ; suppression automatique au plus tard après **24 mois** ; suppression manuelle de la table d'inscription sur demande |
| Quick-Check | Pas de stockage durable de notre côté |
| Journaux serveur/CDN | Selon les paramètres standard de Cloudflare ; en règle générale à court terme pour l'exploitation et la sécurité |

## 6. Vos droits et la suppression

Vous pouvez demander l'accès, la rectification et la suppression de vos données personnelles ainsi que vous opposer au traitement, dans la mesure où la LPD le prévoit. Pour un e-mail facultatif enregistré, un message à **[i.laube@gmail.com](mailto:i.laube@gmail.com)** demandant la suppression suffit en général ; nous supprimons alors l'adresse e-mail de la table d'inscription. Les réponses au sondage n'en sont pas affectées et ne sont pas liées à l'e-mail.

Les réponses au sondage ne peuvent plus être attribuées à une personne (y compris via l'e-mail facultatif) et ne peuvent donc pas être supprimées de manière ciblée.

Vous pouvez également déposer une plainte auprès du **Préposé fédéral à la protection des données et à la transparence (PFPDT / EDÖB)**.

## 7. Pas d'obligation de fournir des données / conséquences

Vous pouvez utiliser le site et la plupart des fonctions sans indiquer de données personnelles. Sans opt-in e-mail, vous ne recevrez pas de notification concernant le rapport de benchmark ; la participation anonyme au sondage reste possible.

## 8. Modifications

Nous pouvons adapter la présente politique de confidentialité si l'offre ou le droit évolue. Fait foi la version publiée sur cette page (`last_verified` en en-tête de page).
