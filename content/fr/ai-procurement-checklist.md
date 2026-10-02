---
title: "Check-list : acquisition d'outils d'IA pour les PME suisses"
description: "Questions pratiques à poser aux fournisseurs et en interne avant d'acquérir un outil d'IA : protection des données, hébergement, contrats, gouvernance et lien avec l'UE."
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
  - title: "FINMA Guidance 08/2024 (PDF)"
    url: "https://www.finma.ch/en/~/media/finma/dokumente/dokumentencenter/myfinma/4dokumentation/finma-aufsichtsmitteilungen/20241218-finma-aufsichtsmitteilung-08-2024.pdf"
  - title: "Anthropic – AI Fluency framework (4D)"
    url: "https://www.anthropic.com/ai-fluency"
---

Cette check-list rassemble des questions portant sur les thèmes **nLPD et IA**, **hébergement aux États-Unis**, **EU AI Act** et, le cas échéant, **gouvernance FINMA**. Il s'agit d'un outil d'acquisition et de due diligence, et non d'un conseil juridique ni d'une décision d'autorisation.

Utilisez-la avant le pilote, puis à nouveau avant la mise en production.

## 1. Cas d'usage et données

- Quel problème métier l'outil résout-il – et quelles **données personnelles** sont traitées ?
- Existe-t-il des données particulièrement sensibles, du profilage ou des décisions individuelles automatisées ayant un effet important ?
- Pouvez-vous démarrer le cas d'usage avec des données **synthétiques ou anonymisées** ?
- Qui est le responsable interne (métier, IT, protection des données) ?

## 2. Protection des données et transparence (LPD)

- La finalité, le fonctionnement et les sources de données peuvent-ils être expliqués de manière **transparente** aux personnes concernées ?
- Une **analyse d'impact relative à la protection des données personnelles** est-elle prévue en cas de risque élevé ?
- Les personnes concernées peuvent-elles s'opposer à un traitement automatisé ou exiger un **contrôle humain** ?
- Un **registre des activités de traitement** à jour existe-t-il (y compris transferts à l'étranger et garanties) ?

## 3. Hébergement et transfert à l'étranger {#hosting-transfer}

- Dans quelles régions les données sont-elles stockées et traitées (CH / UE / États-Unis / autres) ?
- Pour les destinataires américains : la certification active au **Swiss-U.S. Data Privacy Framework** a-t-elle été vérifiée ?
- Sinon : des **clauses type de protection des données** reconnues, un DPA et une analyse de transfert sont-ils en place ?
- Les saisies sont-elles utilisées pour l'**entraînement du modèle** – et existe-t-il une option de retrait (opt-out) ?

## 4. Contrat et exploitation {#contract-operations}

- Un contrat de sous-traitance (DPA) avec des règles claires en matière de sous-traitance ultérieure ?
- Les délais de suppression, l'export, la notification d'incidents et les droits d'audit sont-ils réglés ?
- La disponibilité, le lieu du support et la liste des sous-traitants ultérieurs sont-ils connus ?
- Plan de sortie : pouvez-vous emporter vos données et configurations ?

## 5. EU AI Act (en cas de lien avec l'UE) {#eu-ai-act}

- Le système ou son **résultat est-il proposé ou utilisé dans l'UE** ?
- Quel est votre rôle (fournisseur / déployeur / importateur / distributeur) ?
- La classe de risque a-t-elle été évaluée sommairement (interdit / haut risque / transparence / GPAI) ?
- Les délais d'application échelonnée ont-ils été associés au produit ?

## 6. Gouvernance (en particulier secteur financier)

- Entrée dans l'inventaire et classe de risque pour l'application ?
- Tests de précision, de robustesse, de biais et surveillance de la dérive (drift) ?
- Explicabilité à l'égard des clients, de l'audit et de la surveillance ?
- Une revue indépendante pour les applications significatives ?

## 7. Compétence et formation {#ai-literacy}

- Les personnes qui utilisent ou valident l'outil disposent-elles d'une **maîtrise de l'IA** suffisante (EU AI Act, art. 4, en vigueur depuis le 2 février 2025) ?
- Les formations et les rôles sont-ils clairement définis (métier, IT, protection des données) – également au sens des attentes de la FINMA en matière de « broad training measures » pour les établissements surveillés ?
- Existe-t-il un modèle de compétences structuré pour l'usage quotidien de l'IA ? Un exemple sous licence libre est le [cadre AI Fluency 4D](https://www.anthropic.com/ai-fluency) (Delegation, Description, Discernment, Diligence).

## 8. Règle de décision (pragmatique)

| Feu | Signification |
|---|---|
| Vert | Pas de données personnelles / hébergement en Suisse ou dans l'UE avec contrat clair / impact faible |
| Jaune | Données personnelles + étranger ou décisions automatisées – autorisation sous conditions |
| Rouge | Données particulièrement sensibles sans concept de protection, utilisation pour l'entraînement incertaine, absence de DPA/base de transfert |

Jaune et rouge : pas de principe « essayer puis régulariser plus tard ». Clarifiez d'abord les bases, puis lancez le pilote.

## Pour aller plus loin

- [nLPD et IA : les bases](/de/ndsg-ai-basics/)
- [LLM hébergés aux États-Unis sous la nLPD](/de/us-hosted-llms-ndsg/)
- [EU AI Act pour les entreprises suisses](/de/eu-ai-act-swiss-exporters/)
- [Attentes de la FINMA en matière de gouvernance de l'IA](/de/finma-ai-expectations/)
- [Modèle de directive IA (Word)](download:ai-policy-template)

## Remarque

Cette check-list est **informative et ne constitue pas un conseil juridique**. Pour les établissements réglementés et les catégories de données sensibles, consultez les services spécialisés et, le cas échéant, un conseil juridique.
