---
title: "LLM hébergés aux États-Unis sous la LPD"
description: "Quand les entreprises suisses peuvent communiquer des données personnelles à des modèles de langage hébergés aux États-Unis : adéquation, Swiss-U.S. Data Privacy Framework, garanties contractuelles et contrôles pratiques."
last_verified: "2026-07-10"
volatility: "fast"
translation_status: "draft"
reviewed_by: null
review_date: null
review_scope: null
sources:
  - title: "EDÖB – Bekanntgabe von Personendaten ins Ausland"
    url: "https://www.edoeb.admin.ch/de/bekanntgabe-von-personendaten-ins-ausland"
  - title: "EDÖB – Einsatz von ChatGPT und vergleichbaren KI-gestützten Anwendungen"
    url: "https://www.edoeb.admin.ch/de/04042023-einsatz-von-chatgpt-und-vergleichbaren-ki-gestuetzten-anwendungen"
  - title: "Fedlex – Bundesgesetz über den Datenschutz (DSG), Art. 16"
    url: "https://www.fedlex.admin.ch/eli/cc/2022/491/de"
  - title: "Data Privacy Framework – Participant List"
    url: "https://www.dataprivacyframework.gov/list"
---

De nombreux modèles de langage génératifs (LLM) sont exploités aux États-Unis. Dès que des **données personnelles** quittent la Suisse, s'appliquent les règles relatives à la **Communication de données personnelles à l'étranger** (art. 16 et 17 LPD). Cette page explique le cadre pour les entreprises suisses — sans remplacer un conseil juridique.

## Point de départ : données personnelles et transfert à l'étranger

Les données personnelles ne peuvent en principe être communiquées à l'étranger que si le pays de destination offre un **niveau de protection adéquat** ou si des **garanties appropriées** s'appliquent. Le Conseil fédéral fixe dans l'**annexe 1 de l'Ordonnance sur la protection des données (OPDo)** quels États offrent une protection adéquate.

La personne concernée doit être informée d'une communication de données à l'étranger (art. 19 al. 4 LPD). Les pays et les garanties font partie des mentions obligatoires du registre des activités de traitement (art. 12 LPD).

## États-Unis et Swiss-U.S. Data Privacy Framework

Le **15 septembre 2024**, la modification de la liste des États (annexe 1 OPDo) relative aux États-Unis est entrée en vigueur. Le cadre juridique associé — le **Swiss-U.S. Data Privacy Framework (DPF)** — s'applique aux organisations américaines **certifiées**.

Contrôle pratique avant d'utiliser un fournisseur américain :

1. Le destinataire concret est-il activement certifié sur la liste publique des participants au DPF ?
2. La certification couvre-t-elle expressément l'extension **Swiss-U.S.** (et non seulement EU-U.S.) ?
3. La finalité de traitement certifiée correspond-elle à votre usage (p. ex. IA cloud, support, analytics) ?

Sans certification adaptée, « le fournisseur est situé aux États-Unis » ne constitue **pas** à elle seule une base d'adéquation.

## Lorsqu'aucune décision d'adéquation ne s'applique

En l'absence de décision d'adéquation (ou si elle ne s'applique pas au destinataire concret), les transferts peuvent néanmoins être admissibles si la protection des données est autrement assurée — notamment par :

- des **clauses type de protection des données** (reconnues ou approuvées par le Préposé fédéral à la protection des données et à la transparence (PFPDT) ; les SCC de l'UE et les MCC du CdE sont reconnues par le PFPDT) ;
- des **clauses de protection des données dans un contrat spécifique** (avec obligation d'information au PFPDT) ;
- des **règles d'entreprise contraignantes (BCR)**.

Le responsable du traitement doit s'assurer que le destinataire peut respecter les clauses et que le droit du pays tiers ne s'y oppose pas. Des mesures techniques peuvent être nécessaires si des accès disproportionnés des autorités menacent.

## Points spécifiques aux LLM

Le PFPDT recommande aux utilisatrices et utilisateurs un **usage conscient** des applications d'IA et rappelle aux entreprises leurs obligations — en particulier une information transparente sur les finalités et la nature du traitement.

Clarifier en outre :

- Les saisies sont-elles utilisées pour l'**entraînement du modèle** ? Existe-t-il un opt-out ?
- Existe-t-il un **contrat de sous-traitance (DPA)** ?
- Quelles catégories de données peuvent être saisies (pas de données personnelles particulièrement sensibles sans base légale claire et mesures de protection) ?
- Où se trouvent les journaux, embeddings et tickets de support ?

## Liste de contrôle courte

| Question | Pourquoi c'est pertinent |
|---|---|
| Les prompts contiennent-ils des données personnelles ? | Sans données personnelles, pas de question de transfert à l'étranger sous la LPD |
| Le destinataire US est-il certifié Swiss-U.S. DPF ? | Base d'adéquation possible depuis le 15.09.2024 |
| Sinon SCC/DPA et examen du transfert ? | Art. 16 al. 2 LPD |
| Information des personnes concernées ? | Art. 19 al. 4 LPD |
| Utilisation pour l'entraînement et opt-out clarifiés ? | Transparence et limitation des finalités |

## Avertissement

Cette page est **informative et ne constitue pas un conseil juridique**. Les déploiements d'IA transfrontaliers doivent être examinés au cas par cas.
