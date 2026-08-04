---
title: "Liste de contrôle : achat d'IA pour les PME suisses"
description: "Questions pratiques aux fournisseurs et en interne avant d'acheter un outil d'IA : protection des données, hébergement, contrats, gouvernance et lien avec l'UE."
last_verified: "2026-07-10"
volatility: "stable"
translation_status: "draft"
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

Cette liste de contrôle regroupe des questions issues des thèmes **LPD/IA**, **hébergement aux États-Unis**, **règlement sur l'IA de l'UE** et — le cas échéant — **gouvernance FINMA**. Elle est un outil d'achat et de due diligence, pas un conseil juridique ni une décision d'approbation.

Utilisez-la avant le pilote et à nouveau avant la mise en production.

## 1. Cas d'usage et données

- Quel problème métier l'outil résout-il — et quelles **données personnelles** y circulent ?
- Y a-t-il des données personnelles particulièrement sensibles, du profiling ou des décisions individuelles automatisées à effet notable ?
- Pouvez-vous démarrer le cas d'usage avec des données **synthétiques ou anonymisées** ?
- Qui est owner en interne (métier, IT, protection des données) ?

## 2. Protection des données et transparence (LPD)

- La finalité, le fonctionnement et les sources de données sont-ils **transparentement** explicables pour les personnes concernées ?
- Une **analyse d'impact relative à la protection des données personnelles** est-elle prévue en cas de risque élevé ?
- Les personnes concernées peuvent-elles s'opposer à un traitement automatique ou exiger un **contrôle humain** ?
- Existe-t-il un registre des activités de traitement à jour (y compris étranger et garanties) ?

## 3. Hébergement et transfert à l'étranger

- Dans quelles régions les données sont-elles stockées et traitées (CH / UE / US / autres) ?
- Pour les destinataires US : certification active **Swiss-U.S. Data Privacy Framework** vérifiée ?
- Sinon : **clauses type de protection des données** reconnues, DPA et examen du transfert présents ?
- Les saisies sont-elles utilisées pour l'**entraînement du modèle** — et existe-t-il un opt-out ?

## 4. Contrat et exploitation

- Contrat de sous-traitance (DPA) avec règles claires sur les sous-traitants ultérieurs ?
- Délais de suppression, export, notification d'incidents et droits d'audit réglés ?
- Disponibilité, lieu du support et liste des sous-processeurs connus ?
- Plan de sortie : pouvez-vous emporter données et configurations ?

## 5. Règlement sur l'IA de l'UE (si lien avec l'UE)

- Le système ou sa **sortie dans l'UE** est-il proposé ou utilisé ?
- Quel rôle avez-vous (fournisseur / déployeur / importateur / distributeur) ?
- Classe de risque estimée grossièrement (interdit / système d'IA à haut risque / transparence / modèle d'IA à usage général) ?
- Délais de l'applicabilité progressive attribués au produit ?

## 6. Gouvernance (surtout secteur financier)

- Entrée d'inventaire et classe de risque pour l'application ?
- Tests d'exactitude, de robustesse, de biais et monitoring du drift ?
- Explicabilité envers clients, audit et surveillance ?
- Examen indépendant pour les applications matérielles ?

## 7. Compétence et formation

- Les personnes qui utilisent ou approuvent l'outil ont-elles une **maîtrise de l'IA** suffisante (règlement (UE) 2024/1689 art. 4, en vigueur depuis le 2 février 2025) ?
- Formations et rôles sont-ils clairs (métier, IT, protection des données) — aussi au sens de l'attente FINMA de « broad training measures » pour les établissements assujettis ?
- Existe-t-il un modèle de compétence structuré pour le quotidien avec l'IA ? Un exemple librement licencié est le [cadre AI Fluency 4D](https://www.anthropic.com/ai-fluency) (Delegation, Description, Discernment, Diligence).

## 8. Règle de décision (pragmatique)

| Feu | Signification |
|---|---|
| Vert | Pas de données personnelles / hébergement CH ou UE avec contrat clair / impact faible |
| Jaune | Données personnelles + étranger ou décisions automatisées — approbation avec mesures |
| Rouge | Données particulièrement sensibles sans concept de protection, utilisation pour l'entraînement peu claire, DPA/base de transfert manquante |

Jaune et rouge : ne pas « essayer d'abord et ranger plus tard ». Clarifier d'abord les bases, puis pilote.

## Pour aller plus loin

- [LPD et IA : bases](/fr/ndsg-ai-basics/)
- [LLM hébergés aux États-Unis sous la LPD](/fr/us-hosted-llms-ndsg/)
- [Règlement sur l'IA de l'UE pour les entreprises suisses](/fr/eu-ai-act-swiss-exporters/)
- [Attentes de la FINMA en matière de gouvernance de l'IA](/fr/finma-ai-expectations/)

## Avertissement

Cette liste de contrôle est **informative et ne constitue pas un conseil juridique**. Pour les établissements réglementés et les catégories de données sensibles, associer les services spécialisés et, le cas échéant, un conseil juridique.
