---
title: "LLM hébergés aux États-Unis sous la nLPD"
description: "Quand les entreprises suisses peuvent-elles transmettre des données personnelles à des modèles de langage situés aux États-Unis : Swiss-U.S. Data Privacy Framework, clauses type de protection des données, obligations d'information et une checklist pratique."
last_verified: "2026-10-01"
volatility: "fast"
translation_status: "draft"
category: "datenschutz"
reviewed_by: null
review_date: null
review_scope: null
sources:
  - title: "EDÖB – Bekanntgabe von Personendaten ins Ausland"
    url: "https://www.edoeb.admin.ch/de/bekanntgabe-von-personendaten-ins-ausland"
  - title: "EDÖB – Einsatz von ChatGPT und vergleichbaren KI-gestützten Anwendungen"
    url: "https://www.edoeb.admin.ch/de/04042023-einsatz-von-chatgpt-und-vergleichbaren-ki-gestuetzten-anwendungen"
  - title: "Fedlex – Bundesgesetz über den Datenschutz (DSG), Art. 16 und 17"
    url: "https://www.fedlex.admin.ch/eli/cc/2022/491/de"
  - title: "Fedlex – Verordnung über den Datenschutz (DSV), Anhang 1"
    url: "https://www.fedlex.admin.ch/eli/cc/2022/568/de"
  - title: "Data Privacy Framework – Participant List"
    url: "https://www.dataprivacyframework.gov/list"
---

De nombreux modèles de langage génératifs (Large Language Models, LLM) sont exploités aux États-Unis. Dès que des **données personnelles** y parviennent, les règles relatives à la **communication à l'étranger** s'appliquent (art. 16 et 17 LPD). Est considérée comme communication non seulement la transmission, mais aussi le fait de rendre accessibles des données (art. 5 let. e LPD), par exemple lorsqu'un fournisseur établi aux États-Unis peut accéder à des données stockées en Suisse.

## Règle de base : protection adéquate ou garanties {#transfer-abroad}

Les données personnelles peuvent être communiquées à l'étranger si le Conseil fédéral a constaté que l'État destinataire garantit une **protection adéquate** (art. 16 al. 1 LPD). La liste de ces États figure à l'**annexe 1 de l'ordonnance sur la protection des données (OPDo)** ; elle comprend notamment tous les États de l'UE et de l'EEE. Pour les autres États, des **garanties appropriées** sont nécessaires (art. 16 al. 2 LPD), ou alors un cas d'exception selon l'art. 17 LPD.

L'entreprise doit informer les personnes concernées de l'État destinataire et, le cas échéant, des garanties ou de l'exception appliquée (art. 19 al. 4 LPD). Les entités tenant un registre des activités de traitement y consignent également ces informations (art. 12 LPD). Les entreprises comptant moins de 250 collaborateurs sont, dans la plupart des cas, dispensées de l'obligation de tenir un registre (art. 24 OPDo).

## États-Unis : Swiss-U.S. Data Privacy Framework {#swiss-us-dpf}

Depuis le **15 septembre 2024**, le Conseil fédéral reconnaît pour les États-Unis une protection adéquate, mais uniquement pour les entreprises américaines certifiées au titre du **Swiss-U.S. Data Privacy Framework (DPF)** (annexe 1 OPDo). Cela ne vaut pas pour les autres destinataires situés aux États-Unis.

Vérifiez, avant de recourir à un fournisseur américain :

1. La société qui reçoit précisément vos données est-elle activement certifiée sur la liste publique des participants au DPF ?
2. La certification couvre-t-elle expressément le **Swiss-U.S. DPF** et pas seulement l'EU-U.S. DPF ?
3. Couvre-t-elle les données concernées ? Les données du personnel (données RH) font l'objet d'une certification distincte.

Si le destinataire n'est pas certifié de manière adéquate, une autre base est nécessaire (voir section suivante). Gardez également à l'esprit que l'adéquation dépend de la pérennité du DPF. Le régime précédent (Privacy Shield) a été invalidé par la Cour de justice de l'UE en 2020, et le PFPDT l'a ensuite jugé insuffisant également pour la Suisse. C'est pourquoi de nombreuses entreprises conviennent en plus, avec leurs principaux fournisseurs américains, de clauses type de protection des données.

## Sans DPF : garanties et exceptions {#safeguards}

En l'absence d'une certification DPF adéquate, la communication reste admissible si une protection des données appropriée est garantie d'une autre manière (art. 16 al. 2 LPD), notamment par :

- des **clauses type de protection des données** approuvées, établies ou reconnues par le PFPDT, en particulier les clauses contractuelles types de la Commission européenne assorties des adaptations nécessaires pour la Suisse ;
- des **clauses de protection des données intégrées à un contrat individuel**, communiquées au préalable au PFPDT ;
- des **règles d'entreprise contraignantes** (Binding Corporate Rules), applicables uniquement au sein d'un groupe.

Quiconque s'appuie sur de telles clauses doit vérifier si le destinataire est en mesure de les respecter et si le droit de l'État destinataire, notamment en ce qui concerne l'accès des autorités, ne s'y oppose pas (analyse d'impact du transfert, Transfer Impact Assessment, TIA). Selon le résultat, des mesures techniques supplémentaires peuvent être nécessaires, par exemple la suppression ou la pseudonymisation des noms dans les données saisies.

Dans certains cas particuliers, l'art. 17 LPD autorise une communication même sans protection adéquate, par exemple avec le consentement exprès de la personne concernée ou lorsque la communication est directement nécessaire à l'exécution d'un contrat avec elle. Ces exceptions se prêtent toutefois mal à un usage courant d'un outil d'IA.

## Particularités des modèles de langage {#llm-specifics}

Le PFPDT recommande une **utilisation réfléchie** des applications d'IA et rappelle aux entreprises leurs obligations, notamment celle d'informer de manière transparente sur la finalité et le type de traitement.

Clarifiez en outre :

- Les données saisies sont-elles utilisées pour l'**entraînement** du modèle, et cela peut-il être exclu ?
- Un **contrat de sous-traitance** (en anglais Data Processing Agreement, DPA) a-t-il été conclu (art. 9 LPD) ?
- Quelles données peuvent être saisies ? Les données personnelles sensibles (p. ex. données de santé) et les données soumises au secret professionnel uniquement si cela a été examiné et sécurisé de manière expresse.
- Où sont stockés les journaux (logs), les embeddings et les demandes de support, et pendant combien de temps ?

## Checklist succincte {#checklist}

| Question | Pourquoi est-ce pertinent |
|---|---|
| Les données saisies ou les résultats contiennent-ils des données personnelles ? | Sans données personnelles, les règles relatives à la communication à l'étranger ne s'appliquent pas |
| Le destinataire américain est-il certifié au titre du Swiss-U.S. DPF ? | Protection adéquate depuis le 15.9.2024, uniquement pour les destinataires certifiés (annexe 1 OPDo) |
| À défaut : des clauses type de protection des données et une analyse d'impact du transfert (TIA) sont-elles en place ? | Art. 16 al. 2 LPD |
| Un contrat de sous-traitance a-t-il été conclu ? | Art. 9 LPD |
| Les personnes concernées ont-elles été informées de l'État destinataire et des garanties ? | Art. 19 al. 4 LPD |
| L'entraînement avec vos données est-il exclu ? | Limitation de la finalité et transparence (art. 6 al. 3 et art. 19 LPD) |

Les usages transfrontaliers de l'IA doivent être examinés au cas par cas, en particulier lorsqu'il s'agit de données personnelles sensibles.
