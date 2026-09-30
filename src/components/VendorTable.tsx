import type { ReactNode } from "react";

import type { Locale } from "@/i18n/config";
import type { Messages } from "@/i18n/types";
import { formatIsoDate } from "@/lib/format-date";
import {
  certifications,
  type Certification,
  type Vendor,
} from "@/vendors/schema";
import { StatusPill } from "@/components/ui";
import {
  VendorFilters,
  type VendorFacts,
  type VendorFiltersStrings,
} from "@/components/VendorFilters";

import styles from "./VendorTable.module.css";

type VendorsMessages = Messages["vendors"];

type VendorTableProps = {
  vendors: Vendor[];
  vendorsMessages: VendorsMessages;
  lang: Locale;
};

function certificationLabel(
  cert: Certification,
  messages: VendorsMessages,
): string {
  switch (cert) {
    case "iso_27001":
      return messages.certIso27001;
    case "soc_2":
      return messages.certSoc2;
    case "finma_relevant":
      return messages.certFinmaRelevant;
    case "other":
      return messages.certOther;
  }
}

function pricingLabel(
  tier: NonNullable<Vendor["pricing_tier"]["value"]>,
  messages: VendorsMessages,
): string {
  switch (tier) {
    case "free":
      return messages.pricingFree;
    case "usage":
      return messages.pricingUsage;
    case "subscription":
      return messages.pricingSubscription;
    case "enterprise":
      return messages.pricingEnterprise;
    case "contact":
      return messages.pricingContact;
  }
}

function SourceLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <a
      href={href}
      className={styles.sourceLink}
      target="_blank"
      rel="noopener noreferrer"
    >
      {label}
    </a>
  );
}

function UnverifiedPill({ label }: { label: string }) {
  return (
    <StatusPill tone="neutral" dashed>
      {label}
    </StatusPill>
  );
}

function CellWithSource({
  children,
  sourceUrl,
  sourceLabel,
}: {
  children: ReactNode;
  sourceUrl: string;
  sourceLabel: string;
}) {
  return (
    <span className={styles.cellWithSource}>
      {children}
      <SourceLink href={sourceUrl} label={sourceLabel} />
    </span>
  );
}

function BooleanCell({
  cell,
  messages,
}: {
  cell: Vendor["swiss_hosting"];
  messages: VendorsMessages;
}) {
  if (cell.value === null || cell.source_url === null) {
    return <UnverifiedPill label={messages.unverified} />;
  }

  return (
    <CellWithSource
      sourceUrl={cell.source_url}
      sourceLabel={messages.sourceLink}
    >
      <StatusPill tone={cell.value ? "success" : "neutral"}>
        {cell.value ? messages.yes : messages.no}
      </StatusPill>
    </CellWithSource>
  );
}

function RegionsCell({
  cell,
  messages,
}: {
  cell: Vendor["hosting_regions"];
  messages: VendorsMessages;
}) {
  if (cell.value === null || cell.source_url === null) {
    return <UnverifiedPill label={messages.unverified} />;
  }

  return (
    <CellWithSource
      sourceUrl={cell.source_url}
      sourceLabel={messages.sourceLink}
    >
      <span>{cell.value.length > 0 ? cell.value.join(", ") : "—"}</span>
    </CellWithSource>
  );
}

function DpaCell({
  cell,
  messages,
}: {
  cell: Vendor["dpa_url"];
  messages: VendorsMessages;
}) {
  if (cell.value === null || cell.source_url === null) {
    return <UnverifiedPill label={messages.unverified} />;
  }

  return (
    <CellWithSource
      sourceUrl={cell.source_url}
      sourceLabel={messages.sourceLink}
    >
      <a
        href={cell.value}
        className={styles.valueLink}
        target="_blank"
        rel="noopener noreferrer"
      >
        {messages.dpaLink}
      </a>
    </CellWithSource>
  );
}

function CertificationsCell({
  cell,
  messages,
}: {
  cell: Vendor["certifications"];
  messages: VendorsMessages;
}) {
  if (cell.value === null || cell.source_url === null) {
    return <UnverifiedPill label={messages.unverified} />;
  }

  const labels = cell.value.map((cert) => certificationLabel(cert, messages));

  return (
    <CellWithSource
      sourceUrl={cell.source_url}
      sourceLabel={messages.sourceLink}
    >
      <span>{labels.length > 0 ? labels.join(", ") : "—"}</span>
    </CellWithSource>
  );
}

function PricingCell({
  cell,
  messages,
}: {
  cell: Vendor["pricing_tier"];
  messages: VendorsMessages;
}) {
  if (cell.value === null || cell.source_url === null) {
    return <UnverifiedPill label={messages.unverified} />;
  }

  return (
    <CellWithSource
      sourceUrl={cell.source_url}
      sourceLabel={messages.sourceLink}
    >
      <span>{pricingLabel(cell.value, messages)}</span>
    </CellWithSource>
  );
}

function VendorCard({
  vendor,
  messages,
  lang,
}: {
  vendor: Vendor;
  messages: VendorsMessages;
  lang: Locale;
}) {
  return (
    <article className={styles.card}>
      <h2 className={styles.cardTitle}>
        <a
          href={vendor.website}
          className={styles.valueLink}
          target="_blank"
          rel="noopener noreferrer"
        >
          {vendor.name}
        </a>
      </h2>
      <dl className={styles.cardDl}>
        <div>
          <dt>{messages.colHostingRegions}</dt>
          <dd>
            <RegionsCell cell={vendor.hosting_regions} messages={messages} />
          </dd>
        </div>
        <div>
          <dt>{messages.colSwissHosting}</dt>
          <dd>
            <BooleanCell cell={vendor.swiss_hosting} messages={messages} />
          </dd>
        </div>
        <div>
          <dt>{messages.colEuHosting}</dt>
          <dd>
            <BooleanCell cell={vendor.eu_hosting} messages={messages} />
          </dd>
        </div>
        <div>
          <dt>{messages.colDpa}</dt>
          <dd>
            <DpaCell cell={vendor.dpa_url} messages={messages} />
          </dd>
        </div>
        <div>
          <dt>{messages.colTrainingOptOut}</dt>
          <dd>
            <BooleanCell cell={vendor.training_opt_out} messages={messages} />
          </dd>
        </div>
        <div>
          <dt>{messages.colCertifications}</dt>
          <dd>
            <CertificationsCell
              cell={vendor.certifications}
              messages={messages}
            />
          </dd>
        </div>
        <div>
          <dt>{messages.colPricingTier}</dt>
          <dd>
            <PricingCell cell={vendor.pricing_tier} messages={messages} />
          </dd>
        </div>
        <div>
          <dt>{messages.colSwissEntity}</dt>
          <dd>
            <BooleanCell cell={vendor.swiss_entity} messages={messages} />
          </dd>
        </div>
        <div>
          <dt>{messages.colEuEntity}</dt>
          <dd>
            <BooleanCell cell={vendor.eu_entity} messages={messages} />
          </dd>
        </div>
        <div>
          <dt>{messages.colLastChecked}</dt>
          <dd>
            <time dateTime={vendor.last_checked}>
              {formatIsoDate(vendor.last_checked, lang)}
            </time>
          </dd>
        </div>
      </dl>
    </article>
  );
}

export function VendorTable({
  vendors,
  vendorsMessages,
  lang,
}: VendorTableProps) {
  const sortedVendors = [...vendors].sort((a, b) =>
    a.name.localeCompare(b.name),
  );

  const facts: VendorFacts[] = sortedVendors.map((vendor) => ({
    id: vendor.id,
    swissHosting: vendor.swiss_hosting.value === true,
    euHosting: vendor.eu_hosting.value === true,
    dpaAvailable: vendor.dpa_url.value !== null,
    trainingOptOut: vendor.training_opt_out.value === true,
    certifications: vendor.certifications.value,
  }));

  const filterStrings: VendorFiltersStrings = {
    filtersLegend: vendorsMessages.filtersLegend,
    filterSwissHosting: vendorsMessages.filterSwissHosting,
    filterEuHosting: vendorsMessages.filterEuHosting,
    filterDpaAvailable: vendorsMessages.filterDpaAvailable,
    filterTrainingOptOut: vendorsMessages.filterTrainingOptOut,
    filterCertifications: vendorsMessages.filterCertifications,
    resultCount: vendorsMessages.resultCount,
    clearFilters: vendorsMessages.clearFilters,
    emptyFiltered: vendorsMessages.emptyFiltered,
    certLabels: certifications.map((cert) => ({
      id: cert,
      label: certificationLabel(cert, vendorsMessages),
    })),
  };

  // Rendered on the server; VendorFilters toggles `hidden` on the
  // [data-vendor-id] rows/cards inside this element.
  const listsId = "vendor-lists";

  return (
    <div className={styles.root}>
      <VendorFilters facts={facts} strings={filterStrings} listsId={listsId} />

      <div id={listsId}>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th scope="col">{vendorsMessages.colName}</th>
                <th scope="col">{vendorsMessages.colHostingRegions}</th>
                <th scope="col">{vendorsMessages.colSwissHosting}</th>
                <th scope="col">{vendorsMessages.colEuHosting}</th>
                <th scope="col">{vendorsMessages.colDpa}</th>
                <th scope="col">{vendorsMessages.colTrainingOptOut}</th>
                <th scope="col">{vendorsMessages.colCertifications}</th>
                <th scope="col">{vendorsMessages.colPricingTier}</th>
                <th scope="col">{vendorsMessages.colSwissEntity}</th>
                <th scope="col">{vendorsMessages.colEuEntity}</th>
                <th scope="col">{vendorsMessages.colLastChecked}</th>
              </tr>
            </thead>
            <tbody>
              {sortedVendors.map((vendor) => (
                <tr key={vendor.id} data-vendor-id={vendor.id}>
                  <th scope="row">
                    <a
                      href={vendor.website}
                      className={styles.valueLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {vendor.name}
                    </a>
                  </th>
                  <td>
                    <RegionsCell
                      cell={vendor.hosting_regions}
                      messages={vendorsMessages}
                    />
                  </td>
                  <td>
                    <BooleanCell
                      cell={vendor.swiss_hosting}
                      messages={vendorsMessages}
                    />
                  </td>
                  <td>
                    <BooleanCell
                      cell={vendor.eu_hosting}
                      messages={vendorsMessages}
                    />
                  </td>
                  <td>
                    <DpaCell cell={vendor.dpa_url} messages={vendorsMessages} />
                  </td>
                  <td>
                    <BooleanCell
                      cell={vendor.training_opt_out}
                      messages={vendorsMessages}
                    />
                  </td>
                  <td>
                    <CertificationsCell
                      cell={vendor.certifications}
                      messages={vendorsMessages}
                    />
                  </td>
                  <td>
                    <PricingCell
                      cell={vendor.pricing_tier}
                      messages={vendorsMessages}
                    />
                  </td>
                  <td>
                    <BooleanCell
                      cell={vendor.swiss_entity}
                      messages={vendorsMessages}
                    />
                  </td>
                  <td>
                    <BooleanCell
                      cell={vendor.eu_entity}
                      messages={vendorsMessages}
                    />
                  </td>
                  <td>
                    <time dateTime={vendor.last_checked}>
                      {formatIsoDate(vendor.last_checked, lang)}
                    </time>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <ul className={styles.cardList}>
          {sortedVendors.map((vendor) => (
            <li key={vendor.id} data-vendor-id={vendor.id}>
              <VendorCard
                vendor={vendor}
                messages={vendorsMessages}
                lang={lang}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
