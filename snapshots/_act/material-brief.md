# Material source changes (2026-11)

Automated T17/T18 brief from the monthly source job. **Not legal advice.**
Review the diffs, update DE cornerstone prose and/or vendor table cells as needed, then merge.
Merging clears the lawyer review badge on affected DE pages (if set).

## Affected pages

- `ai-procurement-checklist` — sources: `edoeb-ki-und-datenschutz`
- `eu-ai-act-swiss-exporters` — sources: `consilium-digital-omnibus-ai`
- `ndsg-ai-basics` — sources: `edoeb-ki-und-datenschutz`
- `us-hosted-llms-ndsg` — sources: `dpf-participant-list`

## Vendor table

Material vendor sources triggered structured field extraction into `data/vendors.json`.
Review proposed claim cells before merge. Identity fields (`id` / `name` / `website`) are never auto-changed.

- `anthropic`
  - sources: `anthropic-certifications`, `anthropic-regional-compliance`
  - fields changed: (no claim fields changed)
  - extract error: 401 {"type":"error","error":{"type":"authentication_error","message":"invalid x-api-key"},"request_id":"req_011CgcEM8x2pVPvYJXW2vgm9"}
  - extract rationale: Parse/API failure; no field patches applied: 401 {"type":"error","error":{"type":"authentication_error","message":"invalid x-api-key"},"request_id":"req_011CgcEM8x2pVPvYJXW2vgm9"}
- `aws-bedrock`
  - sources: `aws-bedrock-security`
  - fields changed: (no claim fields changed)
  - extract error: 401 {"type":"error","error":{"type":"authentication_error","message":"invalid x-api-key"},"request_id":"req_011CgcEMB52xtwjntSMuAo32"}
  - extract rationale: Parse/API failure; no field patches applied: 401 {"type":"error","error":{"type":"authentication_error","message":"invalid x-api-key"},"request_id":"req_011CgcEMB52xtwjntSMuAo32"}
- `cohere`
  - sources: `cohere-enterprise-data`, `cohere-trust`
  - fields changed: (no claim fields changed)
  - extract error: 401 {"type":"error","error":{"type":"authentication_error","message":"invalid x-api-key"},"request_id":"req_011CgcEMDEzptu117Wuk7NEo"}
  - extract rationale: Parse/API failure; no field patches applied: 401 {"type":"error","error":{"type":"authentication_error","message":"invalid x-api-key"},"request_id":"req_011CgcEMDEzptu117Wuk7NEo"}
- `deepl`
  - sources: `deepl-infrastructure`, `deepl-pro-security`
  - fields changed: (no claim fields changed)
  - extract error: 401 {"type":"error","error":{"type":"authentication_error","message":"invalid x-api-key"},"request_id":"req_011CgcEMFNz8o9Ck3YMnTt1X"}
  - extract rationale: Parse/API failure; no field patches applied: 401 {"type":"error","error":{"type":"authentication_error","message":"invalid x-api-key"},"request_id":"req_011CgcEMFNz8o9Ck3YMnTt1X"}
- `exoscale`
  - sources: `exoscale-ai`, `exoscale-compliance`
  - fields changed: (no claim fields changed)
  - extract error: 401 {"type":"error","error":{"type":"authentication_error","message":"invalid x-api-key"},"request_id":"req_011CgcEMHVyezUpWc8LFMpKW"}
  - extract rationale: Parse/API failure; no field patches applied: 401 {"type":"error","error":{"type":"authentication_error","message":"invalid x-api-key"},"request_id":"req_011CgcEMHVyezUpWc8LFMpKW"}
- `google-cloud`
  - sources: `google-cloud-dpa`, `google-cloud-ml-locations`
  - fields changed: (no claim fields changed)
  - extract error: 401 {"type":"error","error":{"type":"authentication_error","message":"invalid x-api-key"},"request_id":"req_011CgcEMKeE5GB8JF3yyJXHN"}
  - extract rationale: Parse/API failure; no field patches applied: 401 {"type":"error","error":{"type":"authentication_error","message":"invalid x-api-key"},"request_id":"req_011CgcEMKeE5GB8JF3yyJXHN"}
- `huggingface`
  - sources: `huggingface-security`
  - fields changed: (no claim fields changed)
  - extract error: 401 {"type":"error","error":{"type":"authentication_error","message":"invalid x-api-key"},"request_id":"req_011CgcEMMkiMQcQX68bbDgfK"}
  - extract rationale: Parse/API failure; no field patches applied: 401 {"type":"error","error":{"type":"authentication_error","message":"invalid x-api-key"},"request_id":"req_011CgcEMMkiMQcQX68bbDgfK"}
- `ibm-watsonx`
  - sources: `ibm-watsonx-home`
  - fields changed: (no claim fields changed)
  - extract error: 401 {"type":"error","error":{"type":"authentication_error","message":"invalid x-api-key"},"request_id":"req_011CgcEMPsDGPj5CC2jowCJQ"}
  - extract rationale: Parse/API failure; no field patches applied: 401 {"type":"error","error":{"type":"authentication_error","message":"invalid x-api-key"},"request_id":"req_011CgcEMPsDGPj5CC2jowCJQ"}
- `infomaniak`
  - sources: `infomaniak-trust`
  - fields changed: (no claim fields changed)
  - extract error: 401 {"type":"error","error":{"type":"authentication_error","message":"invalid x-api-key"},"request_id":"req_011CgcEMRziUfXnSv2ewb7KD"}
  - extract rationale: Parse/API failure; no field patches applied: 401 {"type":"error","error":{"type":"authentication_error","message":"invalid x-api-key"},"request_id":"req_011CgcEMRziUfXnSv2ewb7KD"}
- `microsoft-azure`
  - sources: `microsoft-dpa`
  - fields changed: (no claim fields changed)
  - extract error: 401 {"type":"error","error":{"type":"authentication_error","message":"invalid x-api-key"},"request_id":"req_011CgcEMU9w7E251u5gsk7Q3"}
  - extract rationale: Parse/API failure; no field patches applied: 401 {"type":"error","error":{"type":"authentication_error","message":"invalid x-api-key"},"request_id":"req_011CgcEMU9w7E251u5gsk7Q3"}
- `mistral`
  - sources: `mistral-home`
  - fields changed: (no claim fields changed)
  - extract error: 401 {"type":"error","error":{"type":"authentication_error","message":"invalid x-api-key"},"request_id":"req_011CgcEMWHgNdNDz8jxNt9YT"}
  - extract rationale: Parse/API failure; no field patches applied: 401 {"type":"error","error":{"type":"authentication_error","message":"invalid x-api-key"},"request_id":"req_011CgcEMWHgNdNDz8jxNt9YT"}
- `openai`
  - sources: `openai-business-data`, `openai-dpa`
  - fields changed: (no claim fields changed)
  - extract error: 401 {"type":"error","error":{"type":"authentication_error","message":"invalid x-api-key"},"request_id":"req_011CgcEMYXNGy5WSdnC65brD"}
  - extract rationale: Parse/API failure; no field patches applied: 401 {"type":"error","error":{"type":"authentication_error","message":"invalid x-api-key"},"request_id":"req_011CgcEMYXNGy5WSdnC65brD"}
- `ovhcloud`
  - sources: `ovhcloud-ai-endpoints`
  - fields changed: (no claim fields changed)
  - extract error: 401 {"type":"error","error":{"type":"authentication_error","message":"invalid x-api-key"},"request_id":"req_011CgcEMafcMJhxwrKapW2XR"}
  - extract rationale: Parse/API failure; no field patches applied: 401 {"type":"error","error":{"type":"authentication_error","message":"invalid x-api-key"},"request_id":"req_011CgcEMafcMJhxwrKapW2XR"}

## Per-source classifications

### `edoeb-ki-und-datenschutz`

- **Confidence:** low
- **Dependent pages:** `ndsg-ai-basics`, `ai-procurement-checklist`
- **Rationale:** Parse/API failure; fail-safe to material: 401 {"type":"error","error":{"type":"authentication_error","message":"invalid x-api-key"},"request_id":"req_011CgcEL5PSmUwFi9Cggjz3D"}
- **Patch:** `snapshots/_diffs/edoeb-ki-und-datenschutz.patch`

```diff
Index: snapshots/edoeb-ki-und-datenschutz.txt
===================================================================
--- snapshots/edoeb-ki-und-datenschutz.txt
+++ snapshots/edoeb-ki-und-datenschutz.txt
@@ -1,1 +1,1 @@
-Zum Hauptinhalt springenAlle Schweizer BundesbehördenSprach Dropdown Deutsch ausgewähltDEFRITENEidgenössischer Datenschutz- und Öffentlichkeitsbeauftragter  (EDÖB) Eidgenössischer Datenschutz- und Öffentlichkeitsbeauftragter (EDÖB) Eidgenössischer Datenschutz- und Öffentlichkeitsbeauftragter  (EDÖB) SucheSucheFAQMeldeportaleKontaktVeröffentlicht am 24. September 2025KI und DatenschutzKünstliche Intelligenz durchdringt auch in der Schweiz in rasch zunehmendem Ausmass das Leben der Bevölkerung. Der EDÖB weist darauf hin, dass das Schweizer Datenschutzgesetz (DSG) auf KI-gestützte Datenbearbeitungen direkt anwendbar ist.Das Datenschutzgesetz des Bundes (DSG) ist technologieneutral formuliert und demzufolge auch auf den Einsatz von KI-gestützten Datenbearbeitungen direkt anwendbar, weshalb der EDÖB die Hersteller, Anbieter und Verwender entsprechender Applikationen auf die gesetzliche Pflicht hinweist, bereits bei der Entwicklung neuer Technologien und bei der Planung ihres Einsatzes sicherzustellen, dass die betroffenen Personen über ein möglichst hohes Mass an informationeller Selbstbestimmung und Privatsphäre verfügen.Transparente Information Angesichts des durch das DSG definierten Rechtsrahmens müssen Hersteller, Anbieter und Verwender von KI-Systemen den Zweck, die Funktionsweise und die Datenquellen der auf KI beruhenden Datenbearbeitungen transparent ausweisen. Das gesetzliche Recht der betroffenen Personen auf Transparenz ist eng verbunden mit deren Anspruch, einer automatischen Datenbearbeitung zu widersprechen oder zu verlangen, dass automatisierte Einzelentscheidungen von einem Menschen überprüft werden.Beim Einsatz intelligenter Sprachmodelle, die direkt mit Benutzerinnen und Benutzern kommunizieren, haben Letztere das Recht zu erfahren, ob und inwieweit sie mit einer Maschine korrespondieren und ob die von ihnen eingegebenen Daten zur Verbesserung der selbstlernenden Programme oder zu weiteren Zwecken weiterverwendet werden. Auch die Verwendung von Programmen, welche die Verfälschung von Gesichtern, Bildern oder Sprachnachrichten von identifizierbaren Personen ermöglichen, muss stets deutlich erkennbar sein – soweit sie sich im konkreten Fall nicht ohnehin aufgrund strafrechtlicher Verbote als gänzlich unrechtmässig erweist.Schutz der GrundrechteKI-gestützte Datenbearbeitungen mit hohen Risiken sind datenschutzrechtlich dem Grundsatz nach zulässig, erfordern aber angemessene Massnahmen zum Schutz der potenziell betroffenen Personen. Darum verlangt das DSG bei hohen Risiken eine sog. «Datenschutz-Folgenabschätzung». Anwendungen, die auf eine Aushöhlung der vom DSG geschützten Privatsphäre und informationellen Selbstbestimmung abzielen, sind datenschutzrechtlich verboten. Gemeint sind insbesondere KI-basierte Datenbearbeitungen, die in autoritär regierten Staaten zu beobachten sind, wie die flächendeckende Gesichtserkennung in Echtzeit oder die umfassende Observation und Bewertung der Lebensführung, das sog. «Social Scoring».Siehe auch:Künstliche Intelligenz (KI) im Alltag - Konkrete BeispieleKünstliche Intelligenz (KI) durchdringt sämtliche Lebensbereiche: Sie kann Fachbeiträge oder persönliche Briefe schreiben, Bewerbungsdossiers erstellen und auswerten, Gesundheitsdaten überwachen und die Zufuhr von Medikamenten steuern, die Liebe fürs Leben finden – oder gar ersetzen.Mehr über «Künstliche Intelligenz (KI) im Alltag - Konkrete Beispiele»Meldungen zum Thema KIMitteilung8. Mai 2025Update - Geltendes Datenschutzgesetz ist auf KI direkt anwendbarKünstliche Intelligenz (KI) durchdringt auch in der Schweiz das wirtschaftliche und soziale Leben der Bevölkerung. Der EDÖB weist deshalb darauf hin, dass das seit dem 1. September 2023 geltende Datenschutzgesetz des Bundes auf KI-gestützte Datenbearbeitungen direkt

… truncated …
```

### `dpf-participant-list`

- **Confidence:** low
- **Dependent pages:** `us-hosted-llms-ndsg`
- **Rationale:** Parse/API failure; fail-safe to material: 401 {"type":"error","error":{"type":"authentication_error","message":"invalid x-api-key"},"request_id":"req_011CgcEL7VwtfDBsQzm56UZp"}
- **Patch:** `snapshots/_diffs/dpf-participant-list.patch`

```diff
Index: snapshots/dpf-participant-list.txt
===================================================================
--- snapshots/dpf-participant-list.txt
+++ snapshots/dpf-participant-list.txt
@@ -189,9 +189,9 @@
 Latest News
 
 Press Release
-FTC, States Win Protections to Lower Pesticide Prices for American Farmers in Antitrust Case Against Corteva
+FTC Staff Warn Marketers of Healthcare Plans and Lead Generators Not to Deceive Consumers about the Terms of the Advertised Plans
 
-September 28, 2026
+October 29, 2026
 
 View News and Events
 
@@ -409,32 +409,6 @@
 
 Privacy and Security
 
-Privacy and Security Menu
-
-Privacy and Security
-
-Children's Privacy
-
-Health Privacy
-
-Consumer Privacy
-
-Credit Reporting
-
-Data Security
-
-Gramm-Leach-Bliley Act
-
-Red Flags Rule
-
-Data Privacy Framework
-
-Privacy Shield
-
-U.S.-EU Safe Harbor Framework
-
-Tech
-
 If you work for a business looking to transfer data between the EU and the United States, the FTC has resources to point you in the right direction. On July 17, 2023, the European Commission issued an adequacy decision on the EU-U.S. Data Privacy Framework (DPF). This new voluntary Framework, which replaces the Privacy Shield program, provides a mechanism for companies to transfer personal data from the EU to the United States in a privacy-protective way consistent with EU law. To join the Data Privacy Framework, a company must self-certify to the Department of Commerce that it complies with the Data Privacy Framework Principles. A participating company’s failure to comply with the Principles may violate Section 5 of the FTC Act’s prohibition on unfair and deceptive acts. The FTC is committed to vigorous enforcement of the DPF Principles, and works with privacy authorities in the EU to protect consumer privacy on both sides of the Atlantic. For more information, including how to join, visit the Data Privacy Framework Program. The Data Privacy Framework site also features a searchable list of participating businesses.
 
 Plain Language Guidance
@@ -575,6 +549,8 @@
 Cases
 Google, Inc., In the Matter of
 Cases
+ExpatEdge Partners, LL
+Cases
 Onyx Graphics, Inc.
 Cases
 World Innovators, Inc., In the Matter of
@@ -585,8 +561,6 @@
 Cases
 Collectify LL
 Cases
-ExpatEdge Partners, LL
-Cases
 Best Priced Brands, LLC, et al.
 Federal Register Notices
```

### `consilium-digital-omnibus-ai`

- **Confidence:** low
- **Dependent pages:** `eu-ai-act-swiss-exporters`
- **Rationale:** Parse/API failure; fail-safe to material: 401 {"type":"error","error":{"type":"authentication_error","message":"invalid x-api-key"},"request_id":"req_011CgcEL9ZU1B1KGHFEoaKPi"}
- **Patch:** `snapshots/_diffs/consilium-digital-omnibus-ai.patch`

```diff
Index: snapshots/consilium-digital-omnibus-ai.txt
===================================================================
--- snapshots/consilium-digital-omnibus-ai.txt
+++ snapshots/consilium-digital-omnibus-ai.txt
@@ -172,28 +172,28 @@
 
 VOSS Axel (EPP)
 
-VIGENIN Kristian (S&D)
-
 BENIFEI Brando (S&D)
 
-JORON Virginie (PfE)
+VIGENIN Kristian (S&D)
 
 BŽOCH Jaroslav (PfE)
 
-KANKO Assita (ECR)
+JORON Virginie (PfE)
 
 MÜLLER Piotr (ECR)
 
+KANKO Assita (ECR)
+
 HAHN Svenja (Renew)
 
 VAN SPARRENTAK Kim (Greens/EFA)
 
 GREGOROVÁ Markéta (Greens/EFA)
 
-CHAIBI Leila (The Left)
-
 BARRENA ARZA Pernando (The Left)
 
+CHAIBI Leila (The Left)
+
 KHAN Mary (ESN)
 
 Committee for opinion
@@ -845,6 +845,8 @@
 
 OJ OJ L 24.07.2026
 
+Summary
+
 Procedure file
 
 Basic information
```

### `openai-business-data`

- **Confidence:** low
- **Dependent pages:** (none)
- **Rationale:** Parse/API failure; fail-safe to material: 401 {"type":"error","error":{"type":"authentication_error","message":"invalid x-api-key"},"request_id":"req_011CgcELBdVBY4BK1MDfekrz"}
- **Patch:** `snapshots/_diffs/openai-business-data.patch`

```diff
Index: snapshots/openai-business-data.txt
===================================================================
--- snapshots/openai-business-data.txt
+++ snapshots/openai-business-data.txt
@@ -1,1 +1,1 @@
-Skip to main contentResearchProductsBusinessDevelopersCompanyFoundation(opens in a new window)Log inTry ChatGPT(opens in a new window)ResearchProductsBusinessDevelopersCompanyFoundation(opens in a new window)Try ChatGPT(opens in a new window)LoginOpenAISafetyBusiness data privacy, security, and complianceTrust, security, and privacy are at the core of our mission at OpenAI. Your organization’s data always remains confidential, secure, and entirely owned by you—across ChatGPT Enterprise, ChatGPT Business, ChatGPT Edu, ChatGPT for Healthcare, ChatGPT for Teachers, and our API platform.OpenAI Trust Portal(opens in a new window)Enterprise privacy commitmentsOpenAI is trusted byOpenAI security and privacyWe don’t train our models on your organization’s data by default.By default, we do not use data from ChatGPT Enterprise, ChatGPT Business, ChatGPT Edu, ChatGPT for Healthcare, ChatGPT for Teachers, or our API platform—including inputs or outputs—for training or improving our models. Our models are trained on publicly available knowledge on the Internet, data provided through third-party partnerships, and information that our researchers provide or generate. If you are interested in helping us improve our models, you can do so through explicit opt-in⁠⁠⁠(opens in a new window) in the API dashboard.Learn how ChatGPT and our models are developed ↗ ⁠(opens in a new window)Your data is encrypted at rest and in transit between you and OpenAI, and between OpenAI and its service providers.Whether you’re sending inputs or receiving outputs, your business data remains protected from unauthorized access. We use strong, industry-standard cryptography to protect your data. This includes using AES-256 encryption at rest and TLS 1.2 or higher in transit.With Enterprise Key Management (EKM)⁠(opens in a new window), customers can control their own encryption keys, adding another layer of security and compliance.We offer data retention controls for qualifying organizations to help you stay compliant.Qualifying organizations are able to configure how long OpenAI retains business data, including opting for our zero data retention policy in the API platform.Learn more⁠⁠ about our data retention policies for ChatGPT Enterprise, Business, Edu, ChatGPT for Healthcare, and the API platform⁠⁠(opens in a new window).We build security into our products and infrastructure. Security starts at design. We embrace zero trust and defense in-depth approaches to guide our overall security program. Our software development lifecycle ensures we design and architect security into our products from inception, and we appropriately address risks to our supply chain. We implement layered security controls across our endpoints, infrastructure, networks, and applications. We also invest heavily in research and security for next-generation technologies, such as agents.We protect your data with thorough testing and monitoring.Our OpenAI security team has an on-call rotation 24/7 365 days of the year in case of potential security incidents, with automated alerts and manual investigation processes in place to address suspicious activity. OpenAI’s infrastructure undergoes regular audits, including red team and adversarial assessments, by independent third parties to ensure adherence to the highest security standards.Compliance and governanceWe adhere to industry standards and regulatory compliance requirements.OpenAI’s data protection practices support your compliance with GDPR, CCPA, and other privacy laws, and align with CSA STAR⁠⁠(opens in a new window), SOC 2 Type 2 Trust Services Criteria⁠⁠(opens in a new window), and ISO/IEC 27001⁠(opens in a new window), 27017⁠(opens in a new window), 27018⁠(opens in a new window), 27701⁠(opens in a new window) certifications. We offer a Bu

… truncated …
```

### `openai-dpa`

- **Confidence:** low
- **Dependent pages:** (none)
- **Rationale:** Parse/API failure; fail-safe to material: 401 {"type":"error","error":{"type":"authentication_error","message":"invalid x-api-key"},"request_id":"req_011CgcELDgmFRhykVCnk3RZT"}
- **Patch:** `snapshots/_diffs/openai-dpa.patch`

```diff
Index: snapshots/openai-dpa.txt
===================================================================
--- snapshots/openai-dpa.txt
+++ snapshots/openai-dpa.txt
@@ -1,1 +1,1 @@
-Skip to main contentResearchProductsBusinessDevelopersCompanyFoundation(opens in a new window)Log inTry ChatGPT(opens in a new window)ResearchProductsBusinessDevelopersCompanyFoundation(opens in a new window)Try ChatGPT(opens in a new window)LoginOpenAISelect language…Updated: December 1, 2025OpenAI Data Processing AddendumDownload PDF(opens in a new window)Effective: January 1, 2026(View previous data processing addendum)This OpenAI Data Processing Addendum (“DPA”) supplements, and is incorporated into, the OpenAI Services Agreement (“Agreement”) governing use of the Services and is entered as of the Effective Date between the customer identified above (“Customer”) and OpenAI OpCo, LLC, on its behalf and on behalf of its Affiliates, as appropriate, unless Customer is based within a European Economic Area country or Switzerland, in which case it is entered into with OpenAI Ireland Ltd., on its behalf and on behalf of its Affiliates, as appropriate (“OpenAI”). Capitalized terms not defined in the DPA have the meanings provided in the Agreement. In this DPA, OpenAI and Customer are each referred to as a “Party” and collectively as the “Parties.” Customer represents it is lawfully able to enter into this Agreement and, if it is entering into the Agreement for an entity, that it has legal authority to bind that entity. By clicking “I agree,” accepting the Order Form, or using the Services, Customer agrees to this Agreement.1. Details.1.1 Scope and Roles. As part of providing the Services to the Customer under the Agreement, OpenAI may Process Customer Data on behalf of Customer. OpenAI acts as a Data Processor on the Customer’s behalf, and this DPA governs such Processing.1.2 Details of Processing. OpenAI will only Process Customer Data for the purposes of delivering the Services to Customer pursuant to the Agreement and this DPA. Details regarding the nature, duration, as well as the types of Customer Data and categories of Data Subjects involved, are set out in Schedule 1 (Details of Processing) to this DPA. OpenAI and Customer each agree to comply with their respective obligations under Data Protection Laws in connection with the Services.2. OpenAI Obligations.2.1 Customer Instructions. The Parties agree that this DPA, the Agreement (including the Order Form), and any instructions provided via the configuration tools and other tools within the Services made available by OpenAI within the Services, constitute Customer’s documented instructions regarding OpenAI’s processing of Customer Data (“Customer Instructions”). OpenAI will process Customer Data only in accordance with Customer Instructions, unless required to do so by applicable law to which OpenAI is subject, in which case OpenAI will inform Customer of this requirement prior to processing unless legally prohibited from doing so.2.2 Notices to Customer. OpenAI will promptly inform Customer in writing if, in OpenAI’s opinion, a Customer Instruction violates Data Protection Laws. OpenAI will, to the extent legally permitted, inform Customer if OpenAI receives a legally binding request for disclosure of Customer Data by a law enforcement authority.2.3 Confidentiality. OpenAI will ensure that all persons authorized by OpenAI to process Customer Data have committed themselves to confidentiality or are under an appropriate statutory obligation of confidentiality.2.4 Data Subject Requests. OpenAI will, to the extent legally permitted, inform Customer if OpenAI receives a request to exercise data subject rights pursuant to Data Protection Laws (“Data Subject Request”) in respect of Customer Data.  OpenAI will not respond to any such request without Customer’s prior written authorization, except that Customer authorizes OpenAI to redirect Data Subject Requests as necessary to allow Customer to respond directly

… truncated …
```

### `anthropic-regional-compliance`

- **Confidence:** low
- **Dependent pages:** (none)
- **Rationale:** Parse/API failure; fail-safe to material: 401 {"type":"error","error":{"type":"authentication_error","message":"invalid x-api-key"},"request_id":"req_011CgcELFn1tKHuSbTb6zpTJ"}
- **Patch:** `snapshots/_diffs/anthropic-regional-compliance.patch`

```diff
Index: snapshots/anthropic-regional-compliance.txt
===================================================================
--- snapshots/anthropic-regional-compliance.txt
+++ snapshots/anthropic-regional-compliance.txt
@@ -1,30 +1,3 @@
-ProductProductsClaudeClaude Code@ClaudeSpecializedClaude SecurityClaude ScienceCapabilitiesArtifactsDesignConnectorsPluginsSkillsClaude apps built forClaude in ChromeClaude for Microsoft 365ModelsMythosFableOpusSonnetHaikuImport to ClaudeDownload appsDownload appsDownload appsLoginLoginLoginDevelopersBuild withClaude CodeClaude PlatformFor developersClaude AcademyCommunityDeveloper blogDeveloper docsDeveloper docsDeveloper docsConsoleConsoleConsoleEnterpriseEnterpriseOverviewClaude Code for EnterpriseClaude PlatformUse casesAI agentsCodingCommerceDepartmentsCustomer supportCybersecurityLegalSalesIndustriesFinancial servicesGovernmentHealthcareHigher educationK-12 teachersLife sciencesNonprofitsBrowse marketplaceCustomer storiesCustomer storiesCustomer storiesContact salesContact salesContact salesResourcesInsightsBlogCustomer storiesMarketplaceAnthropic newsLearnClaude AcademyCoursesTutorialsUse casesConnectEventsCommunityPricingOverviewAPILoginContact salesContact salesContact salesTry ClaudeTry ClaudeTry ClaudeContact salesContact salesContact salesTry ClaudeTry ClaudeTry ClaudeContact salesContact salesContact salesTry ClaudeTry ClaudeTry ClaudeContact salesContact salesContact salesTry ClaudeTry ClaudeTry ClaudeProductProductsClaudeClaude Code@ClaudeSpecializedClaude SecurityClaude ScienceCapabilitiesArtifactsDesignConnectorsPluginsSkillsClaude apps built forClaude in ChromeClaude for Microsoft 365ModelsMythosFableOpusSonnetHaikuImport to ClaudeDownload appsDownload appsDownload appsLoginLoginLoginDevelopersBuild withClaude CodeClaude PlatformFor developersClaude AcademyCommunityDeveloper blogDeveloper docsDeveloper docsDeveloper docsConsoleConsoleConsoleEnterpriseEnterpriseOverviewClaude Code for EnterpriseClaude PlatformUse casesAI agentsCodingCommerceDepartmentsCustomer supportCybersecurityLegalSalesIndustriesFinancial servicesGovernmentHealthcareHigher educationK-12 teachersLife sciencesNonprofitsBrowse marketplaceCustomer storiesCustomer storiesCustomer storiesContact salesContact salesContact salesResourcesInsightsBlogCustomer storiesMarketplaceAnthropic newsLearnClaude AcademyCoursesTutorialsUse casesConnectEventsCommunityPricingOverviewAPILoginContact salesContact salesContact salesTry ClaudeTry ClaudeTry ClaudeContact salesContact salesContact salesTry ClaudeTry ClaudeTry ClaudePlatformPlatform/Regional complianceExplore hereAsk questions about this pageCopy as markdownDeploy Claude confidently, wherever you areClaude is available globally with regional data residency and inference, comprehensive compliance certifications, and deployment across all major cloud platforms.Contact salesContact salesContact salesVisit Trust CenterVisit Trust CenterVisit Trust CenterBuilt for regulated industries, worldwideTrusted  complianceOrganizations in highly regulated industries trust Claude to handle their most sensitive work while meeting strict regional compliance requirements.Flexible deploymentWhether you're a startup navigating your first audit or a Fortune 500 company with global operations, Claude’s deployment options meet you where you are.Safety-firstAnthropic's safety-first approach to AI extends to how we protect and process your data, from technical deployment to operational practices.Flexible deployment, data storage, and inference processingMeet your regional data residency and compliance requirements with Claude. Choose where your data is stored and processed. Available on AWS Bedrock, GCP Vertex, and Microsoft Foundry.Claude’s regional availabilityRegionAWS BedrockSpecificationsGCP VertexSpecificationsMicrosoft FoundrySpecificationsAsia-PacificAWS BedrockSpecificationsGCP VertexSpecificationsMicrosoft FoundrySpecificationsCanadaAWS BedrockSpecificationsGCP VertexSpecificationsMicroso

… truncated …
```

### `anthropic-certifications`

- **Confidence:** low
- **Dependent pages:** (none)
- **Rationale:** Parse/API failure; fail-safe to material: 401 {"type":"error","error":{"type":"authentication_error","message":"invalid x-api-key"},"request_id":"req_011CgcELHq3wWHybzqDVKJko"}
- **Patch:** `snapshots/_diffs/anthropic-certifications.patch`

```diff
Index: snapshots/anthropic-certifications.txt
===================================================================
--- snapshots/anthropic-certifications.txt
+++ snapshots/anthropic-certifications.txt
@@ -1,1 +1,1 @@
-Skip to main contentAPI DocsRelease NotesContact SupportEnglishFrançaisDeutschBahasa IndonesiaItaliano日本語한국어PortuguêsPусский简体中文Español繁體中文EnglishAPI DocsRelease NotesContact SupportEnglishFrançaisDeutschBahasa IndonesiaItaliano日本語한국어PortuguêsPусский简体中文Español繁體中文EnglishSearch for articles...All CollectionsCommercial Customers Compliance Controls & CertificationsWhat Certifications has Anthropic obtained?What Certifications has Anthropic obtained? March 16, 2026This article is about our commercial products such as Claude for Work and the Anthropic API. For our consumer products such as Claude Free, Pro, Max and when accounts from those plans use Claude Code, see here. Anthropic is committed to the safety and security of our users' information and maintains the following compliance credentials:HIPAA-ready configuration (BAA available)ISO 27001:2022 (Information Security Management)ISO/IEC 42001:2023 (AI Management Systems)SOC 2 Type I & Type IIFor more information and to request copies of our compliance documentation, please visit our Trust Portal.Related ArticlesBusiness Associate Agreements (BAA) for Commercial CustomersI have a zero data retention agreement with Anthropic. What products does it apply to?What Cookies Does Anthropic Use?How does Anthropic protect the personal data of Claude users?Anthropic Interviewer sessions completed in December 2025Did this answer your question?Disappointed Reaction😞Neutral Reaction😐Smiley Reaction😃ProductResearchCompanyNewsCareersTerms of Service - ConsumerTerms of Service - CommercialPrivacy PolicyUsage PolicyResponsible Disclosure PolicyCompliance
+Skip to main contentAPI DocsRelease NotesContact SupportEnglishFrançaisDeutschBahasa IndonesiaItaliano日本語한국어PortuguêsPусский简体中文Español繁體中文EnglishAPI DocsRelease NotesContact SupportEnglishFrançaisDeutschBahasa IndonesiaItaliano日本語한국어PortuguêsPусский简体中文Español繁體中文EnglishSearch for articles...All CollectionsCommercial Customers Compliance Controls & CertificationsWhat Certifications has Anthropic obtained?What Certifications has Anthropic obtained? Updated yesterdayThis article is about our commercial products such as Claude for Work and the Anthropic API. For our consumer products such as Claude Free, Pro, Max, Ultra, and when accounts from those plans use Claude Code, see here. Anthropic is committed to the safety and security of our users' information and maintains the following compliance credentials:HIPAA-ready configuration (BAA available)ISO 27001:2022 (Information Security Management)ISO/IEC 42001:2023 (AI Management Systems)SOC 2 Type I & Type IIFor more information and to request copies of our compliance documentation, please visit our Trust Portal.Related ArticlesBusiness Associate Agreements (BAA) for Commercial CustomersI have a zero data retention agreement with Anthropic. What products does it apply to?Does Anthropic Act as a Data Processor or Controller?What is Anthropic’s policy for handling governmental requests for user information?Did this answer your question?Disappointed Reaction😞Neutral Reaction😐Smiley Reaction😃ProductResearchCompanyNewsCareersTerms of Service - ConsumerTerms of Service - CommercialPrivacy PolicyUsage PolicyResponsible Disclosure PolicyCompliance
```

### `google-cloud-dpa`

- **Confidence:** low
- **Dependent pages:** (none)
- **Rationale:** Parse/API failure; fail-safe to material: 401 {"type":"error","error":{"type":"authentication_error","message":"invalid x-api-key"},"request_id":"req_011CgcELKvJw8X8gqYvGbaaR"}
- **Patch:** `snapshots/_diffs/google-cloud-dpa.patch`

```diff
Index: snapshots/google-cloud-dpa.txt
===================================================================
--- snapshots/google-cloud-dpa.txt
+++ snapshots/google-cloud-dpa.txt
@@ -124,53 +124,65 @@
 
 Application Modernization
 
-Assess, plan, implement, and measure software practices and capabilities to modernize and simplify your organization’s business application portfolios.
+Modernize, automate, and scale your application and data portfolio using enterprise AI, intelligent engineering practices, and cloud-native infrastructure.
 
-CAMP
+Google Cloud Modernize
 
-Program that uses DORA to improve your software delivery capabilities.
+Unified program and AI-powered tools for end-to-end cloud migration and modernization.
 
-Modernize Traditional Applications
+Application Modernization with AI
 
-Analyze, categorize, and get started with cloud migration on traditional workloads.
+AI-assisted code refactoring, assessment, and transformation for legacy applications.
 
-Migrate from PaaS: Cloud Foundry, Openshift
+Gemini for business
 
-Tools for moving your existing containers into Google's managed container services.
+Enterprise-ready generative AI and agents to accelerate innovation across your organization.
 
-Migrate from Mainframe
+AI Hypercomputer
 
-Automated tools and prescriptive guidance for moving your mainframe apps to the cloud.
+Integrated supercomputing architecture to train, tune, and serve AI workloads.
 
-Modernize Software Delivery
+Mainframe Modernization
 
-Software supply chain best practices - innerloop productivity, CI/CD and S3C.
+Automated tools and AI-driven guidance for moving your mainframe apps to the cloud.
 
-DevOps Best Practices
+Database Modernization
 
-Processes and resources for implementing DevOps in your org.
+Fully managed database services to migrate, manage, and modernize enterprise data.
 
-SRE Principles
+Data Lake Modernization
 
-Tools and resources for adopting SRE in your org.
+Unify and govern multimodal data on an open, high-performance cloud data lake.
 
-Platform Engineering
+Data Warehouse Modernization
 
-Comprehensive suite of managed services and Golden Paths to build, manage, and scale IDPs.
+Migrate and modernize your enterprise data warehouse for serverless analytics and AI.
 
-Architect for Multicloud
+APIs
 
-Manage workloads across multiple clouds with a consistent platform.
+Unlock legacy applications and build new digital channels using APIs and automation.
 
+Platform Eng
+
+Managed services and golden paths to build, manage, and scale internal developer platforms.
+
+DevOps Best Practices
+
+Processes and resources for implementing DevOps in your org.
+
+SRE Principles
+
+Tools and resources for adopting SRE in your org.
+
 Artificial Intelligence
 
 Add intelligence and efficiency to your business with AI and machine learning.
 
-Gemini Enterprise for Customer Experience
+Gemini for customer experience
 
 Build and manage agents that live across the entire customer lifecycle.
 
-Gemini Enterprise
+Gemini for enterprise
 
 Unified agentic portfolio for your entire organization.
 
@@ -278,57 +290,57 @@
 
 Supercharge database development and management with AI.
 
-Infrastructure
+Infrastructure Modernization
 
-Migrate quickly with solutions for SAP, VMware, Windows, Oracle, and other workloads.
+Migrate core systems rapidly and modernize enterprise workloads with AI-powered infrastructure and automated cloud solutions.
 
-Application Migration
+Google Cloud Modernize
 
-Discovery and analysis tools for moving to the cloud.
+Unified program and AI-powered tools for end-to-end cloud migration and modernization.
 
-SAP on Google Cloud
+Gemini for business
 
-Certifications for running SAP applications and SAP HANA.
+Enterprise-ready generative AI and agents to accelerate innovation across your organization.
 
-High Performance Computing
+AI Hypercomputer
 
-Compute, storage, and networking options to support any workload.
+Integrated supercomputing architecture to 

… truncated …
```

### `google-cloud-ml-locations`

- **Confidence:** low
- **Dependent pages:** (none)
- **Rationale:** Parse/API failure; fail-safe to material: 401 {"type":"error","error":{"type":"authentication_error","message":"invalid x-api-key"},"request_id":"req_011CgcELN1KyAFPTQGWCCRJr"}
- **Patch:** `snapshots/_diffs/google-cloud-ml-locations.patch`

```diff
Index: snapshots/google-cloud-ml-locations.txt
===================================================================
--- snapshots/google-cloud-ml-locations.txt
+++ snapshots/google-cloud-ml-locations.txt
@@ -118,6 +118,8 @@
 
 Notebooks
 
+API reference
+
 Pricing
 
 Agent Platform
@@ -140,6 +142,8 @@
 
 Notebooks
 
+API reference
+
 Pricing
 
 More
@@ -162,708 +166,8 @@
 
 Notebooks
 
-CodeMender
-OverviewInstall and configure the CLIScan and verify code vulnerabilitiesImport third-party security findingsFix code vulnerabilities and manage diffsManage sessions and export reports
-
 API reference
 
-All APIs and reference
-
-gcloud CLI reference
-gcloud aigcloud beta aigcloud colabgcloud beta colabgcloud network-services agent-gatewaysgcloud beta network-services agent-gateways
-
-Client libraries
-
-Google Gen AI SDK
-OverviewPythonGoJavaNode.jsC#
-
-Agent Platform SDK
-IntroductionPython version 2.0.1 migration guideInstall the SDK for PythonPythonGoJavaNode.jsC#
-
-Agent Platform in express mode
-Express mode REST API reference
-
-v1
-OverviewcountTokensgenerateContentstreamGenerateContent
-
-v1beta1
-OverviewcountTokensgenerateContentstreamGenerateContent
-
-REST API reference
-All methods
-
-v1
-
-REST Resources
-
-media
-Overviewupload
-
-operations
-Overviewcanceldeletegetlistwait
-
-projects.locations
-OverviewaskContextsasyncRetrieveContextsaugmentPromptcorroborateContentdeployevaluateInstancesgenerateSyntheticDatagetRagEngineConfiggetSemanticGovernancePolicyEngineretrieveContextsupdateRagEngineConfigupdateSemanticGovernancePolicyEngine
-
-projects.locations.batchPredictionJobs
-Overviewcancelcreatedeletegetlist
-
-projects.locations.cachedContents
-Overviewcreatedeletegetlistpatch
-
-projects.locations.customJobs
-Overviewcancelcreatedeletegetlist
-
-projects.locations.datasets
-OverviewcreatedeleteexportgetimportlistpatchsearchDataItems
-
-projects.locations.datasets.annotationSpecs
-Overviewget
-
-projects.locations.datasets.dataItems
-Overviewlist
-
-projects.locations.datasets.dataItems.annotations
-Overviewlist
-
-projects.locations.datasets.datasetVersions
-Overviewcreatedeletegetlistpatchrestore
-
-projects.locations.datasets.savedQueries
-Overviewdeletelist
-
-projects.locations.deploymentResourcePools
-OverviewcreatedeletegetlistpatchqueryDeployedModels
-
-projects.locations.endpoints
-OverviewcomputeTokenscountTokenscreatedeletedeployModeldirectPredictdirectRawPredictexplaingenerateContentgetlistmutateDeployedModelpatchpredictrawPredictserverStreamingPredictstreamGenerateContentstreamRawPredictundeployModelupdate
-
-projects.locations.endpoints.responses
-Overviewdeleteget
-
-projects.locations.featureGroups
-OverviewcreatedeletegetgetIamPolicylistpatchsetIamPolicytestIamPermissions
-
-projects.locations.featureGroups.features
-OverviewbatchCreatecreatedeletegetlistpatch
-
-projects.locations.featureOnlineStores
-OverviewcreatedeletegetgetIamPolicylistpatchsetIamPolicytestIamPermissions
-
-projects.locations.featureOnlineStores.featureViews
-OverviewcreatedeletedirectWritefetchFeatureValuesgenerateFetchAccessTokengetgetIamPolicylistpatchsearchNearestEntitiessetIamPolicysynctestIamPermissions
-
-projects.locations.featureOnlineStores.featureViews.featureViewSyncs
-Overviewgetlist
-
-projects.locations.featurestores
-OverviewbatchReadFeatureValuescreatedeletegetgetIamPolicylistpatchsearchFeaturessetIamPolicytestIamPermissions
-
-projects.locations.featurestores.entityTypes
-OverviewcreatedeletedeleteFeatureValuesexportFeatureValuesgetgetIamPolicyimportFeatureValueslistpatchreadFeatureValuessetIamPolicystreamingReadFeatureValuestestIamPermissionswriteFeatureValues
-
-projects.locations.featurestores.entityTypes.features
-OverviewbatchCreatecreatedeletegetlistpatch
-
-projects.locations.hyperparameterTuningJobs
-Overviewcancelcreatedeletegetlist
-
-projects.locations.indexEndpoints
-OverviewcreatedeletedeployIndexgetlistmutateDeployedIndexpatchundeployIndex
-
-projects.locations.indexes
-Overviewcreatedeletegetl

… truncated …
```

### `microsoft-dpa`

- **Confidence:** low
- **Dependent pages:** (none)
- **Rationale:** Parse/API failure; fail-safe to material: 401 {"type":"error","error":{"type":"authentication_error","message":"invalid x-api-key"},"request_id":"req_011CgcELQ84ZmEFXVJDBtpvh"}
- **Patch:** `snapshots/_diffs/microsoft-dpa.patch`

```diff
Index: snapshots/microsoft-dpa.txt
===================================================================
--- snapshots/microsoft-dpa.txt
+++ snapshots/microsoft-dpa.txt
@@ -121,7 +121,7 @@
 Microsoft Products and Services Data Protection Addendum (DPA)
 When you subscribe to a Product under the terms of the Product Terms site, the data processing and security terms are defined in Microsoft Online Services Data Protection Addendum (DPA). The DPA is an addendum to the Product Terms site (and formerly OST). The current and archived editions of the DPA are available for download.
 
-Download the most recent version (English) (May 2026):
+Download the most recent version (English) (November 2026):
 Microsoft Product and Services Data Protection Addendum (WW)
 Download
 
@@ -195,6 +195,286 @@
 
 Microsoft Product and Services Data Protection Addendum (WW)
 
+November
+01
+2026
+
+Portuguese (Portugal)
+
+Microsoft Product and Services Data Protection Addendum (WW)
+
+November
+01
+2026
+
+Romanian
+
+Microsoft Product and Services Data Protection Addendum (WW)
+
+November
+01
+2026
+
+Russian
+
+Microsoft Product and Services Data Protection Addendum (WW)
+
+November
+01
+2026
+
+Serbian
+
+Microsoft Product and Services Data Protection Addendum (WW)
+
+November
+01
+2026
+
+Slovak
+
+Microsoft Product and Services Data Protection Addendum (WW)
+
+November
+01
+2026
+
+Slovenian
+
+Microsoft Product and Services Data Protection Addendum (WW)
+
+November
+01
+2026
+
+Dutch
+
+Microsoft Product and Services Data Protection Addendum (WW)
+
+November
+01
+2026
+
+English
+
+Microsoft Product and Services Data Protection Addendum (WW)
+
+November
+01
+2026
+
+Estonian
+
+Microsoft Product and Services Data Protection Addendum (WW)
+
+November
+01
+2026
+
+Finnish
+
+Microsoft Product and Services Data Protection Addendum (WW)
+
+November
+01
+2026
+
+French (Europe)
+
+Microsoft Product and Services Data Protection Addendum (WW)
+
+November
+01
+2026
+
+German
+
+Microsoft Product and Services Data Protection Addendum (WW)
+
+November
+01
+2026
+
+Greek
+
+Microsoft Product and Services Data Protection Addendum (WW)
+
+November
+01
+2026
+
+Hungarian
+
+Microsoft Product and Services Data Protection Addendum (WW)
+
+November
+01
+2026
+
+Indonesian
+
+Microsoft Product and Services Data Protection Addendum (WW)
+
+November
+01
+2026
+
+Italian
+
+Microsoft Product and Services Data Protection Addendum (WW)
+
+November
+01
+2026
+
+Japanese
+
+Microsoft Product and Services Data Protection Addendum (WW)
+
+November
+01
+2026
+
+Bulgarian
+
+Microsoft Product and Services Data Protection Addendum (WW)
+
+November
+01
+2026
+
+Catalan
+
+Microsoft Product and Services Data Protection Addendum (WW)
+
+November
+01
+2026
+
+Chinese (Simplified)
+
+Microsoft Product and Services Data Protection Addendum (WW)
+
+November
+01
+2026
+
+Chinese (Traditional)
+
+Microsoft Product and Services Data Protection Addendum (WW)
+
+November
+01
+2026
+
+Croatian
+
+Microsoft Product and Services Data Protection Addendum (WW)
+
+November
+01
+2026
+
+Czech
+
+Microsoft Product and Services Data Protection Addendum (WW)
+
+November
+01
+2026
+
+Danish
+
+Microsoft Product and Services Data Protection Addendum (WW)
+
+November
+01
+2026
+
+Spanish (International)
+
+Microsoft Product and Services Data Protection Addendum (WW)
+
+November
+01
+2026
+
+Swedish
+
+Microsoft Product and Services Data Protection Addendum (WW)
+
+November
+01
+2026
+
+Thai
+
+Microsoft Product and Services Data Protection Addendum (WW)
+
+November
+01
+2026
+
+Turkish
+
+Microsoft Product and Services Data Protection Addendum (WW)
+
+November
+01
+2026
+
+Ukranian
+
+Microsoft Product and Services Data Protection Addendum (WW)
+
+November
+01
+2026
+
+Korean
+
+Microsoft Product and Services Data Protection Addendum (WW)
+
+November
+01
+2026
+
+Latvian
+
+Microsoft Product and Services Data Protection Addendum (WW)
+
+November
+01
+2026
+
+Lithuanian
+
+Microsoft Product and Servic

… truncated …
```

### `mistral-home`

- **Confidence:** low
- **Dependent pages:** (none)
- **Rationale:** Parse/API failure; fail-safe to material: 401 {"type":"error","error":{"type":"authentication_error","message":"invalid x-api-key"},"request_id":"req_011CgcELSFK1hYu5Dymzp4Tf"}
- **Patch:** `snapshots/_diffs/mistral-home.patch`

```diff
Index: snapshots/mistral-home.txt
===================================================================
--- snapshots/mistral-home.txt
+++ snapshots/mistral-home.txt
@@ -2,16 +2,10 @@
 
 Menu
 
-Products
+ResearchSovereign AI
 
-Industries
+Cloud
 
-Research
-
-Developers
-
-Blog
-
 Customers
 
 Company
@@ -20,341 +14,133 @@
 
 Login
 
-StudioBuild, test, and run AI agents and apps.
+Why Sovereign AI
 
-ForgeTrain, align, and evaluate custom AI models.
+Products
 
-VibeAI agent for long-horizon work.
+Method
 
-Vibe for codeCoding agents in the terminal, IDE, and background.
+Sovereign AI in practice
 
-AI CloudFrontier-scale infrastructure for training and inference.
+Inference
 
-PricingPlans
+Compute
 
-API pricing
+Energy & utilities
 
-For enterprises
+Manufacturing
 
 Financial services
 
-Public sector & government
+Public sector
 
-Manufacturing
+Cybersecurity
 
-Energy & utilities
+All customers
 
-DomainsCoding
+Blog
 
-Document intelligence
-
-Speech
-
-Applied AIDelivery methodology
-
-Model customization
-
-Latest models
-
-Mistral OCR 4
-
-Mistral Medium 3.5
-
-Mistral Small 4
-
-Voxtral TTS
-
-See all models
-
 Docs
 
-API Reference
-
-Cookbooks
-
-Latest posts
-
-Hallo, Deutschland!
-
-Mistral and Mozilla are bringing open, private and multilingual AI to your web browser
-
-Cloudera and Mistral Partner to Bring Specialized, Sovereign Intelligence to Enterprise Data
-
-Read all news
-
-CategoriesProduct
-
-Research
-
-Engineering
-
-Solutions
-
-Company
-
-Featured stories
-
-ASML
-
-CMA CGM
-
-HSBC
-
-TotalEnergies
-
-See all
-
-Who we are
-
 About us
 
 Careers
 
-Brand
+ResearchSovereign AICloudCustomersCompany
 
-ConnectCommunity
+Why Sovereign AI
 
-Partners
+Products
 
-Help center
+Method
 
-ProductsIndustriesResearchDevelopersBlogCustomersCompany
+Sovereign AI in practice
 
-StudioBuild, test, and run AI agents and apps.
+Inference
 
-ForgeTrain, align, and evaluate custom AI models.
+Compute
 
-VibeAI agent for long-horizon work.
+Energy & utilities
 
-Vibe for codeCoding agents in the terminal, IDE, and background.
+Manufacturing
 
-AI CloudFrontier-scale infrastructure for training and inference.
-
-PricingPlans
-
-API pricing
-
-For enterprises
-
 Financial services
 
-Public sector & government
+Public sector
 
-Manufacturing
+Cybersecurity
 
-Energy & utilities
+All customers
 
-DomainsCoding
+Blog
 
-Document intelligence
-
-Speech
-
-Applied AIDelivery methodology
-
-Model customization
-
-Latest models
-
-Mistral OCR 4
-
-Mistral Medium 3.5
-
-Mistral Small 4
-
-Voxtral TTS
-
-See all models
-
 Docs
 
-API Reference
-
-Cookbooks
-
-Latest posts
-
-Hallo, Deutschland!
-
-Mistral and Mozilla are bringing open, private and multilingual AI to your web browser
-
-Cloudera and Mistral Partner to Bring Specialized, Sovereign Intelligence to Enterprise Data
-
-Read all news
-
-CategoriesProduct
-
-Research
-
-Engineering
-
-Solutions
-
-Company
-
-Featured stories
-
-ASML
-
-CMA CGM
-
-HSBC
-
-TotalEnergies
-
-See all
-
-Who we are
-
 About us
 
 Careers
 
-Brand
+Get in touchLogin
 
-ConnectCommunity
-
-Partners
-
-Help center
-
-Login
-
 Studio
 
 Vibe
 
-Vibe for Code
+Mistral is #1 in Sovereign AI.Le Chonk: Built for Coders, Trusted by Defenders.
 
-Get in touch
+Le Chonk: Built for Coders, Trusted by Defenders.
 
-Frontier AI.
-In your hands.Frontier AI.In your hands.We help organizations build tailored AI systems to solve the world’s hardest problems.Featured newsMistral raises €3B to make sovereign, open-weight AI the technology frontier
+No one else should hold the strings to yourProcess knowledgeIntellectual propertyInventionDataCore product developmentQuality standardsDiscoveryProprietary AIPrivate code baseDecision logicEngineering practicesDesign tradeoffsMistral lets you decidehow AI works in your organization.Frontier open models
 
-In-region inference, open models, and new European infrastructure for sovereign AI.
+Frontier open models
 
-Introducing Shieldstral.
+Proprietary intelligence
 

… truncated …
```

### `aws-bedrock-security`

- **Confidence:** low
- **Dependent pages:** (none)
- **Rationale:** Parse/API failure; fail-safe to material: 401 {"type":"error","error":{"type":"authentication_error","message":"invalid x-api-key"},"request_id":"req_011CgcELULpuEXmpynf5CtfX"}
- **Patch:** `snapshots/_diffs/aws-bedrock-security.patch`

```diff
Index: snapshots/aws-bedrock-security.txt
===================================================================
--- snapshots/aws-bedrock-security.txt
+++ snapshots/aws-bedrock-security.txt
@@ -34,27 +34,27 @@
 
 re:Invent 2026
 
-The session catalog is live. Explore what's waiting for you
+The sessions are set and your seat is waiting. Register now
 
 Build & Deploy AI Agents
 
 88% of agent pilots stall. Learn what the rest do differently
 
-Independent Software Vendors
+Get started
 
-AI for software & tech: build, scale, and monetize
+Sign up free, connect your coding agent, and start building
 
 Data for agentic AI
 
 The 7 essential data capabilities to scale agentic AI
 
-Agent Toolkit
+Analyst Report
 
-Give AI coding agents up-to-date docs and AWS resource access
+AWS named a Leader in the 2026 Gartner Magic Quadrant for SCPS
 
-Amazon Quick
+AI for Small Businesses
 
-Answers grounded in your actual business data
+Solutions designed for your business. Delivered by AWS Partners
 
 News & announcements
 
@@ -71,6 +71,7 @@
 Trust Center
 Sustainability
 Global Infrastructure
+Careers
 
 Featured Products
 
@@ -325,6 +326,7 @@
 What's New
 Blogs
 Press Releases
+Careers
 
 Resources
```

### `infomaniak-trust`

- **Confidence:** low
- **Dependent pages:** (none)
- **Rationale:** Parse/API failure; fail-safe to material: 401 {"type":"error","error":{"type":"authentication_error","message":"invalid x-api-key"},"request_id":"req_011CgcELWT4rUhR5AdqF7iUF"}
- **Patch:** `snapshots/_diffs/infomaniak-trust.patch`

```diff
Index: snapshots/infomaniak-trust.txt
===================================================================
--- snapshots/infomaniak-trust.txt
+++ snapshots/infomaniak-trust.txt
@@ -1,1 +1,1 @@
-Our productsCollaborative toolsWeb & DomainsCloud ComputingEvents & MarketingStreamingkDrive Store, collaborate and share your fileskChat Communicate live with your teamsSwissTransfer Send your files up to 50 GB free of chargeCustom Brand Control the brand image of your productsMail Service Create your email addresses with your domainkMeet Organise your meetings online in complete securitykPaste Share and encrypt your sensitive informationChk Link reducer & QR code generatorCollaborative suiteDiscover the collaborative suitekSuite PROFor organisations that want to collaborate in a 100% sovereign ecosystemkSuite For individuals who want an ethical email address, drive and AI, free for lifeEuria, the ethical AI The sovereign AI assistant that respects privacy and the planet.Find the web hosting solution you needCompare our web hosting solutionsDomain Name Reserve your domain name at the best priceWeb Hosting Create your website with over 100 CMSCloud Server Power up your sites with guaranteed resourcesSSL Certificates Secure your websites with an EV or DV certificateSite Creator Create your website with easeWordpress Hosting Create your WordPress website easilyNode.js Hosting Create a dynamic, interactive site with Node.jsOptionsDomain Privacy Protect your domains’ private dataFastAnycast DNS Speed up your site access timesDynDNS Access your devices remotelyRenewal Warranty Secure your domains against loss and theftCloud servicesCloud ComputingCompare our products and services and create the right cloud for your needsCompare our solutionsPublic Cloud (IaaS) Create your projects in a high-end, ultra-competitive CloudVPS Cloud Create a Windows / Linux serverKubernetes Service Deploy containerised apps on a large scaleVPS Lite Create a Windows/Linux server at a low costDatabase Service Manage your databases with a managed solutionJelastic Cloud (PaaS) Create your own customised environmentsOther servicesAI Services Boost your productivity with our sovereign AISwiss Backup Back up your devices in the CloudNAS Synology Rent a NAS in our secure data centersVery High Availability Create a multi-data center infrastructure with customised SLAsHousing Install your servers in our data centersAuth Add a privacy-friendly login method to your appsInfomaniak Events, the independent local events portalOnline ticketing service with a wide choice of concerts, shows and events.Discover all the eventsTicketing Create your ticketing service and sell ticketsAccess Control Control access to your events with easeGuest manager Automate your event invitationsNewsletter Send your newsletters at competitive pricesRadio Streaming Create and broadcast your own live radio station onlineVideo-Streaming Create and broadcast live events and TV onlineVOD & AOD service Host and broadcast your recordings without limitsResourcesDocumentationGuides & tutorialsAPI documentationSpecial offersGet started for freeStudent programmeBecome an affiliatePartner programmeFind a partnerBecome a partnerInfomaniak AcademySupport & contactContact SupportPremium support - 24/7Contact our sales departmentHiring an expertMigrate to InfomaniakInvestorsAbout usInfomaniak’s valuesResponsibility, Social and LocalDigital sovereigntyLong-term commitmentAbout InfomaniakAbout usGovernanceInfomaniak is recruitingBlog and newsImpact report 2024Your securityData confidentialityBug Bounty ProgramTrust centerGet started for freeLog inTrust centerOverviewSecurity through total controlLearn more about how we put security, confidentiality and compliance at the heart of our services to ensure your data is protected.Explore our security modelsYour data.Under your control.Always.At Infomaniak, we control the entire chain of our solutions. This is the only way to guarantee that your data truly remains yours.Marc O

… truncated …
```

### `huggingface-security`

- **Confidence:** low
- **Dependent pages:** (none)
- **Rationale:** Parse/API failure; fail-safe to material: 401 {"type":"error","error":{"type":"authentication_error","message":"invalid x-api-key"},"request_id":"req_011CgcELYWbxWhvH6cyMDWUZ"}
- **Patch:** `snapshots/_diffs/huggingface-security.patch`

```diff
Index: snapshots/huggingface-security.txt
===================================================================
--- snapshots/huggingface-security.txt
+++ snapshots/huggingface-security.txt
@@ -1,5 +1,5 @@
-Hugging Face Models Datasets Spaces Buckets new Docs Enterprise Pricing Website Tasks HuggingChat Collections Languages Organizations Community Blog Posts Daily Papers Hardware Learn Discord Forum GitHub Solutions Team & Enterprise Hugging Face PRO Enterprise Support Inference Providers Inference Endpoints Storage Buckets Log In Sign Up Hub documentation Security Hub 🏡 View all docsAWS Trainium & InferentiaAccelerateArgillaAutoTrainBitsandbytesCLIChat UIDataset viewerDatasetsDeploying on AWSDiffusersDistilabelEvaluateGoogle CloudGoogle TPUsGradioHubHub Python LibraryHuggingface.jsInference Endpoints (dedicated)Inference ProvidersKernelsLeRobotLeaderboardsLightevalMicrosoft AzureOpenEnvOptimumPEFTReachy MiniSafetensorsSentence TransformersTRLTasksText Embeddings InferenceText Generation InferenceTokenizersTrackioTransformersTransformers.jsXetsmolagentstimm Search documentation EN API docs 🤗 Hugging Face Hub Team & Enterprise Plans Single Sign-On (SSO) Audit Logs Storage Regions Data Studio for Private datasets Resource Groups (Access Control) Advanced Compute Options Advanced Security Tokens Management Service Accounts Publisher Analytics Gating Group Collections Network Security Download Analytics Rate Limits Blog Articles PRO Plan Repositories Getting Started with Repositories Repository Settings Storage Limits Storage Backend (Xet) Local Cache Pull Requests & Discussions Notifications Collections Webhooks GitHub Actions Notebooks Next Steps Licenses Models The Model Hub Model Cards Eval Results Leaderboard Data Gated Models Uploading Models Downloading Models Integrated Libraries Model Widgets Model Inference Models Download Stats Model Release Checklist Hardware Local Apps Frequently Asked Questions Advanced Topics Datasets Datasets Overview Dataset Cards Gated Datasets Uploading Datasets Uploading Datasets (for LLMs) Downloading Datasets Streaming Datasets Integrated Libraries Data Studio Agent Traces Datasets Download Stats Spaces Spaces Overview Spaces GPU Upgrades Spaces ZeroGPU Spaces Dev Mode Spaces Disk Usage & Storage Spaces Custom Domain Spaces as MCP servers Spaces as Agent Tools Spaces as API Endpoints Gradio Spaces Streamlit Spaces Static HTML Spaces Docker Spaces Embed your Space Run Spaces with Docker Spaces Configuration Reference Sign-In with HF button Featured Spaces Spaces Changelog Advanced Topics Storage Buckets new Access Patterns S3 Compatibility Bucket Integrations Bucket Security Jobs Jobs Overview Quickstart Pricing and Billing Manage Jobs Configuration Using Docker images Serve Models Train Models Examples & Tutorials Process Large Datasets Schedule Jobs Webhook Automation Reference Agents Agents Overview Hugging Face CLI for AI Agents Hugging Face MCP Server Hugging Face Agent Skills Building agents with the HF SDK Local Agents with llama.cpp Agent Libraries Session Traces Format Other Organizations Billing Security User Access Tokens Trusted Publishers (CI/CD) Two-Factor Authentication Git over SSH Signing Commits with GPG Single Sign-On (SSO) Advanced Access Control (Resource Groups) Programmatic User Access Control Management Malware Scanning Pickle Scanning Secrets Scanning Protect AI JFrog Moderation Paper Pages Academia Hub Blog Articles Search Digital Object Identifier (DOI) Hub API Endpoints OAuth / Sign in with HF Join the Hugging Face community and get access to the augmented documentation experience Collaborate on models, datasets and Spaces Faster examples with accelerated inference Switch between documentation themes Sign Up to get started
+Hugging Face Models Datasets Spaces Buckets Docs Enterprise Pricing Website Tasks HuggingChat Collections Languages Organizations Community Blog Posts Daily Papers Hardware Learn Discord Forum GitHub Solutions Team & Enterprise Hugging Face PRO 

… truncated …
```

### `cohere-trust`

- **Confidence:** low
- **Dependent pages:** (none)
- **Rationale:** Parse/API failure; fail-safe to material: 401 {"type":"error","error":{"type":"authentication_error","message":"invalid x-api-key"},"request_id":"req_011CgcELaZsVPALpLkQN61Ek"}
- **Patch:** `snapshots/_diffs/cohere-trust.patch`

```diff
Index: snapshots/cohere-trust.txt
===================================================================
--- snapshots/cohere-trust.txt
+++ snapshots/cohere-trust.txt
@@ -192,7 +192,7 @@
 
 Internal Control Policy
 
-View 9 more controls
+View 8 more controls
 Confidentiality
 
 Data Classification Policy
@@ -311,9 +311,6 @@
 Advisor Meetings on Security
 Senior management and/or board of directors meets at least annually to review business goals, company initiatives, resource needs, risk management activities, and other internal/external matters. The information security team meets at least annually to discuss security risks, roles & responsibilities, controls, changes, audit results and/or other matters as necessary.
 
-Information Security Program Review
-Management is responsible for the design, implementation, and management of the organization’s security policies and procedures. The policies and procedures are reviewed by management at least annually.
-
 Disciplinary Action
 Personnel who violate information security policies are subject to disciplinary action and such disciplinary action is clearly documented in one or more policies.
```

### `cohere-enterprise-data`

- **Confidence:** low
- **Dependent pages:** (none)
- **Rationale:** Parse/API failure; fail-safe to material: 401 {"type":"error","error":{"type":"authentication_error","message":"invalid x-api-key"},"request_id":"req_011CgcELcg7pB6HxLYbocuWu"}
- **Patch:** `snapshots/_diffs/cohere-enterprise-data.patch`

```diff
Index: snapshots/cohere-enterprise-data.txt
===================================================================
--- snapshots/cohere-enterprise-data.txt
+++ snapshots/cohere-enterprise-data.txt
@@ -1,1 +1,1 @@
-Skip to contentEmbed 5 is here: state-of-the-art retrieval - now available in Pro and Fast tiers.Learn moreProductsProductsSolutionsSolutionsResourcesResourcesBlogBlogResearchResearchCompanyCompanySign inRequest a demoPlatformNorthEnterprise-ready AI for businessCompassIntelligent search and discoveryModelsCommandGenerative language modelsTranscribeNewSpeech recognition modelNorth Small TranslateNEWMachine translation modelParseNewDocument parsing modelEmbedSemantic representation modelRerankRetrieval optimization modelModels OverviewProductProducts OverviewTotal Cost of AI OwnershipPricingFeaturedCommand: High-performance generative AI models for real-world applicationsDeployModel VaultDedicated model inference platformPrivate DeploymentsOn-prem or isolated VPCsSecurityProtect your data at every stageSee deployment optionsBy IndustryFinancial ServicesPublic SectorTechnologyTelecommunicationsEnergy and UtilitiesHealthcare and Life SciencesManufacturingFeaturedModel Vault provides fully-isolated, performant inference with Saas simplicityInsightsCustomer StoriesFor DevelopersDevelopersModels OverviewDocsDiscordLLM UniversityConnectPartnersEventsWebinarsMerch StoreFeaturedHow CoreWeave used Cohere North to transform its customer support in 90 daysBlogThe latest news, launches, and insightsRead moreIntroducing Embed 5—A New Family of Frontier Embedding ModelsCohere and Aleph Alpha sign agreement to become the first transatlantic sovereign AI solutionWho Gets to Define the Rules for AI?ResearchCohere LabsCohere’s ML research labExplorationsFuture(s) of WorkHow will AI change the way we work?Aya ModelsMultilingual AI at scaleAll PapersInitiativesResearch ScholarsFinding the new generation of ML talentOpen Science CommunityChampioning global, open scienceCatalyst GrantsSupporting impactful ML endeavorsResourcesBlogHugging FaceEventsFeaturedThe future of work debate has an evidence problemAboutCareersNewsroomProductsSolutionsResourcesBlogResearchCompanySign inRequest a demoPlatformNorthEnterprise-ready AI for businessCompassIntelligent search and discoveryModelsCommandGenerative language modelsTranscribeNewSpeech recognition modelNorth Small TranslateNEWMachine translation modelParseNewDocument parsing modelEmbedSemantic representation modelRerankRetrieval optimization modelModels OverviewProductProducts OverviewTotal Cost of AI OwnershipPricingFeaturedCommand: High-performance generative AI models for real-world applicationsDeployModel VaultDedicated model inference platformPrivate DeploymentsOn-prem or isolated VPCsSecurityProtect your data at every stageSee deployment optionsBy IndustryFinancial ServicesPublic SectorTechnologyTelecommunicationsEnergy and UtilitiesHealthcare and Life SciencesManufacturingFeaturedModel Vault provides fully-isolated, performant inference with Saas simplicityInsightsCustomer StoriesFor DevelopersDevelopersModels OverviewDocsDiscordLLM UniversityConnectPartnersEventsWebinarsMerch StoreFeaturedHow CoreWeave used Cohere North to transform its customer support in 90 daysBlogThe latest news, launches, and insightsRead moreIntroducing Embed 5—A New Family of Frontier Embedding ModelsCohere and Aleph Alpha sign agreement to become the first transatlantic sovereign AI solutionWho Gets to Define the Rules for AI?ResearchCohere LabsCohere’s ML research labExplorationsFuture(s) of WorkHow will AI change the way we work?Aya ModelsMultilingual AI at scaleAll PapersInitiativesResearch ScholarsFinding the new generation of ML talentOpen Science CommunityChampioning global, open scienceCatalyst GrantsSupporting impactful ML endeavorsResourcesBlogHugging FaceEventsFeaturedThe future of work debate has an evidence problemAboutCareersNewsroomReady to put AI to work?Request a demoPlatformsNorthCompassProduct Overvi

… truncated …
```

### `ibm-watsonx-home`

- **Confidence:** low
- **Dependent pages:** (none)
- **Rationale:** Parse/API failure; fail-safe to material: 401 {"type":"error","error":{"type":"authentication_error","message":"invalid x-api-key"},"request_id":"req_011CgcELejPnw9tXDpB7nLXB"}
- **Patch:** `snapshots/_diffs/ibm-watsonx-home.patch`

```diff
Index: snapshots/ibm-watsonx-home.txt
===================================================================
--- snapshots/ibm-watsonx-home.txt
+++ snapshots/ibm-watsonx-home.txt
@@ -187,12 +187,6 @@
 
 For developers
 
-Sample watsonx applications
-
-IBM's enterprise ready AI and data platform designed to leverage foundation models and machine learning
-
-For developers
-
 Sample watsonx code
 
 Your launchpad to move faster, amplify impact, and deliver AI-driven solutions that set new standards - let’s take your business further
```

### `exoscale-compliance`

- **Confidence:** low
- **Dependent pages:** (none)
- **Rationale:** Parse/API failure; fail-safe to material: 401 {"type":"error","error":{"type":"authentication_error","message":"invalid x-api-key"},"request_id":"req_011CgcELgnBTM5oYpC9zUrPq"}
- **Patch:** `snapshots/_diffs/exoscale-compliance.patch`

```diff
Index: snapshots/exoscale-compliance.txt
===================================================================
--- snapshots/exoscale-compliance.txt
+++ snapshots/exoscale-compliance.txt
@@ -90,14 +90,16 @@
 
 ThanosLong-term storage for Prometheus metrics
 
-NetworkingPrivate Networks, Network Load Balancer and Elastic IPs
+Networking OverviewExplore all networking products
 
-Virtual Private CloudDedicated hypervisors and Private Connect
+Virtual Private CloudSubnets, routing, Security Groups
 
 DNSAnycast resolution at low latency
 
 CDNDeliver content directly from your buckets
 
+Security OverviewEncryption, key management and keys you hold yourself
+
 Key Management ServiceCreate and control your own encryption keys
 
 IAMRoles, API keys and fine-grained access control
@@ -140,7 +142,7 @@
 
 DBaaSEngines, plans and service boundaries
 
-NetworkingLoad balancing, DNS, CDN and Private Networks
+NetworkingLoad balancing, DNS, CDN and VPC
 
 SecurityKey Management Service and IAM
 
@@ -374,9 +376,9 @@
 Networking
 Connect, route and protect your traffic
 
-NetworkingPrivate Networks, Network Load Balancer and Elastic IPs
+Networking OverviewExplore all networking products
 
-Virtual Private CloudDedicated hypervisors and Private Connect
+Virtual Private CloudSubnets, routing, Security Groups
 
 DNSAnycast resolution at low latency
 
@@ -388,6 +390,8 @@
 Security
 Keys, access and encryption
 
+Security OverviewEncryption, key management and keys you hold yourself
+
 Key Management ServiceCreate and control your own encryption keys
 
 IAMRoles, API keys and fine-grained access control
@@ -439,7 +443,7 @@
 
 DBaaSEngines, plans and service boundaries
 
-NetworkingLoad balancing, DNS, CDN and Private Networks
+NetworkingLoad balancing, DNS, CDN and VPC
 
 SecurityKey Management Service and IAM
```

### `exoscale-ai`

- **Confidence:** low
- **Dependent pages:** (none)
- **Rationale:** Parse/API failure; fail-safe to material: 401 {"type":"error","error":{"type":"authentication_error","message":"invalid x-api-key"},"request_id":"req_011CgcELipi12zNR1j4eDNC8"}
- **Patch:** `snapshots/_diffs/exoscale-ai.patch`

```diff
Index: snapshots/exoscale-ai.txt
===================================================================
--- snapshots/exoscale-ai.txt
+++ snapshots/exoscale-ai.txt
@@ -90,14 +90,16 @@
 
 ThanosLong-term storage for Prometheus metrics
 
-NetworkingPrivate Networks, Network Load Balancer and Elastic IPs
+Networking OverviewExplore all networking products
 
-Virtual Private CloudDedicated hypervisors and Private Connect
+Virtual Private CloudSubnets, routing, Security Groups
 
 DNSAnycast resolution at low latency
 
 CDNDeliver content directly from your buckets
 
+Security OverviewEncryption, key management and keys you hold yourself
+
 Key Management ServiceCreate and control your own encryption keys
 
 IAMRoles, API keys and fine-grained access control
@@ -140,7 +142,7 @@
 
 DBaaSEngines, plans and service boundaries
 
-NetworkingLoad balancing, DNS, CDN and Private Networks
+NetworkingLoad balancing, DNS, CDN and VPC
 
 SecurityKey Management Service and IAM
 
@@ -374,9 +376,9 @@
 Networking
 Connect, route and protect your traffic
 
-NetworkingPrivate Networks, Network Load Balancer and Elastic IPs
+Networking OverviewExplore all networking products
 
-Virtual Private CloudDedicated hypervisors and Private Connect
+Virtual Private CloudSubnets, routing, Security Groups
 
 DNSAnycast resolution at low latency
 
@@ -388,6 +390,8 @@
 Security
 Keys, access and encryption
 
+Security OverviewEncryption, key management and keys you hold yourself
+
 Key Management ServiceCreate and control your own encryption keys
 
 IAMRoles, API keys and fine-grained access control
@@ -439,7 +443,7 @@
 
 DBaaSEngines, plans and service boundaries
 
-NetworkingLoad balancing, DNS, CDN and Private Networks
+NetworkingLoad balancing, DNS, CDN and VPC
 
 SecurityKey Management Service and IAM
```

### `ovhcloud-ai-endpoints`

- **Confidence:** low
- **Dependent pages:** (none)
- **Rationale:** Parse/API failure; fail-safe to material: 401 {"type":"error","error":{"type":"authentication_error","message":"invalid x-api-key"},"request_id":"req_011CgcELksVNiDU7FaRBVdhg"}
- **Patch:** `snapshots/_diffs/ovhcloud-ai-endpoints.patch`

```diff
Index: snapshots/ovhcloud-ai-endpoints.txt
===================================================================
--- snapshots/ovhcloud-ai-endpoints.txt
+++ snapshots/ovhcloud-ai-endpoints.txt
@@ -6,7 +6,7 @@
 This page provides the technical features, capabilities and limitations of AI Endpoints.
 Features
 Available features
-FeatureDetailsLarge Selection of ModelsAI Endpoints offers a diverse range of pre-trained AI models, covering categories such as LLMs (Visual, Reasoning, Coding), Audio Analysis, Embeddings, Natural Language Processing, Translation, Image Generation, and Computer Vision. For a full list of models, please visit the AI Endpoints Catalog Page.Model MetricsUsers can access various metrics in the OVHcloud Control Panel, such as the number of calls made per model, input and output tokens for large language models (LLMs), and other usage data. These insights can help you manage costs and gain a better understanding of how your applications are using AI capabilities.Data Privacy and SovereigntyOVHcloud prioritizes data privacy and sovereignty, ensuring that AI models accessed via AI Endpoints are fully compliant with strict European regulations. Our infrastructure, located in Gravelines, France, adheres to European data protection regulations. Data is not stored or shared during or after model use, providing users with peace of mind that their data is secure and protected.Access with Personalized Access KeysTo ensure secure and authenticated access to model APIs, users need to provide an API access key in each request. Access keys can be easily created by following the instructions in the AI Endpoints - Getting Started guide. API keys are linked to a Public Cloud project. We provide the flexibility to manage multiple keys for various projects or teams. Additionally, each access key comes with adjustable validity periods, allowing users to tailor their access to specific needs.JSON Mode (JSON Object)AI Endpoints supports JSON mode, which ensures the model's output is always a syntactically valid JSON. This is ideal when you want a reliably parseable JSON format.Function Calling (Tools)Lets the model invoke pre‑defined functions (tools).Structured Outputs (JSON Schema)Builds on JSON Mode by enforcing a specified JSON schema, ensuring outputs strictly adhere to your defined properties and types.
+FeatureDetailsLarge Selection of ModelsAI Endpoints offers a diverse range of pre-trained AI models, covering categories such as LLMs (Visual, Reasoning, Coding), Audio Analysis, Embeddings, Natural Language Processing, Translation, Image Generation, and Computer Vision. For a full list of models, please visit the AI Endpoints Catalog Page.Model MetricsUsers can access various metrics in the OVHcloud Control Panel, such as the number of calls made per model, input and output tokens for large language models (LLMs), and other usage data. These insights can help you manage costs and gain a better understanding of how your applications are using AI capabilities.Data Privacy and SovereigntyOVHcloud prioritizes data privacy and sovereignty, ensuring that AI models accessed via AI Endpoints are fully compliant with strict European regulations. Our infrastructure, hosted in Europe, adheres to European data protection regulations. Data is not stored or shared during or after model use, providing users with peace of mind that their data is secure and protected.Access with Personalized Access KeysTo ensure secure and authenticated access to model APIs, users need to provide an API access key in each request. Access keys can be easily created by following the instructions in the AI Endpoints - Getting Started guide. API keys are linked to a Public Cloud project. We provide the flexibility to manage multiple keys for various projects or teams. Additionally, each access key comes with adjustable validity periods, allowing users to tailor their access to specific needs.JSON Mode (JSON Object)AI Endpoints supports JSON mode, which ensures

… truncated …
```

### `deepl-infrastructure`

- **Confidence:** low
- **Dependent pages:** (none)
- **Rationale:** Parse/API failure; fail-safe to material: 401 {"type":"error","error":{"type":"authentication_error","message":"invalid x-api-key"},"request_id":"req_011CgcELnvGv38RLydBLgNpN"}
- **Patch:** `snapshots/_diffs/deepl-infrastructure.patch`

```diff
Index: snapshots/deepl-infrastructure.txt
===================================================================
--- snapshots/deepl-infrastructure.txt
+++ snapshots/deepl-infrastructure.txt
@@ -1,1 +1,1 @@
-DeepL for AI agentsDeepL Translation Flow: New AI-powered workflows for key use cases and integrationsThe ROI of AI-native translationWhat MCP changes about enterprise softwareDeepL is now available in Microsoft Copilot, ChatGPT and Claude via MCPDeepL Voice now preserves your voice in real time across languagesThe real-time audio layer ready to transform voice translationHow we’re building Translation Quality Evaluation for DeepLFrom high-quality text translation to a real-time voice platformProductsDeepL TranslatorTranslate securely, efficiently, and accuratelyDeepL WriteEnhance your writing and adapt to your audienceDeepL VoiceConverse across languages in real timeDeepL APIBuild multilingual experiences into your productsDeepL IntegrationsCombine Language AI with essential productivity toolsOverviewSolutionsEnterpriseEnterprise overviewEnterprise security & trustMarket-leading QualityCustomization HubDeepL on AWS MarketplaceNewUse casesDocument translationCustomer supportInternal communicationMarketingGlobal expansionTeamsLocalizationLegalMarketing & CommunicationsCustomer ServiceSalesBusiness OperationsIndustryLegal & professional servicesRetail & e-commerceManufacturingGovernmentFinancial servicesPharma & life sciencesHealthcareISV & technologyContact SalesDevelopersDeepL for DevelopersDocumentationAPI referenceCommunityFree API KeyPricingAppsNewAppsDesktop appBrowser extensionMobile appsVoice Desktop AppNewExplore all appsIntegrationsAI agentsMicrosoft WordGoogle WorkspaceMicrosoft 365ResourcesLearnBlogCustomer storiesEvents & WebinarsDeepL AcademyReports & guidesThe Case for Specialist AIDeepL Spring Event HubDeepL AI LabsGet supportHelp CenterApps and integrationsBecome a PartnerLog inStart free trialMenuDeepL BlogTech BlogWe’re expanding DeepL’s data infrastructure – here’s what’s changing and whyBy DeepL TeamLast updated: April 23, 2026In this postWhat’s changingWhat doesn’t changeWhy we’ve made this changeEnabling greater choice for customersBuilt in Europe, for global trustGlobal scale and performance require global data infrastructure. We are expanding DeepL’s data infrastructure and adding AWS as a sub-processor, to align with DeepL’s growth and deliver the performance all of our customers expect. We know this raises important questions about customer data, where it’s stored and how it’s controlled. This update explains what’s changing, what isn’t, and how your data remains protected when using DeepL.What’s changingIn order to bring DeepL to more customers worldwide, this is what we’re changing:We will no longer process data exclusively within EuropeWe are adding AWS as a sub-processor to support global scale and performanceThis ensures that DeepL delivers low-latency and real-time performance, everywhere in the world.What doesn’t changeWhat absolutely does not change is the way that we protect customer data, and the control that our customers have over who can access it.DeepL remains the data processor. We have added AWS as a sub-processor to our services providing the necessary infrastructure for global scale. AWS will not control or access customer data in any usable form. Your data is encrypted in transit and at rest, and we do not use customer data from paid services to train our AI models.Our security features are designed to give you full control over your data. With Bring Your Own Key (BYOK) encryption, you generate and manage your own encryption keys, and you can revoke access to your data at any time. Once you remove your key, your data is completely out of reach of DeepL and any infrastructure partner we work with.DeepL will continue to comply with all of the strict data privacy and security standards that we do today. These include the C5 Type 2 attestation from Germany’s Federal Office for Informati

… truncated …
```

### `deepl-pro-security`

- **Confidence:** low
- **Dependent pages:** (none)
- **Rationale:** Parse/API failure; fail-safe to material: 401 {"type":"error","error":{"type":"authentication_error","message":"invalid x-api-key"},"request_id":"req_011CgcELq1GvNLV6CHhiw5KT"}
- **Patch:** `snapshots/_diffs/deepl-pro-security.patch`

```diff
Index: snapshots/deepl-pro-security.txt
===================================================================
--- snapshots/deepl-pro-security.txt
+++ snapshots/deepl-pro-security.txt
@@ -1,2 +1,2 @@
-DeepL for AI agentsDeepL Translation Flow: New AI-powered workflows for key use cases and integrationsThe ROI of AI-native translationWhat MCP changes about enterprise softwareDeepL is now available in Microsoft Copilot, ChatGPT and Claude via MCPDeepL Voice now preserves your voice in real time across languagesThe real-time audio layer ready to transform voice translationHow we’re building Translation Quality Evaluation for DeepLFrom high-quality text translation to a real-time voice platformProductsDeepL TranslatorTranslate securely, efficiently, and accuratelyDeepL WriteEnhance your writing and adapt to your audienceDeepL VoiceConverse across languages in real timeDeepL APIBuild multilingual experiences into your productsDeepL IntegrationsCombine Language AI with essential productivity toolsOverviewSolutionsEnterpriseEnterprise overviewEnterprise security & trustMarket-leading QualityCustomization HubDeepL on AWS MarketplaceNewUse casesDocument translationCustomer supportInternal communicationMarketingGlobal expansionTeamsLocalizationLegalMarketing & CommunicationsCustomer ServiceSalesBusiness OperationsIndustryLegal & professional servicesRetail & e-commerceManufacturingGovernmentFinancial servicesPharma & life sciencesHealthcareISV & technologyContact SalesDevelopersDeepL for DevelopersDocumentationAPI referenceCommunityFree API KeyPricingAppsNewAppsDesktop appBrowser extensionMobile appsVoice Desktop AppNewExplore all appsIntegrationsAI agentsMicrosoft WordGoogle WorkspaceMicrosoft 365ResourcesLearnBlogCustomer storiesEvents & WebinarsDeepL AcademyReports & guidesThe Case for Specialist AIDeepL Spring Event HubDeepL AI LabsGet supportHelp CenterApps and integrationsBecome a PartnerLog inStart free trialMenuSecure and compliant Language AI for business communicationDeepL ensures your business data remains protected with enterprise-grade security and compliance. Our advanced encryption and adherence to global regulations provide peace of mind, enabling confident multilingual communication across borders. Contact SalesStart free trialTrusted by over 200,000 businesses globallySuperior data safety with industry-leading infrastructureDeepL oversees the AI development process, ensuring security and compliance across every step.Visit our Trust Center to access documents and reports and to learn more about DeepL's data privacy, security, and compliance measures.Visit our Trust CenterRigorous regulatory compliance and data protectionDeepL adheres to the GDPR—one of the strictest data protection and privacy laws worldwide—ensuring your data remains protected and compliant.SOC 2 Type IICertified for security, availability, and confidentiality.Download the audit verdictGDPR complianceWe fully align with EU data protection laws.View data privacy informationRegular penetration testingBoth internal and external experts continually assess our systems.Download our security assessmentContact Sales See pricing Enterprise-grade data encryption, handling, and controlYour data is kept safe with advanced encryption, secure handling, and full control at every stage.
-Texts are never stored or used for model training without your consentCustom encryption, with support for Bring Your Own Key (BYOK)Network access restrictions to control how and where DeepL is accessedTransparent, auditable processes with detailed audit logs and activity reportingFrictionless, secure administrationManage permissions and access across your business with DeepL’s robust administrative tools.Single sign-on (SSO) with OIDC and SAML support, for secure authentication at scaleMultifactor authentication for non-SSO users, an extra verification layer for secure loginRole-based permissions and account impersonation controls for managing user access and support consentCentralized 

… truncated …
```

## Fetch failures

These sources kept their previous snapshot (`change: kept`). Vendor refresh (T18) and `last_verified` bumps skip them — do not leave rows to rot.

### `eur-lex-ai-act-de`

- **HTTP:** 202
- **Error:** HTTP 202 Accepted after 3 attempts (tried 3 URLs; last: https://eur-lex.europa.eu/eli/reg/2024/1689/oj/deu/pdf)
- **Consecutive failures:** 2
- **Last ok:** 2026-07-17T09:43:17.873Z
- **Vendor:** (none)
- **Dependent pages:** `eu-ai-act-swiss-exporters`, `ai-procurement-checklist`
- **Configured fallbacks:** `https://eur-lex.europa.eu/legal-content/DE/TXT/PDF/?uri=CELEX:32024R1689`, `https://eur-lex.europa.eu/eli/reg/2024/1689/oj/deu/pdf`
- **Hint:** add a `fallback_urls` entry in `data/sources.json`, or seed manually: `npm run snapshot:sources -- --id=eur-lex-ai-act-de --seed-file=<path>`

### `eur-lex-ai-act-en`

- **HTTP:** 202
- **Error:** HTTP 202 Accepted after 3 attempts (tried 3 URLs; last: https://eur-lex.europa.eu/eli/reg/2024/1689/oj/eng/pdf)
- **Consecutive failures:** 2
- **Last ok:** 2026-07-17T09:43:14.983Z
- **Vendor:** (none)
- **Dependent pages:** `eu-ai-act-swiss-exporters`
- **Configured fallbacks:** `https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=CELEX:32024R1689`, `https://eur-lex.europa.eu/eli/reg/2024/1689/oj/eng/pdf`
- **Hint:** add a `fallback_urls` entry in `data/sources.json`, or seed manually: `npm run snapshot:sources -- --id=eur-lex-ai-act-en --seed-file=<path>`

## Editor checklist

- [ ] Read each patch and rationale above
- [ ] Update affected DE markdown bodies where obligations/dates/terms changed
- [ ] Confirm `last_verified` after human verification (not auto-bumped for material)
- [ ] Request lawyer re-review (T29) if the page previously carried a badge
- [ ] Review `data/vendors.json` claim cells and sources
- [ ] Confirm `last_checked` and leave unverified cells as `{ value: null, source_url: null }` when evidence is weak
- [ ] For each fetch failure: try a browser-reachable alternate URL as `fallback_urls`, or seed a local snapshot
- [ ] Confirm skipped vendors (`vendors_skipped` in `_act.json`) are not silently stale

