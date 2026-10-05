---
title: "Checklist : acquisition d'outils d'IA pour les PME suisses"
description: "Questions pratiques à poser aux fournisseurs et à se poser en interne avant d'acheter un outil d'IA : protection des données, hébergement, contrats, gouvernance et lien avec l'UE."
last_verified: "2026-10-01"
volatility: "stable"
translation_status: "draft"
category: "beschaffung"
reviewed_by: null
review_date: null
review_scope: null
sources:
  - title: "EDÖB – KI und Datenschutz"
    url: "https://www.edoeb.admin.ch/de/ki-und-datenschutz"
  - title: "EDÖB – Bekanntgabe von Personendaten ins Ausland"
    url: "https://www.edoeb.admin.ch/de/bekanntgabe-von-personendaten-ins-ausland"
  - title: "EUR-Lex – Verordnung (EU) 2024/1689 (AI Act)"
    url: "https://eur-lex.europa.eu/legal-content/DE/TXT/?uri=CELEX%3A32024R1689"
  - title: "EUR-Lex – Verordnung (EU) 2026/1744 (Digital Omnibus on AI)"
    url: "https://eur-lex.europa.eu/legal-content/DE/TXT/?uri=CELEX:32026R1744"
  - title: "FINMA Guidance 08/2024 (PDF)"
    url: "https://www.finma.ch/en/~/media/finma/dokumente/dokumentencenter/myfinma/4dokumentation/finma-aufsichtsmitteilungen/20241218-finma-aufsichtsmitteilung-08-2024.pdf"
  - title: "Anthropic – AI Fluency framework (4D)"
    url: "https://www.anthropic.com/ai-fluency"
---

Cette checklist résume les principales questions relatives à la **protection des données**, à l'**hébergement à l'étranger**, à l'**AI Act de l'UE** et, le cas échéant, à la **gouvernance FINMA**. Elle aide à choisir et à évaluer un outil d'IA, mais ne remplace ni un examen juridique ni la décision de validation interne à l'entreprise.

Passez en revue ces questions avant le projet pilote, puis à nouveau avant la mise en production.

## 1. Cas d'usage et données

- Quel problème l'outil doit-il résoudre, et quelles **données personnelles** sont concernées ?
- Des données personnelles particulièrement sensibles, du profilage ou des décisions individuelles automatisées ayant un effet important entrent-ils en jeu ?
- Le cas d'usage peut-il démarrer avec des données **synthétiques ou anonymisées** ?
- Qui est responsable en interne (métier, informatique, protection des données) ?

## 2. Protection des données et transparence (LPD)

- La finalité, le fonctionnement et les sources des données peuvent-ils être expliqués de manière **compréhensible** aux personnes concernées, et cela figure-t-il dans la déclaration de protection des données ?
- En cas de risque élevé, une **analyse d'impact relative à la protection des données personnelles** est-elle prévue (art. 22 LPD) ?
- L'outil prend-il des décisions exclusivement automatisées concernant des personnes ? Dans ce cas, les personnes concernées doivent en être informées et pouvoir exiger un **réexamen par une personne physique** (art. 21 LPD).
- L'outil est-il consigné dans le registre des activités de traitement, avec indication de l'étranger et des garanties ? Ce registre est obligatoire à partir de 250 collaborateurs ou en cas de traitements présentant un risque élevé (art. 12 LPD, art. 24 OPDo).

## 3. Hébergement et communication à l'étranger {#hosting-transfer}

- Dans quels pays les données sont-elles stockées et traitées (CH / UE / États-Unis / autres), et depuis quel endroit le fournisseur y a-t-il accès, par exemple pour le support ?
- En cas de destinataires américains : la certification au titre du **Swiss-U.S. Data Privacy Framework** a-t-elle été vérifiée ?
- Sinon : des **clauses type de protection des données** reconnues ont-elles été convenues et l'examen du transfert est-il documenté ?
- Les données saisies sont-elles utilisées pour l'**entraînement**, et cette utilisation peut-elle être exclue ?

## 4. Contrat et exploitation {#contract-operations}

- Existe-t-il un **contrat de sous-traitance** (DPA), avec des règles claires concernant les sous-traitants ultérieurs ?
- Les délais de suppression, l'exportation des données, la notification des incidents de sécurité et les droits de contrôle sont-ils réglés ?
- La disponibilité, le lieu du support et la liste des sous-traitants ultérieurs sont-ils connus ?
- Plan de sortie : pouvez-vous emporter vos données et configurations en cas de changement de fournisseur ?

## 5. AI Act de l'UE (en cas de lien avec l'UE) {#eu-ai-act}

- Le système ou son **résultat est-il proposé ou utilisé dans l'UE** ?
- Quel est votre rôle (fournisseur, déployeur, importateur, distributeur) ?
- Comment le système est-il classé globalement (interdit, à haut risque, soumis à une obligation de transparence, GPAI ou sans obligation particulière) ?
- Les délais applicables sont-ils associés au produit (voir le [calendrier](/fr/eu-ai-act-swiss-exporters/#timeline)) ?

## 6. Gouvernance (en particulier dans le secteur financier)

- L'application est-elle consignée et classée dans l'inventaire des IA ?
- Existe-t-il des tests de précision, de robustesse et de biais, ainsi qu'une surveillance des dérives (drift) ?
- Les résultats peuvent-ils être expliqués à la clientèle, à la société d'audit et à l'autorité de surveillance ?
- Les applications significatives font-elles l'objet d'un contrôle indépendant ?

## 7. Compétences et formation {#ai-literacy}

- Les personnes qui utilisent ou valident l'outil en savent-elles suffisamment sur l'IA, ses limites et ses risques ? Si votre entreprise entre dans le champ d'application de l'AI Act de l'UE, vous devez prendre des mesures pour favoriser cette **maîtrise de l'IA** (art. 4, dans sa version applicable à partir du 27 juillet 2026).
- Les formations et les rôles sont-ils clairement définis (métier, informatique, protection des données) ? Les établissements financiers assujettis tiennent également compte à cet égard des attentes de la FINMA concernant des formations à large échelle.
- Existe-t-il un modèle de référence pour ces formations ? Un exemple accessible librement est le [AI Fluency 4D-Framework](https://www.anthropic.com/ai-fluency) (Delegation, Description, Discernment, Diligence).

## 8. Règle de décision (feu tricolore simplifié)

| Feu | Situation type |
|---|---|
| Vert | Aucune donnée personnelle, ou hébergement en Suisse ou dans l'UE avec contrat de sous-traitance ; faible impact sur les personnes |
| Orange | Données personnelles avec communication à l'étranger ou décisions automatisées : validation uniquement avec des mesures d'accompagnement |
| Rouge | Données personnelles particulièrement sensibles sans concept de protection, utilisation à des fins d'entraînement incertaine, absence de contrat de sous-traitance ou absence de base légale pour la communication à l'étranger |

En cas d'orange ou de rouge : pas question d'« essayer puis régulariser plus tard ». Clarifiez d'abord les bases, puis lancez le projet pilote. Pour les établissements réglementés et les données sensibles, il est recommandé de faire appel à des spécialistes de la protection des données ou du droit.

## Pour aller plus loin

- [LPD révisée et IA : bases](/fr/ndsg-ai-basics/)
- [LLM hébergés aux États-Unis sous la LPD révisée](/fr/us-hosted-llms-ndsg/)
- [AI Act de l'UE : portée pour les entreprises suisses](/fr/eu-ai-act-swiss-exporters/)
- [Attentes de la FINMA en matière de gouvernance de l'IA](/fr/finma-ai-expectations/)
- [IA et cybersécurité : risques pour les PME](/fr/ai-security-risks/)
- [Modèle de directive IA (Word)](download:ai-policy-template)
