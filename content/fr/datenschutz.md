---
title: "Déclaration de protection des données"
description: "Comment aicompliant.ch traite les données personnelles (art. 19 LPD) : responsable du traitement, finalités, Cloudflare en tant que sous-traitant, communication à l'étranger, conservation et vos droits."
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

La présente déclaration de protection des données vous informe, conformément à l'**art. 19 LPD**, sur les données personnelles que nous traitons sur **aicompliant.ch**, à quelles fins et pendant combien de temps.

## 1. Responsable du traitement

Le responsable du traitement des données est :

| | |
|---|---|
| **Nom** | Ivan Laube |
| **E-mail** | [i.laube@gmail.com](mailto:i.laube@gmail.com) |

Autres informations : [Mentions légales](/fr/impressum/).

## 2. Quelles données traitons-nous

### 2.1 Visite du site

La visite du site génère des données de connexion techniques (p. ex. adresse IP, horodatage, navigateur et système d'exploitation). Notre prestataire d'hébergement Cloudflare en a besoin pour livrer les pages et les protéger contre les attaques. Le site se compose de pages statiques ; nous n'établissons nous-mêmes aucun profil des visiteuses et visiteurs.

### 2.2 Enquête (avec adresse e-mail facultative)

Si vous participez à l'enquête sur l'utilisation de l'IA, nous enregistrons :

- vos **réponses**, accompagnées de la langue, de la version de l'enquête et du moment de la participation ;
- éventuellement votre **adresse e-mail**, si vous demandez le rapport de benchmark, accompagnée de la langue et de la semaine civile de l'inscription.

Les réponses et les adresses e-mail sont enregistrées dans des **tables distinctes** d'une base de données Cloudflare D1, avec **des identifiants propres et sans clé commune**. Pour les réponses, il n'est pas noté si une adresse e-mail a été indiquée, et pour l'adresse e-mail, nous ne conservons que la semaine civile, et non l'horodatage précis. Il n'existe donc aucun lien enregistré entre l'adresse e-mail et la réponse. Nous ne relions pas les deux et ne les exploitons pas conjointement. Sans adresse e-mail, votre participation est anonyme.

### 2.3 Protection contre les abus (Turnstile et limitation des envois)

Lors de l'envoi de l'enquête et du contrôle rapide du site web, Cloudflare Turnstile vérifie si la requête provient d'un être humain. À cette fin, des données techniques de votre navigateur ainsi que votre adresse IP sont transmises à Cloudflare.

Afin de limiter les abus de l'enquête, nous enregistrons en outre brièvement une **valeur de hachage de votre adresse IP** accompagnée de la date et d'un compteur (20 envois au maximum par jour). La valeur de hachage est formée au moyen d'une clé secrète et de la date correspondante (HMAC-SHA-256) ; elle change donc chaque jour et ne permet pas de remonter à l'adresse IP sans cette clé. Nous ne conservons pas l'adresse IP elle-même. Ces entrées sont supprimées automatiquement au plus tard après dix jours. Elles servent uniquement à la prévention des abus et ne sont pas reliées aux réponses ou aux adresses e-mail.

### 2.4 Vérification rapide du site web (Quick-Check)

Lorsque vous faites vérifier une URL, votre navigateur transmet l'URL et un jeton Turnstile à notre scanner. Le scanner accède au site indiqué et évalue des caractéristiques visibles publiquement. **Nous ne conservons pas durablement les URL saisies ni les résultats.**

### 2.5 Vérification IA et aides à la décision

Vos réponses dans la vérification IA et dans les aides à la décision sont traitées uniquement dans votre navigateur et ne nous sont pas transmises. Un lien copié vers un résultat des aides à la décision contient vos réponses ; vous décidez vous-même à qui vous le transmettez.

### 2.6 Pas de cookies, pas de suivi ; statistiques d'utilisation

Ce site n'utilise **aucun cookie** et ne recourt à **aucun outil d'analyse ou de suivi** tel que des pixels de suivi. À l'exception de Cloudflare Turnstile lors de l'envoi de formulaires (ch. 2.3), nous ne chargeons aucun script de tiers. Pour transmettre une URL de la page d'accueil vers le contrôle rapide, le site dépose brièvement une entrée dans la mémoire de session (sessionStorage) de votre navigateur. Elle est immédiatement supprimée lors de sa lecture et ne nous est pas transmise.

Pour mesurer l'utilisation du site et des outils, nous utilisons uniquement des **comptages côté serveur** :

- **Pages vues :** statistiques agrégées de Cloudflare (p. ex. nombre de vues par page), issues des données de connexion mentionnées au ch. 2.1, sans script, cookie ni identifiant dans votre navigateur.
- **Utilisation des outils :** pour chaque contrôle rapide et chaque envoi d'enquête, nous comptabilisons un point de données comprenant l'outil, le résultat (p. ex. réussi, rejeté) et le statut technique. Il ne contient **aucune** adresse IP, URL, réponse ou autre identifiant et ne peut être attribué à une personne.

## 3. Finalités et principes du traitement

| Données | Finalité |
|---|---|
| Données de connexion techniques | Livraison, exploitation et protection du site |
| Réponses à l'enquête | Statistique anonymisée et benchmark (les valeurs portant sur moins de cinq réponses ne sont pas publiées) |
| Adresse e-mail (facultative) | Notification dès que le rapport de benchmark est disponible |
| Turnstile et valeur de hachage IP | Protection contre les abus et le spam |
| URL du contrôle rapide | Vérification ponctuelle du site indiqué |

Nous traitons les données personnelles conformément aux principes de la LPD (art. 6), uniquement aux fins mentionnées et seulement dans la mesure nécessaire. Nous traitons l'adresse e-mail sur la base de votre **consentement**, que vous pouvez révoquer à tout moment. Les autres traitements servent notre intérêt à offrir une prestation sûre et fonctionnelle.

## 4. Sous-traitants et communication à l'étranger

Nous utilisons des services de **Cloudflare, Inc.** (États-Unis) et de ses sociétés affiliées pour :

- l'hébergement et la livraison du site (Cloudflare Pages) ;
- l'enquête et son enregistrement dans **Cloudflare D1** ;
- le scanner de site web (Cloudflare Workers, sans enregistrement durable) ;
- les comptages d'utilisation anonymes (Cloudflare Workers Analytics Engine) et les statistiques de trafic agrégées ;
- la protection anti-spam **Cloudflare Turnstile**.

Cloudflare traite les données en tant que **sous-traitant** pour notre compte. Cloudflare, Inc. a son siège aux États-Unis et exploite des centres de données dans de nombreux pays ; les données peuvent donc être traitées aux États-Unis et dans d'autres États. Pour les États-Unis, nous nous appuyons sur la certification de Cloudflare dans le cadre du **Swiss-U.S. Data Privacy Framework** (annexe 1 OPDo). Pour les États ne disposant pas d'une protection des données adéquate, les clauses contractuelles types figurant dans l'accord de sous-traitance (Data Processing Addendum) de Cloudflare s'appliquent.

## 5. Conservation

| Données | Conservation |
|---|---|
| Réponses à l'enquête | Suppression automatique après **24 mois** ; seuls les résultats globaux anonymisés sont publiés |
| Adresses e-mail | Jusqu'à la notification du rapport ou jusqu'à votre révocation, au plus tard **24 mois** (suppression automatique) |
| Valeurs de hachage IP (enquête) | Suppression automatique au plus tard après dix jours |
| Contrôle rapide | Aucun enregistrement durable |
| Comptages d'utilisation | Trois mois (suppression automatique par Cloudflare) ; sans référence à une personne |
| Journaux de serveur et de CDN | Selon les réglages standard de Cloudflare, généralement à court terme pour l'exploitation et la sécurité |

## 6. Vos droits

Vous pouvez demander l'accès à vos données personnelles, leur rectification ou leur suppression, vous opposer à un traitement et exiger la remise de vos données aux conditions de l'art. 28 LPD (art. 25 ss et art. 32 LPD). Vous pouvez révoquer un consentement à tout moment.

Pour faire supprimer votre adresse e-mail, un bref message à **[i.laube@gmail.com](mailto:i.laube@gmail.com)** suffit. Nous supprimons alors l'adresse de la table d'inscription.

Comme nous ne relions pas les réponses à l'enquête à des personnes, nous ne pouvons pas les supprimer de manière ciblée sur demande. Elles sont automatiquement supprimées après 24 mois.

Vous pouvez également vous adresser au **Préposé fédéral à la protection des données et à la transparence (PFPDT)**.

## 7. Caractère facultatif

Vous pouvez utiliser le site et la plupart de ses fonctions sans indiquer de données personnelles. Sans adresse e-mail, vous ne recevrez pas de notification concernant le rapport de benchmark ; vous pouvez néanmoins participer anonymement à l'enquête.

## 8. Modifications

Nous adaptons la présente déclaration de protection des données lorsque notre offre ou la situation juridique évolue. Seule fait foi la version publiée sur cette page ; la date de la dernière vérification figure en en-tête de page.
