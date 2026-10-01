# Material source changes (2026-10)

Automated T17/T18 brief from the monthly source job. **Not legal advice.**
Review the diffs, update DE cornerstone prose and/or vendor table cells as needed, then merge.
Merging clears the lawyer review badge on affected DE pages (if set).

## Affected pages

- `eu-ai-act-swiss-exporters` — sources: `consilium-digital-omnibus-ai`
- `finma-ai-expectations` — sources: `finma-guidance-08-2024-news`

## Vendor table

Material vendor sources triggered structured field extraction into `data/vendors.json`.
Review proposed claim cells before merge. Identity fields (`id` / `name` / `website`) are never auto-changed.

- `anthropic`
  - sources: `anthropic-regional-compliance`
  - fields changed: `certifications`
  - extract rationale: Snapshot confirms regional data residency in Europe, US, Canada, and Asia-Pacific (Japan, Korea, Singapore, India, Australia), explicit EU/EEA data processing support, default no-training-use commitment for commercial deployments, and SOC 2 Type 2 plus ISO/IEC 27001 certifications. No Swiss-specific hosting, entity, or DPA URL details were found in this snapshot, so those fields are left unchanged.
- `cohere`
  - sources: `cohere-enterprise-data`, `cohere-trust`
  - fields changed: `certifications`
  - extract rationale: Trust Center confirms hosting is solely on Google Cloud US-Central servers with no non-US options, supporting hosting_regions=US and swiss/eu_hosting=false. Enterprise Data Commitments page explicitly describes an opt-out toggle for training data use. Trust Center lists SOC 2 Type II and ISO 27001 certifications plus additional certs (ISO 42001, UK Cyber Essentials) captured as 'other'. No explicit DPA document URL (only contact email) or pricing/entity details were found in the provided evidence, so those fields are left unchanged.
- `deepl`
  - sources: `deepl-infrastructure`
  - fields changed: `certifications`
  - extract rationale: The updated blog post confirms DeepL remains ISO 27001 and SOC 2 Type 2 certified, and newly discloses additional compliance attestations (C5 Type 2, HIPAA, GDPR), supporting an 'other' certification tag. It reaffirms that paid customer data is not used for AI training (training_opt_out=true) and that DeepL was 'built in Europe' (eu_entity=true). It also confirms that EU-only data residency remains available on request, supporting eu_hosting=true, though data is no longer processed exclusively within Europe due to new AWS sub-processor usage for global scale. No explicit new region list (e.g., APAC) or DPA URL was found, so hosting_regions and dpa_url are left unchanged.
- `exoscale`
  - sources: `exoscale-ai`, `exoscale-compliance`
  - fields changed: (no claim fields changed)
  - extract rationale: AI infrastructure page explicitly states data stays exclusively within Europe ('Sovereign European Cloud', 'Your data stays exclusively within Europe'), confirming eu_hosting. It also confirms usage-based billing ('billed by the second'). Other existing fields (CH hosting, SOC 2 certification, DPA, training opt-out, entity status) are not clearly confirmed or contradicted by the truncated snapshot text, so they are left unchanged to avoid invalidating previously sourced claims.
- `google-cloud`
  - sources: `google-cloud-dpa`, `google-cloud-ml-locations`
  - fields changed: (no claim fields changed)
  - extract rationale: The provided evidence snapshots are truncated navigation/product listings from the Google Cloud DPA page and the Agent Platform locations/API reference page. Neither snapshot contains visible text confirming specific hosting regions (CH/EU/US), certifications, DPA content, training opt-out policy, or pricing tier details. Since the current claim values are not clearly supported by the visible snapshot text, no new or updated fields can be confidently proposed without risking invention of unverified details.
- `infomaniak`
  - sources: `infomaniak-trust`
  - fields changed: `swiss_entity`
  - extract rationale: Trust center confirms Swiss-only data centers, ISO 27001 certification, FINMA Circular 2018/3 compliance mapping, and Infomaniak as an independent Swiss company—consistent with existing claims. No new evidence for dpa_url, training_opt_out, pricing_tier, or eu_entity to update beyond current values.
- `microsoft-azure`
  - sources: `microsoft-azure-openai-privacy`
  - fields changed: (no claim fields changed)
  - extract rationale: Snapshot confirms EU geography deployment options and that customer prompts/completions are not used to train foundation models without permission, consistent with existing claim values. No new evidence for Swiss hosting, certifications, or entity location found.
- `mistral`
  - sources: `mistral-dpa`, `mistral-home`
  - fields changed: `training_opt_out`
  - extract rationale: The DPA explicitly states Mistral AI may train its models on Customer Data 'unless Customer is or has opted-out of training,' confirming a training opt-out option is available. Other existing fields remain consistent with the evidence (EU hosting/entity, DPA URL, usage-based pricing).
- `openai`
  - sources: `openai-business-data`, `openai-dpa`
  - fields changed: `pricing_tier`
  - extract rationale: Snapshot confirms OpenAI offers data residency across EU, US, UK, JP, CA, KR, SG, AU, IN, AE (no CH), default non-training of customer data with opt-in, ISO 27001/27017/27018/27701 and SOC 2 Type 2 certifications, and a DPA contracted via OpenAI Ireland Ltd for EEA/Swiss customers (EU entity) while Swiss customers are also routed to OpenAI Ireland Ltd rather than a dedicated Swiss entity, supporting swiss_entity=false. Pricing remains usage-based per business-data page describing API/ChatGPT paid tiers.
- `ovhcloud`
  - sources: `ovhcloud-ai-endpoints`
  - fields changed: (no claim fields changed)
  - extract rationale: Snapshot confirms AI Endpoints infrastructure is located in Gravelines, France (EU) and complies with European data protection regulations, supporting EU hosting and non-Swiss hosting. It states data is not stored or shared during or after model use, supporting training opt-out. Usage-based metrics (calls, tokens) indicate a usage pricing model. No new evidence found for dpa_url, swiss_entity, eu_entity, or certifications from this source, so those fields are left unchanged.

## Per-source classifications

### `finma-guidance-08-2024-news`

- **Confidence:** medium
- **Dependent pages:** `finma-ai-expectations`
- **Rationale:** Addition of 'Portfolio managers' and 'Trustees' appears to expand the scope/applicability of the FINMA guidance to new categories of supervised institutions, which affects which entities the dependent page's description of expectations applies to.
- **Patch:** `snapshots/_diffs/finma-guidance-08-2024-news.patch`

```diff
Index: snapshots/finma-guidance-08-2024-news.txt
===================================================================
--- snapshots/finma-guidance-08-2024-news.txt
+++ snapshots/finma-guidance-08-2024-news.txt
@@ -213,6 +213,8 @@
 18 December 2024
 Press release
 2024
+Portfolio managers
+Trustees
 
 FINMA guidance on governance and risk management when using artificial intelligence
```

### `consilium-digital-omnibus-ai`

- **Confidence:** high
- **Dependent pages:** `eu-ai-act-swiss-exporters`
- **Rationale:** The diff shows the Digital Omnibus on AI regulation has now been published in the Official Journal (Regulation 2026/1744, OJ L 24.07.2026), with status changing from 'awaiting publication' to 'Procedure completed' and a Final act document added. This is precisely the trigger event noted in the source title instructing a swap to the EUR-Lex consolidated text. This directly affects the dependent page on EU AI Act applicability for Swiss exporters, which should now reference the finalized, published regulation and its effective dates rather than a pending procedure.
- **Patch:** `snapshots/_diffs/consilium-digital-omnibus-ai.patch`

```diff
Index: snapshots/consilium-digital-omnibus-ai.txt
===================================================================
--- snapshots/consilium-digital-omnibus-ai.txt
+++ snapshots/consilium-digital-omnibus-ai.txt
@@ -5,10 +5,10 @@
 
 EN - English
 
-EN - English
-
 FR - français
 
+EN - English
+
 News
 
 Topics
@@ -134,7 +134,7 @@
 Joint Declaration 2026
 
 Status
-Procedure completed, awaiting publication in Official Journal
+Procedure completed
 
 Please go to Documentation gateway for any follow-up documents.
 
@@ -172,28 +172,28 @@
 
 VOSS Axel (EPP)
 
-BENIFEI Brando (S&D)
-
 VIGENIN Kristian (S&D)
 
-BŽOCH Jaroslav (PfE)
+BENIFEI Brando (S&D)
 
 JORON Virginie (PfE)
 
+BŽOCH Jaroslav (PfE)
+
 KANKO Assita (ECR)
 
 MÜLLER Piotr (ECR)
 
 HAHN Svenja (Renew)
 
-GREGOROVÁ Markéta (Greens/EFA)
-
 VAN SPARRENTAK Kim (Greens/EFA)
 
-BARRENA ARZA Pernando (The Left)
+GREGOROVÁ Markéta (Greens/EFA)
 
 CHAIBI Leila (The Left)
 
+BARRENA ARZA Pernando (The Left)
+
 KHAN Mary (ESN)
 
 Committee for opinion
@@ -327,6 +327,9 @@
 08/07/2026
 Final act signed
 
+24/07/2026
+Final act published in Official Journal
+
 Technical information
 
 pdf
@@ -366,7 +369,7 @@
 European Economic and Social Committee
 
 Stage reached in procedure
-Procedure completed, awaiting publication in Official Journal
+Procedure completed
 
 Committee dossier
 
@@ -498,6 +501,12 @@
 
 Summary
 
+Commission response to text adopted in plenary
+
+SP(2026)09-01
+
+01/09/2026
+
 National parliaments
 
 Document type
@@ -623,7 +632,7 @@
 Document
 Date
 
-EP Research Service
+European Parliament
 
 Briefing
 
@@ -667,7 +676,7 @@
 
 19/05/2026
 
-ARD-Verbindungsbüro Brüssel
+ARD-Europabüro
 
 ZDF Europabüro Brüssel
 
@@ -699,7 +708,7 @@
 
 05/05/2026
 
-Wolt Enterprises
+Wolt
 
 MCNAMARA Michael
 
@@ -764,14 +773,8 @@
 
 04/06/2026
 
-Google
+Google Ireland Limited and its affiliates
 
-WÖLKEN Tiemo
-
-07/05/2026
-
-TÜV
-
 WAWRYKIEWICZ Michał
 
 07/05/2026
@@ -782,6 +785,12 @@
 
 AAVIT
 
+WÖLKEN Tiemo
+
+07/05/2026
+
+TÜV
+
 SIPPEL Birgit
 
 29/04/2026
@@ -826,6 +835,16 @@
 
 Load more
 
+Final act
+
+pdf
+
+Final act
+
+Regulation 2026/1744
+
+OJ OJ L 24.07.2026
+
 Procedure file
 
 Basic information
@@ -842,6 +861,8 @@
 
 Transparency
 
+Final act
+
 Share this page
 
 Facebook
```

### `openai-business-data`

- **Confidence:** low
- **Dependent pages:** (none)
- **Rationale:** The diff is truncated and only shows the original content; the actual changed lines are not visible, making it impossible to confirm that hosting, DPA, certification, or pricing facts remained unchanged. Given the bias toward material when context is missing, this should be flagged for review.
- **Patch:** `snapshots/_diffs/openai-business-data.patch`

```diff
Index: snapshots/openai-business-data.txt
===================================================================
--- snapshots/openai-business-data.txt
+++ snapshots/openai-business-data.txt
@@ -1,1 +1,1 @@
-Skip to main contentResearchProductsBusinessDevelopersCompanyFoundation(opens in a new window)Log inTry ChatGPT(opens in a new window)ResearchProductsBusinessDevelopersCompanyFoundation(opens in a new window)Try ChatGPT(opens in a new window)LoginOpenAISafetyBusiness data privacy, security, and complianceTrust, security, and privacy are at the core of our mission at OpenAI. Your organization’s data always remains confidential, secure, and entirely owned by you—across ChatGPT Enterprise, ChatGPT Business, ChatGPT Edu, ChatGPT for Healthcare, ChatGPT for Teachers, and our API platform.OpenAI Trust Portal(opens in a new window)Enterprise privacy commitmentsOpenAI is trusted byOpenAI security and privacyWe don’t train our models on your organization’s data by default.By default, we do not use data from ChatGPT Enterprise, ChatGPT Business, ChatGPT Edu, ChatGPT for Healthcare, ChatGPT for Teachers, or our API platform—including inputs or outputs—for training or improving our models. Our models are trained on publicly available knowledge on the Internet, data provided through third-party partnerships, and information that our researchers provide or generate. If you are interested in helping us improve our models, you can do so through explicit opt-in⁠⁠⁠(opens in a new window) in the API dashboard.Learn how ChatGPT and our models are developed ↗ ⁠(opens in a new window)Your data is encrypted at rest and in transit between you and OpenAI, and between OpenAI and its service providers.Whether you're sending inputs or receiving outputs, your business data remains protected from unauthorized access. We use strong, industry-standard cryptography to protect your data. This includes using AES-256 encryption at rest and TLS 1.2 or higher in transit.With Enterprise Key Management (EKM)⁠(opens in a new window), customers can control their own encryption keys, adding another layer of security and compliance.We offer data retention controls for qualifying organizations to help you stay compliant.Qualifying organizations are able to configure how long OpenAI retains business data, including opting for our zero data retention policy in the API platform.Learn more⁠⁠ about our data retention policies for ChatGPT Enterprise, Business, Edu, ChatGPT for Healthcare, and the API platform⁠⁠(opens in a new window).We build security into our products and infrastructure. Security starts at design. We embrace zero trust and defense in-depth approaches to guide our overall security program. Our software development lifecycle ensures we design and architect security into our products from inception, and we appropriately address risks to our supply chain. We implement layered security controls across our endpoints, infrastructure, networks, and applications. We also invest heavily in research and security for next-generation technologies, such as agents.We protect your data with thorough testing and monitoring.Our OpenAI security team has an on-call rotation 24/7 365 days of the year in case of potential security incidents, with automated alerts and manual investigation processes in place to address suspicious activity. OpenAI’s infrastructure undergoes regular audits, including red team and adversarial assessments, by independent third parties to ensure adherence to the highest security standards.Compliance and governanceWe adhere to industry standards and regulatory compliance requirements.OpenAI’s data protection practices support your compliance with GDPR, CCPA, and other privacy laws, and align with CSA STAR⁠⁠(opens in a new window), SOC 2 Type 2 Trust Services Criteria⁠⁠(opens in a new window), and ISO/IEC 27001⁠(opens in a new window), 27017⁠(opens in a new window), 27018⁠(opens in a new window), 27701⁠(opens in a new window) certifications. We offer a Bu

… truncated …
```

### `openai-dpa`

- **Confidence:** low
- **Dependent pages:** (none)
- **Rationale:** Diff is truncated and affects the OpenAI DPA page, which contains vendor compliance facts (hosting, DPA terms, certifications). Lack of visible context means potential substantive changes cannot be ruled out, so bias toward material per policy.
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
- **Rationale:** The diff is truncated, so the actual content changes cannot be fully verified. Given this source tracks vendor compliance facts like hosting, DPA, pricing, and certifications, and the diff content is hidden/truncated, bias toward material to ensure human review of potential substantive changes.
- **Patch:** `snapshots/_diffs/anthropic-regional-compliance.patch`

```diff
Index: snapshots/anthropic-regional-compliance.txt
===================================================================
--- snapshots/anthropic-regional-compliance.txt
+++ snapshots/anthropic-regional-compliance.txt
@@ -1,4 +1,4 @@
-Meet ClaudeProductsClaudeClaude CodeClaude Cowork@ClaudeFeaturesClaude for ChromeClaude for Microsoft 365SkillsClaude apps built forDesignScienceSecurityModelsMythosFableOpusSonnetHaikuPlatformBuild on ClaudeOverviewPricingDeveloper docsConsole loginWorks with ClaudeEcosystemMarketplaceConnectorsPluginsSolutionsUse casesAI agentsCodingCompany sizeEnterpriseStartupsDepartmentsCybersecurityLegalIndustriesCustomer supportFinancial servicesGovernmentHealthcareHigher educationK-12 teachersLife sciencesNonprofitsPricingOverviewAPIResourcesInsightsBlogCustomer storiesAnthropic newsLearnAnthropic AcademyCoursesTutorialsUse casesConnectEventsCommunityLoginContact salesContact salesContact salesTry ClaudeTry ClaudeTry ClaudeContact salesContact salesContact salesTry ClaudeTry ClaudeTry ClaudeContact salesContact salesContact salesTry ClaudeTry ClaudeTry ClaudeContact salesContact salesContact salesTry ClaudeTry ClaudeTry ClaudeMeet ClaudeProductsClaudeClaude CodeClaude Cowork@ClaudeFeaturesClaude for ChromeClaude for Microsoft 365SkillsClaude apps built forDesignScienceSecurityModelsMythosFableOpusSonnetHaikuPlatformBuild on ClaudeOverviewPricingDeveloper docsConsole loginWorks with ClaudeEcosystemMarketplaceConnectorsPluginsSolutionsUse casesAI agentsCodingCompany sizeEnterpriseStartupsDepartmentsCybersecurityLegalIndustriesCustomer supportFinancial servicesGovernmentHealthcareHigher educationK-12 teachersLife sciencesNonprofitsPricingOverviewAPIResourcesInsightsBlogCustomer storiesAnthropic newsLearnAnthropic AcademyCoursesTutorialsUse casesConnectEventsCommunityLoginContact salesContact salesContact salesTry ClaudeTry ClaudeTry ClaudeContact salesContact salesContact salesTry ClaudeTry ClaudeTry ClaudePlatformPlatform/Regional complianceExplore hereAsk questions about this pageCopy as markdownDeploy Claude confidently, wherever you areClaude is available globally with regional data residency and inference, comprehensive compliance certifications, and deployment across all major cloud platforms.Contact salesContact salesContact salesVisit Trust CenterVisit Trust CenterVisit Trust CenterBuilt for regulated industries, worldwideTrusted  complianceOrganizations in highly regulated industries trust Claude to handle their most sensitive work while meeting strict regional compliance requirements.Flexible deploymentWhether you're a startup navigating your first audit or a Fortune 500 company with global operations, Claude’s deployment options meet you where you are.Safety-firstAnthropic's safety-first approach to AI extends to how we protect and process your data, from technical deployment to operational practices.Flexible deployment, data storage, and inference processingMeet your regional data residency and compliance requirements with Claude. Choose where your data is stored and processed. Available on AWS Bedrock, GCP Vertex, and Microsoft Foundry.Claude's regional availabilityRegionAWS BedrockSpecificationsGCP VertexSpecificationsMicrosoft FoundrySpecificationsAsia-PacificAWS BedrockSpecificationsGCP VertexSpecificationsMicrosoft FoundrySpecificationsComing 2026CanadaAWS BedrockSpecificationsGCP VertexSpecificationsMicrosoft FoundrySpecificationsComing 2026EuropeAWS BedrockSpecificationsGCP VertexSpecificationsMicrosoft FoundrySpecificationsComing 2026United StatesAWS BedrockSpecificationsGCP VertexSpecificationsMicrosoft FoundrySpecificationsUnderstand data residency  and inferenceClaude gives you control over where your data is stored, requests are processed, and responses are generated.Data residencyControls where prompts, outputs, and conversation history are stored.Inference residencyControls where Claude processes requests and generates responses.Trusted across  regulated sectorsOrganizations in financi

… truncated …
```

### `google-cloud-dpa`

- **Confidence:** medium
- **Dependent pages:** (none)
- **Rationale:** The change updates the referenced data center/data residency location URL for SecOps Services, which pertains to hosting/data residency information relevant to vendor compliance facts. Since this affects where customers find authoritative data residency details, it could reflect a substantive change in documentation structure or content relevant to hosting locations, warranting review.
- **Patch:** `snapshots/_diffs/google-cloud-dpa.patch`

```diff
Index: snapshots/google-cloud-dpa.txt
===================================================================
--- snapshots/google-cloud-dpa.txt
+++ snapshots/google-cloud-dpa.txt
@@ -4126,7 +4126,7 @@
 Law.
 3. Data Center Locations. The locations of SecOps
 Services data centers are described
-at https://www.google.com/about/datacenters/locations/.
+at https://cloud.google.com/terms/secops/data-residency.
 
 4. No Certification by Non-EMEA Customers. Customer
 is not obliged to certify or identify its competent
```

### `google-cloud-ml-locations`

- **Confidence:** medium
- **Dependent pages:** (none)
- **Rationale:** The diff shows substantive API surface changes (new resources like servingProfiles, interactions, memoryBanks.ingestEvents, new methods like authorizeAccess, bidiExecute, getIamPolicy/setIamPolicy, retrieveProfiles, SDK version migration guide additions) beyond navigation/boilerplate restructuring. These reflect actual product capability changes that could affect vendor capability claims, and the diff is truncated so additional substantive changes may be hidden.
- **Patch:** `snapshots/_diffs/google-cloud-ml-locations.patch`

```diff
Index: snapshots/google-cloud-ml-locations.txt
===================================================================
--- snapshots/google-cloud-ml-locations.txt
+++ snapshots/google-cloud-ml-locations.txt
@@ -1,9 +1,53 @@
 Skip to main content
 
-Technology areas
+Documentation
 
 close
 
+Get Started
+
+Get Started with Google Cloud
+
+Product List
+
+Cloud Customer Care
+
+Featured Products
+
+Agent Platform
+
+Apigee API Management
+
+BigQuery
+
+Compute Engine
+
+Cloud CDN
+
+Cloud Run
+
+Cloud Storage
+
+Cloud SQL
+
+Gemini Enterprise
+
+Google Kubernetes Engine
+
+Looker
+
+Cross-product Tools
+
+Access and resources management
+
+Costs and usage management
+
+Infrastructure as code
+
+SDK, languages, frameworks, and tools
+
+Technology Areas
+
 AI and ML
 
 Application development
@@ -30,18 +74,6 @@
 
 Storage
 
-Cross-product tools
-
-close
-
-Access and resources management
-
-Costs and usage management
-
-Infrastructure as code
-
-SDK, languages, frameworks, and tools
-
 /
 
 Console
@@ -94,7 +126,7 @@
 
 Engineering Blog
 
-Technology areas
+Documentation
 
 More
 
@@ -114,10 +146,6 @@
 
 Engineering Blog
 
-Cross-product tools
-
-More
-
 Console
 
 Home
@@ -134,12 +162,15 @@
 
 Notebooks
 
+CodeMender
+OverviewInstall and configure the CLIScan and verify code vulnerabilitiesImport third-party security findingsFix code vulnerabilities and manage diffsManage sessions and export reports
+
 API reference
 
 All APIs and reference
 
 gcloud CLI reference
-gcloud aigcloud beta aigcloud colabgcloud beta colab
+gcloud aigcloud beta aigcloud colabgcloud beta colabgcloud network-services agent-gatewaysgcloud beta network-services agent-gateways
 
 Client libraries
 
@@ -147,7 +178,7 @@
 OverviewPythonGoJavaNode.jsC#
 
 Agent Platform SDK
-IntroductionInstall the SDK for PythonPythonGoJavaNode.jsC#
+IntroductionPython version 2.0.1 migration guideInstall the SDK for PythonPythonGoJavaNode.jsC#
 
 Agent Platform in express mode
 Express mode REST API reference
@@ -207,6 +238,9 @@
 projects.locations.endpoints
 OverviewcomputeTokenscountTokenscreatedeletedeployModeldirectPredictdirectRawPredictexplaingenerateContentgetlistmutateDeployedModelpatchpredictrawPredictserverStreamingPredictstreamGenerateContentstreamRawPredictundeployModelupdate
 
+projects.locations.endpoints.responses
+Overviewdeleteget
+
 projects.locations.featureGroups
 OverviewcreatedeletegetgetIamPolicylistpatchsetIamPolicytestIamPermissions
 
@@ -297,6 +331,9 @@
 projects.locations.publishers.models
 OverviewcomputeTokenscountTokensembedContentgenerateContentpredictrawPredictserverStreamingPredictstreamGenerateContentstreamRawPredict
 
+projects.locations.publishers.v1.responses
+Overviewdeleteget
+
 projects.locations.ragCorpora
 Overviewcreatedeletegetlistpatch
 
@@ -304,7 +341,7 @@
 Overviewdeletegetimportlist
 
 projects.locations.reasoningEngines
-OverviewasyncQuerycancelAsyncQuerycreatedeleteexecuteCodegetlistpatchquerystreamQuery
+OverviewasyncQuerycancelAsyncQuerycreatedeleteexecuteCodegetgetIamPolicylistpatchquerysetIamPolicystreamQuerytestIamPermissions
 
 projects.locations.reasoningEngines.runtimeRevisions
 OverviewquerystreamQuery
@@ -316,7 +353,7 @@
 Overviewcreatedeletegetlist
 
 projects.locations.reasoningEngines.sandboxEnvironments
-Overviewcreatedeleteexecutegetlistpauseresumesnapshot
+OverviewauthorizeAccesscreatedeleteexecutegetlistpauseresumesnapshot
 
 projects.locations.reasoningEngines.sessions
 OverviewappendEventcreatedeletegetlistpatch
@@ -333,6 +370,9 @@
 projects.locations.semanticGovernancePolicyEngine
 Overviewdeprovision
 
+projects.locations.servingProfiles
+Overviewcreatedeletegetlistpatch
+
 projects.locations.specialistPools
 Overviewcreatedeletegetlistpatch
 
@@ -387,12 +427,15 @@
 reasoningEngines.ws.v1beta1.projects.locations.reasoningEngines.revisions.runtimeRevisions.api
 OverviewbidiInvokeReasoningEngine
 Types
-AnnotationApiKeyConfigAssignNotebookRuntimeOperationMetadataAutomaticResourcesBatchCreateFeaturesOperationMe

… truncated …
```

### `microsoft-azure-openai-privacy`

- **Confidence:** medium
- **Dependent pages:** (none)
- **Rationale:** The change replaces a simple email contact for reporting problematic content with a substantially different and more detailed security/safety vulnerability reporting process (pointing to MSRC, specifying vulnerability types like prompt injection, unsafe output, data exposure, and required reporting details). This is a substantive change to vendor compliance/support process documentation, not just cosmetic wording.
- **Patch:** `snapshots/_diffs/microsoft-azure-openai-privacy.patch`

```diff
Index: snapshots/microsoft-azure-openai-privacy.txt
===================================================================
--- snapshots/microsoft-azure-openai-privacy.txt
+++ snapshots/microsoft-azure-openai-privacy.txt
@@ -26,7 +26,7 @@
 
 Add
 
-Add to plan
+Add to Plans
 
 Edit
 
@@ -186,7 +186,7 @@
 Compare Foundry Models sold by Azure in Azure Government
 Limited access to Azure OpenAI Service
 Report abuse of Azure OpenAI Service through the Report Abuse Portal
-Report problematic to cscraireport@microsoft.com
+Report a security or safety issue: Security researchers and customers play a crucial role in protecting AI. To report security vulnerabilities or safety problems in Foundry Models sold by Azure, go to the Microsoft Security Response Center (MSRC). Examples of vulnerabilities include prompt injection, unsafe output, and data exposure. When reporting a problem, include the model name and version, the steps that led to the problem, and the potential impact.
 
 Feedback
```

### `mistral-dpa`

- **Confidence:** high
- **Dependent pages:** (none)
- **Rationale:** The diff shows the entire DPA content replaced/removed (truncated to near-empty), with only a single line remaining and the rest deleted. This represents a drastic change to vendor DPA terms (obligations, subprocessor terms, security, transfer mechanisms all removed/altered in the diff), which directly affects dependent compliance claims about Mistral's DPA terms. Given truncation and inability to confirm final content, bias toward material.
- **Patch:** `snapshots/_diffs/mistral-dpa.patch`

```diff
Index: snapshots/mistral-dpa.txt
===================================================================
--- snapshots/mistral-dpa.txt
+++ snapshots/mistral-dpa.txt
@@ -1,178 +1,1 @@
-Legal CenterTermsAI GovernanceData Processing AddendumEffective:March 12, 2026VersionsTermsGet startedFor ConsumersEU - Terms of ServiceROW - Terms of ServiceFor Commercial CustomersCommercial Terms of ServiceAdditional Product TermsPartner-served deployment termsAdditional Terms for Use of Mistral AI Products on Customer InfrastructureData Processing AddendumFor PartnersConnectors termsFor EveryonePrivacy PolicyUsage PolicyCookie PolicyLicense NoticeApplicant Privacy PolicyThis Data Processing Addendum (the “Data Processing Addendum” or the “DPA”) forms part of and supplements the Agreement entered into by and between Mistral AI and Customer as of the Effective Date. 
-1. Definitions
-For the purposes of this Data Processing Addendum:
-(a) “Agreement” means the service agreement entered into by and between the Parties, governing the provision of the Mistral AI Products by Mistral AI to the Customer. The DPA is hereby incorporated to the Agreement by reference.
-(b) “Applicable Data Protection Law” means any applicable privacy, data security, or data protection law or regulation, including, to the extent applicable, Regulation (EU) 2016/679 of the European Parliament and of the Council of 27 April 2016 applicable since 25 May 2018 (the “GDPR”) and the California Consumer Privacy Act of 2018, as amended, and associated regulations promulgated thereunder (“CCPA”).
-(c) “Description of Processing” means the Description of Processing attached to the Data Processing Addendum available at https://legal.mistral.ai/terms/data-processing-addendum (as such URL may be updated by Mistral AI from time to time.
-(d) “International Data Transfer” means any transfer of Personal Data to a Restricted Country.
-(e) “Mistral AI Products” means the products and services provided by Mistral AI to the Customer under the Agreement.
-(f) “Personal Data” means any Customer Data that: (a) consists of “personal data” or “personal information” (or analogous variations of such terms) as defined under Applicable Data Protection Law, and (b) which Mistral AI Processes as a Processor, as further described in the Agreement.
-(g) “Process” or “Processing” means the processing of Personal Data as described in the Description of Processing.
-(h) “Restricted Country” means any country located outside of the European Economic Area (EEA) and that does not benefit from an adequacy decision from the European Commission.
-(i) “SCC” means the clauses annexed to the EU Commission Implementing Decision 2021/914 of June 4, 2021 on standard contractual clauses for the transfer of personal data to third countries pursuant to the GDPR, the text of which is available at: https://eur-lex.europa.eu/eli/dec_impl/2021/914/oj?uri=CELEX:32021D0914.
-(j) “Subprocessor” means any Processor appointed by Mistral AI to carry-out all or part of the Processing on behalf of the Customer.
-(k) “Trust Center” means the Mistral AI Trust Center available at https://trust.mistral.ai/ (as such URL may be updated by Mistral AI from time to time).
-The terms “Controller”, “Processor”, “Data Subjects”, and “Personal Data Breach”, (in each case, or analogous variations thereof as defined in Applicable Data Protection Law) as used in this Agreement will have the meanings in the Applicable Data Protection Law, and if not defined, then as defined under GDPR. The capitalized terms not defined herein shall have the meaning given in the Agreement.
-2. Role of the Parties and description of the Processing
-2.1 Role of the Parties
-Customer is the Controller of the Personal Data. Mistral AI Processes the Personal Data on behalf of Customer as a Processor.
-2.2 Description of the Processing
-A description of the Processing is available in the Description of Processing. Mistral AI may update the Description of the Processing from tim

… truncated …
```

### `mistral-home`

- **Confidence:** medium
- **Dependent pages:** (none)
- **Rationale:** Beyond cosmetic nav/formatting changes, the diff introduces new substantive content: a major funding/news item ('Mistral raises €3B... sovereign, open-weight AI... new European infrastructure'), a new product (Shieldstral), a new 'AI Cloud' branding replacing 'Compute', a new Energy & Utilities industry vertical, new partner/customer references (TotalEnergies replacing BMW, Mozilla/Cloudera partnerships), and a new 'Trust Center' link in the footer alongside legal/DPA links. These touch on hosting infrastructure claims, certifications/trust resources, and vendor capability/customer claims relevant to compliance tracking, so this should be treated as material and reviewed.
- **Patch:** `snapshots/_diffs/mistral-home.patch`

```diff
Index: snapshots/mistral-home.txt
===================================================================
--- snapshots/mistral-home.txt
+++ snapshots/mistral-home.txt
@@ -1,10 +1,10 @@
-Contact sales
+Get in touch
 
 Menu
 
 Products
 
-Solutions
+Industries
 
 Research
 
@@ -16,46 +16,44 @@
 
 Company
 
-Contact sales
+Get in touch
 
-Start building
+Login
 
-Studio Build, test, and run AI agents and apps.
+StudioBuild, test, and run AI agents and apps.
 
-Forge Train, align, and evaluate custom AI models.
+ForgeTrain, align, and evaluate custom AI models.
 
-Vibe AI agent for long-horizon work.
+VibeAI agent for long-horizon work.
 
-Vibe for code Coding agents in the terminal, IDE, and background.
+Vibe for codeCoding agents in the terminal, IDE, and background.
 
-Compute Frontier-scale infrastructure for training and inference.
+AI CloudFrontier-scale infrastructure for training and inference.
 
-Pricing Plans
+PricingPlans
 
 API pricing
 
 For enterprises
 
-Services
+Financial services
 
-Delivery methodology
-
-Model customization
-
-Industries Financial services
-
 Public sector & government
 
 Manufacturing
 
-Use cases Use case overview
+Energy & utilities
 
-Coding
+DomainsCoding
 
 Document intelligence
 
 Speech
 
+Applied AIDelivery methodology
+
+Model customization
+
 Latest models
 
 Mistral OCR 4
@@ -76,15 +74,15 @@
 
 Latest posts
 
-Your Prompts and Skills need a system of record.
+Hallo, Deutschland!
 
-Introducing Robostral Navigate
+Mistral and Mozilla are bringing open, private and multilingual AI to your web browser
 
-Leanstral 1.5: Proof Abundance for All
+Cloudera and Mistral Partner to Bring Specialized, Sovereign Intelligence to Enterprise Data
 
 Read all news
 
-Categories Product
+CategoriesProduct
 
 Research
 
@@ -102,7 +100,7 @@
 
 HSBC
 
-BMW
+TotalEnergies
 
 See all
 
@@ -114,50 +112,48 @@
 
 Brand
 
-Connect Community
+ConnectCommunity
 
 Partners
 
 Help center
 
-ProductsSolutionsResearchDevelopersBlogCustomersCompany
+ProductsIndustriesResearchDevelopersBlogCustomersCompany
 
-Studio Build, test, and run AI agents and apps.
+StudioBuild, test, and run AI agents and apps.
 
-Forge Train, align, and evaluate custom AI models.
+ForgeTrain, align, and evaluate custom AI models.
 
-Vibe AI agent for long-horizon work.
+VibeAI agent for long-horizon work.
 
-Vibe for code Coding agents in the terminal, IDE, and background.
+Vibe for codeCoding agents in the terminal, IDE, and background.
 
-Compute Frontier-scale infrastructure for training and inference.
+AI CloudFrontier-scale infrastructure for training and inference.
 
-Pricing Plans
+PricingPlans
 
 API pricing
 
 For enterprises
 
-Services
+Financial services
 
-Delivery methodology
-
-Model customization
-
-Industries Financial services
-
 Public sector & government
 
 Manufacturing
 
-Use cases Use case overview
+Energy & utilities
 
-Coding
+DomainsCoding
 
 Document intelligence
 
 Speech
 
+Applied AIDelivery methodology
+
+Model customization
+
 Latest models
 
 Mistral OCR 4
@@ -178,15 +174,15 @@
 
 Latest posts
 
-Your Prompts and Skills need a system of record.
+Hallo, Deutschland!
 
-Introducing Robostral Navigate
+Mistral and Mozilla are bringing open, private and multilingual AI to your web browser
 
-Leanstral 1.5: Proof Abundance for All
+Cloudera and Mistral Partner to Bring Specialized, Sovereign Intelligence to Enterprise Data
 
 Read all news
 
-Categories Product
+CategoriesProduct
 
 Research
 
@@ -204,7 +200,7 @@
 
 HSBC
 
-BMW
+TotalEnergies
 
 See all
 
@@ -216,13 +212,13 @@
 
 Brand
 
-Connect Community
+ConnectCommunity
 
 Partners
 
 Help center
 
-Start building
+Login
 
 Studio
 
@@ -230,44 +226,48 @@
 
 Vibe for Code
 
-Contact sales
+Get in touch
 
 Frontier AI.
-In your hands. Frontier AI.In your hands. We help organizations build tailored AI systems to solve the world’s hardest problems. Featured news Introducing Robostral Navigate
+In your hands.Frontier AI.In your hands.We help organizations build tai

… truncated …
```

### `infomaniak-trust`

- **Confidence:** low
- **Dependent pages:** (none)
- **Rationale:** The diff is truncated and contains the full page content as a single-line replacement, making it impossible to verify that compliance-relevant claims (certifications, FINMA mapping, DPA terms, data residency) are unchanged. Given the bias toward material on uncertainty and the explicit truncation warning, this should be treated as material pending full review.
- **Patch:** `snapshots/_diffs/infomaniak-trust.patch`

```diff
Index: snapshots/infomaniak-trust.txt
===================================================================
--- snapshots/infomaniak-trust.txt
+++ snapshots/infomaniak-trust.txt
@@ -1,1 +1,1 @@
-Our productsCollaborative toolsWeb & DomainsCloud ComputingEvents & MarketingStreamingkDrive Store, collaborate and share your fileskChat Communicate live with your teamsSwissTransfer Send your files up to 50 GB free of chargeCustom Brand Control the brand image of your productsMail Service Create your email addresses with your domainkMeet Organise your meetings online in complete securitykPaste Share and encrypt your sensitive informationChk Link reducer & QR code generatorCollaborative suiteDiscover the collaborative suitekSuite PROFor organisations that want to collaborate in a 100% sovereign ecosystemkSuite For individuals who want an ethical email address, drive and AI, free for lifeEuria, the ethical AI The sovereign AI assistant that respects privacy and the planet.Find the web hosting solution you needCompare our web hosting solutionsDomain Name Reserve your domain name at the best priceWeb Hosting Create your website with over 100 CMSCloud Server Power up your sites with guaranteed resourcesSSL Certificates Secure your websites with an EV or DV certificateSite Creator Create your website with easeWordpress Hosting Create your WordPress website easilyNode.js Hosting Create a dynamic, interactive site with Node.jsOptionsDomain Privacy Protect your domains’ private dataFastAnycast DNS Speed up your site access timesDynDNS Access your devices remotelyRenewal Warranty Secure your domains against loss and theftCloud servicesCloud ComputingCompare our products and services and create the right cloud for your needsCompare our solutionsPublic Cloud (IaaS) Create your projects in a high-end, ultra-competitive CloudVPS Cloud Create a Windows / Linux serverKubernetes Service Deploy containerised apps on a large scaleVPS Lite Create a Windows/Linux server at a low costDatabase Service Manage your databases with a managed solutionJelastic Cloud (PaaS) Create your own customised environmentsOther servicesAI Services Boost your productivity with our sovereign AISwiss Backup Back up your devices in the CloudNAS Synology Rent a NAS in our secure data centersVery High Availability Create a multi-data center infrastructure with customised SLAsHousing Install your servers in our data centersAuth Add a privacy-friendly login method to your appsInfomaniak Events, the independent local events portalOnline ticketing service with a wide choice of concerts, shows and events.Discover all the eventsTicketing Create your ticketing service and sell ticketsAccess Control Control access to your events with easeGuest manager Automate your event invitationsNewsletter Send your newsletters at competitive pricesStreaming radio Create and broadcast your own live radio station onlineVideo-Streaming Create and broadcast live events and TV onlineVOD & AOD service Host and broadcast your recordings without limitsResourcesDocumentationGuides & tutorialsAPI documentationSpecial offersGet started for freeStudent programmeBecome an affiliatePartner programmeFind a partnerBecome a partnerInfomaniak AcademySupport & contactContact SupportPremium support - 24/7Contact our sales departmentHiring an expertMigrate to InfomaniakAbout usInfomaniak’s valuesResponsibility, Social and LocalDigital sovereigntyLong-term commitmentAbout InfomaniakAbout usGovernanceInvestorsInfomaniak is recruitingBlog and newsImpact report 2024Your securityData confidentialityBug Bounty ProgramTrust centerGet started for freeLog inTrust centerOverviewSecurity through total controlLearn more about how we put security, confidentiality and compliance at the heart of our services to ensure your data is protected.Explore our security modelsYour data.Under your control.Always.At Infomaniak, we control the entire chain of our solutions. This is the only way to guarantee that your data truly remains yours.Marc O

… truncated …
```

### `cohere-trust`

- **Confidence:** high
- **Dependent pages:** (none)
- **Rationale:** Beyond wording fixes, the diff shows substantive changes: a new UK Cyber Essentials certificate entity (Cohere UK, LTD) was added, the 'Cohere Secure AI Frontier Model Framework' and 'Usage Policy' documents were removed and replaced with an 'EU AI Act FAQs' document, and numerous specific security/compliance controls (e.g., Background Checks, New Hire Screening, Risk Register, Lessons Learned, Retention of Customer Data, Physical Access Reviews, Visitor Control) were removed from the listed control set while control counts changed. These affect certification scope, compliance documentation, and control coverage claims relevant to dependent vendor-risk content.
- **Patch:** `snapshots/_diffs/cohere-trust.patch`

```diff
Index: snapshots/cohere-trust.txt
===================================================================
--- snapshots/cohere-trust.txt
+++ snapshots/cohere-trust.txt
@@ -13,7 +13,7 @@
 Compliance
 
 SOC 2 Type 2
-Service Organization Controls (Soc2) (Type II) Trust Services Principles
+Service Organization Controls (SOC 2) (Type II) Trust Services Principles
 Request
 
 ISO 27001
@@ -25,7 +25,7 @@
 Request
 
 U.K. Cyber Essentials
-U.K. Gov't backed Cybersecurity standard
+U.K. Gov't-backed Cybersecurity Standard
 Request
 
 GDPR
@@ -55,11 +55,15 @@
 Request
 
 U.K. Cyber Essentials
-Cohere's official issued certificate
+Certificate for Cohere Inc.
 Request
 
+U.K. Cyber Essentials
+Certificate for Cohere UK, LTD
+Request
+
 Latest Penetration Test Report
-API penetration test results
+API Penetration Test Results
 Request
 
 Latest Penetration Test Report
@@ -71,17 +75,13 @@
 Download
 
 Cohere Enterprise Data Commitments
-Overview of how Cohere handles and protects our Enterprise Customers' Data
+
 Visit
 
-Cohere Secure AI Frontier Model Framework
-This document outlines Cohere's risk management methodology for managing risks to our models.
+EU AI Act FAQs
+FAQs regarding the GPAI Code of Practice
 Download
 
-Usage Policy
-This policy outlines the acceptable use cases for Cohere’s models and products by customers
-Visit
-
 View allSubprocessors
 
 Google Cloud
@@ -174,7 +174,7 @@
 
 Configuration and Asset Management Policy
 
-View 2 more controls
+View 3 more controls
 Availability
 
 Backup Restoration Testing
@@ -188,11 +188,11 @@
 
 Acceptable Use Policy
 
-Internal Control Monitoring
-
 Performance Review Policy
 
-View 12 more controls
+Internal Control Policy
+
+View 9 more controls
 Confidentiality
 
 Data Classification Policy
@@ -201,7 +201,6 @@
 
 Disposal of Customer Data
 
-View 1 more control
 Vulnerability Management
 
 Vulnerability and Patch Management Policy
@@ -212,20 +211,17 @@
 
 Incident Response Plan Testing
 
-Tracking a Security Incident
+Incident Response Plan
 
-Lessons Learned
-
-View 1 more control
 Risk Assessment
 
 Vendor Risk Assessment
 
-Risk Register
-
 Risk Assessment
 
-View 3 more controls
+Vendor Risk Management Policy
+
+View 2 more controls
 Network Security
 
 Automated Alerting for Security Events
@@ -243,14 +239,8 @@
 View 3 more controls
 Physical Security
 
-Visitor Control
-
-Physical Access Restrictions
-
 Physical Security Policy
 
-View 1 more control
-
 View allPowered by
 
 Monitoring
@@ -269,6 +259,9 @@
 Secure Development Policy
 A Secure Development Policy defines the requirements for secure software and system development and maintenance.
 
+Software Change Testing
+Software changes are tested prior to being deployed into production.
+
 Segregation of Environments
 Development, staging, and production environments are segregated.
 
@@ -294,15 +287,9 @@
 Acceptable Use Policy
 An Acceptable Use Policy defines standards for appropriate and secure use of company hardware and electronic systems including storage media, communication tools and internet access.
 
-Internal Control Monitoring
-A continuous monitoring solution monitors internal controls used in the achievement of service commitments and system requirements.
-
 Performance Review Policy
 A Performance Review Policy provides personnel context and transparency into their performance and career development processes.
 
-Background Checks
-Background checks or their equivalent are performed before or promptly after a new hires start date, as permitted by local laws.
-
 Internal Control Policy
 An Internal Control Policy identifies how a system of controls should be maintained to safeguard assets, promote operational efficiency, and encourage adherence to prescribed managerial policies.
 
@@ -312,9 +299,6 @@
 Independent Advisor
 The board of directors or equivalent entity function includes senior management and external advisors, who are independent from the company's operations. An information security team has al

… truncated …
```

### `cohere-enterprise-data`

- **Confidence:** low
- **Dependent pages:** (none)
- **Rationale:** Diff is truncated with limited visible context on vendor data commitments page covering hosting, DPA, certifications, or pricing. Per bias and guidance, truncated diffs with potentially missing context should default to material to avoid missing substantive changes to vendor compliance claims.
- **Patch:** `snapshots/_diffs/cohere-enterprise-data.patch`

```diff
Index: snapshots/cohere-enterprise-data.txt
===================================================================
--- snapshots/cohere-enterprise-data.txt
+++ snapshots/cohere-enterprise-data.txt
@@ -1,1 +1,1 @@
-ProductsProducts Workplace SystemsNorthAn enterprise-ready AI platform that powers modern workplace productivityCompassAn intelligent search and discovery system to surface business insightsGenerative ModelsCommandNEWHigh-performance models for agentic, multimodal, multilingual AITranscribeNEWA speech recognition model for generating highly accurate audio transcriptsNorth Mini CodeNEWAgentic coding model, built for practical software engineeringAdvanced Retrieval ModelsEmbedA leading multimodal search and retrieval toolRerankA powerful model that provides a semantic boost to search qualityCustomizationPricingModels OverviewSolutionsIndustriesTechnologyFinancial ServicesHealthcare and Life SciencesManufacturingEnergy and UtilitiesPublic SectorTelecommunicationsModel VaultYour dedicated, secure model inference platform — managed by CohereSecurityPrivate DeploymentsResearchCohere LabsCohere's research lab that seeks to solve complex ML problemsModelAyaRESOURCESPapersVideosBlogInitiativesOpen Science CommunityScholars ProgramCatalyst Grant ProgramGlobal MMLUThe Leaderboard IllusionEventsResourcesResourcesBlogDevelopersDocsLLM UniversityCookbooksCommunityDiscordEventsOn-Demand EventsMerch StoreCustomer StoriesExplore enterprise AI case studies and success storiesCompanyCompanyAboutCareersNewsroomPartnersSign inContact usProductsProducts overviewWorkplace SystemsNorthAn enterprise-ready AI platform that powers modern workplace productivityCompassAn intelligent search and discovery system to surface business insightsGenerative ModelsCommandNEWHigh-performance models for agentic, multimodal, multilingual AITranscribeNEWA speech recognition model for generating highly accurate audio transcriptsNorth Mini CodeNEWAgentic coding model, built for practical software engineeringAdvanced Retrieval ModelsEmbedA leading multimodal search and retrieval toolRerankA powerful model that provides a semantic boost to search qualityCustomizationPricingModels OverviewSolutionsIndustriesTechnologyFinancial ServicesHealthcare and Life SciencesManufacturingEnergy and UtilitiesPublic SectorTelecommunicationsModel VaultYour dedicated, secure model inference platform — managed by CohereSecurityPrivate DeploymentsResearchCohere LabsCohere's research lab that seeks to solve complex ML problemsModelAyaRESOURCESPapersVideosBlogInitiativesOpen Science CommunityScholars ProgramCatalyst Grant ProgramGlobal MMLUThe Leaderboard IllusionEventsResourcesResourcesBlogDevelopersDocsLLM UniversityCookbooksCommunityDiscordEventsOn-Demand EventsMerch StoreCustomer StoriesExplore enterprise AI case studies and success storiesCompanyCompanyAboutCareersNewsroomPartnersContact usSign inLast Update: December 5, 2025Enterprise Data CommitmentsCohere maintains robust controls to protect enterprise data and respect our enterprise customers’ rights regarding their data.Control Your DataCohere offers several deployment solutions to meet the diverse needs of enterprise customers. Bring Cohere models or our workplace systems North and Compass to your data with private deployments and deployments on third-party cloud AI/ML platforms. You can also use the Cohere SaaS Platform to leverage Cohere-managed infrastructure.In third-party cloud AI/ML platforms and private deployment solutions, Cohere does not receive any customer inputs (prompts) or outputs (generations).Keep reading to learn more about our robust enterprise data controls in the Cohere SaaS Platform.Opt Out from Data Use in TrainingYou can opt out from your prompts and generations being used to train Cohere models in your dashboard settings at any time.To verify and update your settings, select “Data Controls” under your Settings in the left hand menu bar of the Cohere Platform. Adjust the toggle to ‘Off’ to opt out.Robus

… truncated …
```

### `exoscale-compliance`

- **Confidence:** high
- **Dependent pages:** (none)
- **Rationale:** Beyond extensive navigation/menu restructuring (cosmetic), the diff adds a new datacenter zone ES-MAD-1 with its own certification set (ISO 27001, ISO 9001, ISO 20000, ISO 22301) to the compliance/certifications table — a substantive addition to hosting regions and certification scope that dependent vendor-comparison content should reflect.
- **Patch:** `snapshots/_diffs/exoscale-compliance.patch`

```diff
Index: snapshots/exoscale-compliance.txt
===================================================================
--- snapshots/exoscale-compliance.txt
+++ snapshots/exoscale-compliance.txt
@@ -1,77 +1,578 @@
-Newsletter
+Skip to main content
+
 Blog
-Partner Programs
-Academy
-Contact us
 
+Changelog
+
+Documentation
+
+Newsletter
+
+Support
+
+Contact Us
+
 Exoscale
 
 Products
 
-Compute Instances
-Concrete AI
-Managed Kubernetes
-DBaaS
+ComputeVirtual machines, GPUs and Kubernetes
+
+Concrete AIOur AI infrastructure suite, from GPUs to inference endpoints
+
+StorageStore any volume of data in Europe
+
+DBaaSOpen-source database and analytics engines, fully operated
+
+NetworkingConnect, route and protect your traffic
+
+SecurityKeys, access and encryption
+
+Compute InstancesSSD-backed VMs billed by the second
+
+GPU Servers1 to 8 NVIDIA cards per instance
+
+Managed KubernetesExoscale runs the control plane
+
+Concrete AI OverviewThe whole AI suite at a glance
+
+Inference
+
+Dedicated InferenceAny model as an API on dedicated GPUs
+
+On-Demand InferencePay-as-you-go AI model catalog
+
+GPUs and Databases
+
+GPU Servers1 to 8 NVIDIA cards per instance
+
+Vector DatabasesStore and search AI embeddings
+
 Object Storage
+
+Object StorageS3-compatible storage across 8 European zones
+
+Archival StorageCold archives and long-term backups
+
 Block Storage
-GPU Servers
 
-All products
+Block StoragePersistent volumes you can reattach to other instances
 
-Marketplace
+Managed DatabasesPlans, pricing and how DBaaS works
 
-Pricing
+Relational
 
+PostgreSQLThe feature-rich open-source relational database
+
+MySQLThe most widely deployed relational database
+
+NoSQL
+
+OpenSearchFull-text search, log analytics and dashboards
+
+ValkeyIn-memory key-value store for caching
+
+Streaming and Analytics
+
+KafkaEvent streaming for real-time pipelines
+
+ClickHouseColumnar analytics at real-time speed
+
+Vector Databases
+
+pgvectorVector similarity search inside PostgreSQL
+
+Vector SearchSemantic search over your own data
+
+Observability
+
+GrafanaDashboards for your metrics and logs
+
+ThanosLong-term storage for Prometheus metrics
+
+NetworkingPrivate Networks, Network Load Balancer and Elastic IPs
+
+Virtual Private CloudDedicated hypervisors and Private Connect
+
+DNSAnycast resolution at low latency
+
+CDNDeliver content directly from your buckets
+
+Key Management ServiceCreate and control your own encryption keys
+
+IAMRoles, API keys and fine-grained access control
+
+Audit TrailsA record of every action taken on your account
+
+EncryptionEncryption at rest and in transit
+
+Browse All Products
+
 Resources
 
-Documentation
-API
-Blog
-Integration
-Support
+DocumentationEverything you need to start and integrate
 
-Changelog
+Trust and ComplianceCertifications, security and data protection
 
+InfrastructureWhere and how the platform runs
+
+News and LearningProduct news, training and events
+
+SupportPlans, status and how to reach us
+
+CompanyWho runs the platform
+
+Platform
+
+Quick StartFirst setup, registration and verification
+
+BillingBilled by the exact time or unit consumed
+
+Products
+
+ComputeInstances and dedicated hypervisors
+
+Containers (SKS)Cluster setup, operations and recipes
+
+Concrete AIOpenAI-compatible inference endpoints
+
+StorageObject Storage and Block Storage
+
+DBaaSEngines, plans and service boundaries
+
+NetworkingLoad balancing, DNS, CDN and Private Networks
+
+SecurityKey Management Service and IAM
+
+SupportSupport priorities and SLA
+
+Reference
+
+API ReferenceThe public Exoscale API
+
+CLIManage your resources with the exo CLI
+
+Terraform ProviderDeclare your infrastructure as code
+
+SDKsClient libraries per language
+
+IntegrationsTerraform, Kubernetes, Packer, Pulumi
+
+Compliance
+
+GDPREuropean Union data protection law
+
+Swiss FDPASwiss federal act on data protection
+
+BSI C5German cloud computing security criteria
+
+ISO 27001Information security management system
+
+Commitments
+
+

… truncated …
```

### `exoscale-ai`

- **Confidence:** medium
- **Dependent pages:** (none)
- **Rationale:** The content section merges previously separate 'Dedicated Inference' and 'Managed Inference' product descriptions into a single 'Inference' offering with new wording about GPU reservation vs pay-per-token access, and pricing section language changed from 'pay-as-you-go for the managed inference' to 'pay-as-you-go for On-demand Inference'. These are substantive product capability and structure changes, not just navigation/menu restructuring, which could affect vendor comparison content.
- **Patch:** `snapshots/_diffs/exoscale-ai.patch`

```diff
Index: snapshots/exoscale-ai.txt
===================================================================
--- snapshots/exoscale-ai.txt
+++ snapshots/exoscale-ai.txt
@@ -1,77 +1,578 @@
-Newsletter
+Skip to main content
+
 Blog
-Partner Programs
-Academy
-Contact us
 
+Changelog
+
+Documentation
+
+Newsletter
+
+Support
+
+Contact Us
+
 Exoscale
 
 Products
 
-Compute Instances
-Concrete AI
-Managed Kubernetes
-DBaaS
+ComputeVirtual machines, GPUs and Kubernetes
+
+Concrete AIOur AI infrastructure suite, from GPUs to inference endpoints
+
+StorageStore any volume of data in Europe
+
+DBaaSOpen-source database and analytics engines, fully operated
+
+NetworkingConnect, route and protect your traffic
+
+SecurityKeys, access and encryption
+
+Compute InstancesSSD-backed VMs billed by the second
+
+GPU Servers1 to 8 NVIDIA cards per instance
+
+Managed KubernetesExoscale runs the control plane
+
+Concrete AI OverviewThe whole AI suite at a glance
+
+Inference
+
+Dedicated InferenceAny model as an API on dedicated GPUs
+
+On-Demand InferencePay-as-you-go AI model catalog
+
+GPUs and Databases
+
+GPU Servers1 to 8 NVIDIA cards per instance
+
+Vector DatabasesStore and search AI embeddings
+
 Object Storage
+
+Object StorageS3-compatible storage across 8 European zones
+
+Archival StorageCold archives and long-term backups
+
 Block Storage
-GPU Servers
 
-All products
+Block StoragePersistent volumes you can reattach to other instances
 
-Marketplace
+Managed DatabasesPlans, pricing and how DBaaS works
 
-Pricing
+Relational
 
+PostgreSQLThe feature-rich open-source relational database
+
+MySQLThe most widely deployed relational database
+
+NoSQL
+
+OpenSearchFull-text search, log analytics and dashboards
+
+ValkeyIn-memory key-value store for caching
+
+Streaming and Analytics
+
+KafkaEvent streaming for real-time pipelines
+
+ClickHouseColumnar analytics at real-time speed
+
+Vector Databases
+
+pgvectorVector similarity search inside PostgreSQL
+
+Vector SearchSemantic search over your own data
+
+Observability
+
+GrafanaDashboards for your metrics and logs
+
+ThanosLong-term storage for Prometheus metrics
+
+NetworkingPrivate Networks, Network Load Balancer and Elastic IPs
+
+Virtual Private CloudDedicated hypervisors and Private Connect
+
+DNSAnycast resolution at low latency
+
+CDNDeliver content directly from your buckets
+
+Key Management ServiceCreate and control your own encryption keys
+
+IAMRoles, API keys and fine-grained access control
+
+Audit TrailsA record of every action taken on your account
+
+EncryptionEncryption at rest and in transit
+
+Browse All Products
+
 Resources
 
-Documentation
-API
-Blog
-Integration
-Support
+DocumentationEverything you need to start and integrate
 
-Changelog
+Trust and ComplianceCertifications, security and data protection
 
+InfrastructureWhere and how the platform runs
+
+News and LearningProduct news, training and events
+
+SupportPlans, status and how to reach us
+
+CompanyWho runs the platform
+
+Platform
+
+Quick StartFirst setup, registration and verification
+
+BillingBilled by the exact time or unit consumed
+
+Products
+
+ComputeInstances and dedicated hypervisors
+
+Containers (SKS)Cluster setup, operations and recipes
+
+Concrete AIOpenAI-compatible inference endpoints
+
+StorageObject Storage and Block Storage
+
+DBaaSEngines, plans and service boundaries
+
+NetworkingLoad balancing, DNS, CDN and Private Networks
+
+SecurityKey Management Service and IAM
+
+SupportSupport priorities and SLA
+
+Reference
+
+API ReferenceThe public Exoscale API
+
+CLIManage your resources with the exo CLI
+
+Terraform ProviderDeclare your infrastructure as code
+
+SDKsClient libraries per language
+
+IntegrationsTerraform, Kubernetes, Packer, Pulumi
+
+Compliance
+
+GDPREuropean Union data protection law
+
+Swiss FDPASwiss federal act on data protection
+
+BSI C5German cloud computing security criteria
+
+ISO 27001Information security management system
+
+Commitments
+
+SecurityHow we secure th

… truncated …
```

### `ovhcloud-ai-endpoints`

- **Confidence:** medium
- **Dependent pages:** (none)
- **Rationale:** The diff is truncated, providing insufficient context to confirm no changes to hosting, DPA, pricing, or certification facts on this vendor comparison page. Per bias and policy, truncated diffs with potentially missing context should default to material.
- **Patch:** `snapshots/_diffs/ovhcloud-ai-endpoints.patch`

```diff
Index: snapshots/ovhcloud-ai-endpoints.txt
===================================================================
--- snapshots/ovhcloud-ai-endpoints.txt
+++ snapshots/ovhcloud-ai-endpoints.txt
@@ -1,5 +1,5 @@
-WebmailMy accountSupport🇬🇧 EnglishThemeLanguages🇬🇧 English🇫🇷 Français🇬🇧 English🇩🇪 Deutsch🇪🇸 Español🇮🇹 Italiano🇵🇱 Polski🇵🇹 PortuguêsMenuOn this pageSearch⌘KDocumentationAPI ReferenceProduct changelogE-Learning & certificationsMigrationBare Metal CloudDedicated ServersOverviewKey ConceptsBare Metal 3-AZ Region - Service presentationOVHcloud Control Panel for Kimsufi & So you Start Dedicated ServersShared responsibility for Dedicated ServersUnderstanding the dedicated server boot processGetting StartedHow to get started with a dedicated serverHow to get started with a Kimsufi, So You Start or Rise dedicated serverHow to get started with SSH connectionsHow to Create SSH Keys for Dedicated Server AccessHow to store public authentication keys in the OVHcloud Control PanelHow to use the IPMI console with a dedicated serverHow to obtain the carbon footprint of your OVHcloud servicesConfigurationSystemConfigure User Accounts and Root Access (Dedicated)Change a Windows Server Product Key (Dedicated)Changing the admin password on a Windows dedicated serverHow to reset the Windows Administrator password with the Windows customer rescue systemHow to manage Intel SGX on a dedicated serverHardware upgrade on an Advance, High Grade or Scale dedicated serverHow to assign a tag to a Bare Metal serverHow to install VMware ESXi 8 on a dedicated serverStorageManage Software RAID (BIOS boot mode) on Dedicated ServersManage Software RAID (UEFI boot mode) on Dedicated ServersManage Hardware RAID on a Dedicated ServerHot-Swapping a Disk on Hardware RAID Dedicated ServersHot-Swapping a Disk on Software RAID Dedicated ServersConfiguring MegaRAID for RAID Level 0Software RAID Mirror on a Windows Dedicated ServerOVHcloud API and StorageConfigure Storage on a HGR-STOR-2 Dedicated ServerCreate a Windows Partition on a Dedicated Server with Hardware RAIDUpgrade Samsung NVMe PM9A1 Firmware on Dedicated ServersUpgrade WD SS300 SSD Firmware on a Dedicated ServerUpgrade WD SS530 SSD Firmware on a Dedicated ServerUpgrade Solidigm D7-P5520 SSD Firmware on a Dedicated ServerDedicated Servers - Upgrading your Micron 7500 PRO firmwareVerify the BMC Firmware Version on a Linux Dedicated ServerNetworkConfiguring OVHcloud Secondary DNS on a dedicated serverInstall an OVHcloud SSH Key on a Dedicated ServerConfiguring OVHcloud Link Aggregation (OLA) in the OVHcloud Control PanelHow to configure LACP link aggregation on Debian 9 to 11 (ifupdown)How to configure Link Aggregation with LACP in Debian 12 or newer / Ubuntu 24.04 or newerHow to configure NIC teaming for OVHcloud Link Aggregation (OLA) on Windows Server 2019How to configure LACP link aggregation on SLES 15How to set up a web server (LAMP) on Debian or UbuntuManage your server reboot with the OVHcloud Link Aggregation featureConfiguring IPv6 on dedicated serversConfiguring an IPv6 address on a virtual machineMoving an Additional IPConfiguring Additional IPs in bridge mode on your virtual machinesWhat are the IP addresses of the OVHcloud monitoring?Configure IP Aliasing on a Dedicated ServerHow to configure reverse DNS for your server (PTR record)Check Virtual MAC Support on Your Dedicated ServerAssigning a Virtual MAC to an Additional IPConfiguring the network on Windows Server with Hyper-VProxmox VE Networking on HG/Scale Dedicated ServersManage Dedicated Server Bandwidth via the OVHcloud APIImprove Network Resilience on Bare Metal serversvRackConfiguring the vRack on your dedicated serversConfigure Jumbo Frames in vRack on Dedicated ServersConfiguring an Additional IP block in a vRackConfiguring an Additional IPv6 block in a vRackChange the announcement of an IP block in vRackCreate Multiple vLANs in a vRack on a Dedicated ServerConfigure Hyper-V VMs with Additional IPs in a vRack on Dedica

… truncated …
```

### `deepl-infrastructure`

- **Confidence:** medium
- **Dependent pages:** (none)
- **Rationale:** The page content describes DeepL adding AWS as a sub-processor, ending exclusive EU-only data processing, and details on data residency, encryption, and certifications (C5, HIPAA, GDPR, ISO 27001, SOC 2). These are core vendor compliance facts (hosting region, sub-processor, data residency) that directly affect dependent compliance/vendor content. The diff is truncated, making it impossible to confirm no substantive change occurred, so bias toward material applies.
- **Patch:** `snapshots/_diffs/deepl-infrastructure.patch`

```diff
Index: snapshots/deepl-infrastructure.txt
===================================================================
--- snapshots/deepl-infrastructure.txt
+++ snapshots/deepl-infrastructure.txt
@@ -1,1 +1,1 @@
-DeepL Translation Flow: New AI-powered workflows for key use cases and integrationsThe ROI of AI-native translationMajor DeepL Voice Update: Improve Transcription Accuracy With Spoken Terms V2!Building Brands Across Cultures. In conversation with Katherine Melchior RayDiscover Translation Flow: Localization that automates translation workflows end-to-end, for every team that needs themDecoding Trust in Enterprise Language AI. In conversation with SlatorFrom high-quality text translation to a real-time voice platformBuilding an instantly accessible voice demo with DeepL Voice APINVIDIA: Powering AI innovationProductsDeepL TranslatorTranslate securely, efficiently, and accuratelyDeepL WriteEnhance your writing and adapt to your audienceDeepL VoiceConverse across languages in real timeDeepL APIBuild multilingual experiences into your productsDeepL IntegrationsCombine Language AI with essential productivity toolsOverviewSolutionsEnterpriseOverviewEnterprise security & trustMarket-leading QualityCustomization HubDeepL on AWS MarketplaceNewUse casesDocument translationCustomer supportInternal communicationMarketingGlobal expansionTeamsLocalizationLegalMarketing & CommunicationsCustomer ServiceSalesBusiness OperationsIndustryLegal & professional servicesRetail & e-commerceManufacturingGovernmentFinancial servicesPharma & life sciencesHealthcareISV & technologyContact SalesDevelopersDocumentationAPI referenceAPI pricingBuilt with DeepLGitHubPricingAppsAppsDesktop appBrowser extensionMobile appsExplore all appsIntegrationsMicrosoft WordGoogle WorkspaceMicrosoft 365Explore all integrationsResourcesLearnBlogCustomer storiesEvents & WebinarsDeepL AcademyReports & guidesBorderless business reportDeepL Spring Event HubDeepL AI LabsCommunityGet supportHelp CenterApps and integrationsBecome a PartnerLog inStart free trialMenuDeepL BlogTech BlogWe’re expanding DeepL’s data infrastructure – here’s what’s changing and whyBy DeepL TeamLast updated: April 23, 2026In this postWhat’s changingWhat doesn’t changeWhy we’ve made this changeEnabling greater choice for customersBuilt in Europe, for global trustGlobal scale and performance require global data infrastructure. We are expanding DeepL’s data infrastructure and adding AWS as a sub-processor, to align with DeepL’s growth and deliver the performance all of our customers expect. We know this raises important questions about customer data, where it’s stored and how it’s controlled. This update explains what’s changing, what isn’t, and how your data remains protected when using DeepL.What’s changingIn order to bring DeepL to more customers worldwide, this is what we’re changing:We will no longer process data exclusively within EuropeWe are adding AWS as a sub-processor to support global scale and performanceThis ensures that DeepL delivers low-latency and real-time performance, everywhere in the world.What doesn’t changeWhat absolutely does not change is the way that we protect customer data, and the control that our customers have over who can access it.DeepL remains the data processor. We have added AWS as a sub-processor to our services providing the necessary infrastructure for global scale. AWS will not control or access customer data in any usable form. Your data is encrypted in transit and at rest, and we do not use customer data from paid services to train our AI models.Our security features are designed to give you full control over your data. With Bring Your Own Key (BYOK) encryption, you generate and manage your own encryption keys, and you can revoke access to your data at any time. Once you remove your key, your data is completely out of reach of DeepL and any infrastructure partner we work with.DeepL will continue to comply with all of the strict data privacy and security standards th

… truncated …
```

## Fetch failures

These sources kept their previous snapshot (`change: kept`). Vendor refresh (T18) and `last_verified` bumps skip them — do not leave rows to rot.

### `eur-lex-ai-act-de`

- **HTTP:** 202
- **Error:** HTTP 202 Accepted after 3 attempts (tried 3 URLs; last: https://eur-lex.europa.eu/eli/reg/2024/1689/oj/deu/pdf)
- **Consecutive failures:** 1
- **Last ok:** 2026-07-17T09:43:17.873Z
- **Vendor:** (none)
- **Dependent pages:** `eu-ai-act-swiss-exporters`, `ai-procurement-checklist`
- **Configured fallbacks:** `https://eur-lex.europa.eu/legal-content/DE/TXT/PDF/?uri=CELEX:32024R1689`, `https://eur-lex.europa.eu/eli/reg/2024/1689/oj/deu/pdf`
- **Hint:** add a `fallback_urls` entry in `data/sources.json`, or seed manually: `npm run snapshot:sources -- --id=eur-lex-ai-act-de --seed-file=<path>`

### `eur-lex-ai-act-en`

- **HTTP:** 202
- **Error:** HTTP 202 Accepted after 3 attempts (tried 3 URLs; last: https://eur-lex.europa.eu/eli/reg/2024/1689/oj/eng/pdf)
- **Consecutive failures:** 1
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

