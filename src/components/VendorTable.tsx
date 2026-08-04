"use client";

import { useState } from "react";

import type { Locale } from "@/i18n/config";
import type { Messages } from "@/i18n/types";
import { formatIsoDate } from "@/lib/format-date";
import {
  certifications,
  type Certification,
  type Vendor,
} from "@/vendors/schema";

import styles from "./VendorTable.module.css";

type VendorsMessages = Messages["vendors"];

type VendorTableProps = {
  vendors: Vendor[];
  vendorsMessages: VendorsMessages;
  lang: Locale;
};

type Filters = {
  swissHosting: boolean;
  euHosting: boolean;
  dpaAvailable: boolean;
  trainingOptOut: boolean;
  certifications: Set<Certification>;
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

function formatResultCount(
  template: string,
  shown: number,
  total: number,
): string {
  return template
    .replace("{shown}", String(shown))
    .replace("{total}", String(total));
}

function matchesFilters(vendor: Vendor, filters: Filters): boolean {
  if (filters.swissHosting && vendor.swiss_hosting.value !== true) {
    return false;
  }
  if (filters.euHosting && vendor.eu_hosting.value !== true) {
    return false;
  }
  if (filters.dpaAvailable && vendor.dpa_url.value === null) {
    return false;
  }
  if (filters.trainingOptOut && vendor.training_opt_out.value !== true) {
    return false;
  }
  if (filters.certifications.size > 0) {
    const certs = vendor.certifications.value;
    if (certs === null) {
      return false;
    }
    const hasAny = [...filters.certifications].some((cert) =>
      certs.includes(cert),
    );
    if (!hasAny) {
      return false;
    }
  }
  return true;
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

function Unverified({ label }: { label: string }) {
  return <span className={styles.unverified}>{label}</span>;
}

function BooleanCell({
  cell,
  messages,
}: {
  cell: Vendor["swiss_hosting"];
  messages: VendorsMessages;
}) {
  if (cell.value === null || cell.source_url === null) {
    return <Unverified label={messages.unverified} />;
  }

  return (
    <span className={styles.cellWithSource}>
      <span>{cell.value ? messages.yes : messages.no}</span>
      <SourceLink href={cell.source_url} label={messages.sourceLink} />
    </span>
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
    return <Unverified label={messages.unverified} />;
  }

  return (
    <span className={styles.cellWithSource}>
      <span>{cell.value.length > 0 ? cell.value.join(", ") : "—"}</span>
      <SourceLink href={cell.source_url} label={messages.sourceLink} />
    </span>
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
    return <Unverified label={messages.unverified} />;
  }

  return (
    <span className={styles.cellWithSource}>
      <a
        href={cell.value}
        className={styles.valueLink}
        target="_blank"
        rel="noopener noreferrer"
      >
        {messages.dpaLink}
      </a>
      <SourceLink href={cell.source_url} label={messages.sourceLink} />
    </span>
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
    return <Unverified label={messages.unverified} />;
  }

  const labels = cell.value.map((cert) => certificationLabel(cert, messages));

  return (
    <span className={styles.cellWithSource}>
      <span>{labels.length > 0 ? labels.join(", ") : "—"}</span>
      <SourceLink href={cell.source_url} label={messages.sourceLink} />
    </span>
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
    return <Unverified label={messages.unverified} />;
  }

  return (
    <span className={styles.cellWithSource}>
      <span>{pricingLabel(cell.value, messages)}</span>
      <SourceLink href={cell.source_url} label={messages.sourceLink} />
    </span>
  );
}

export function VendorTable({
  vendors,
  vendorsMessages,
  lang,
}: VendorTableProps) {
  const [filters, setFilters] = useState<Filters>({
    swissHosting: false,
    euHosting: false,
    dpaAvailable: false,
    trainingOptOut: false,
    certifications: new Set(),
  });

  const sortedVendors = [...vendors].sort((a, b) =>
    a.name.localeCompare(b.name),
  );
  const filtered = sortedVendors.filter((vendor) =>
    matchesFilters(vendor, filters),
  );

  const hasActiveFilters =
    filters.swissHosting ||
    filters.euHosting ||
    filters.dpaAvailable ||
    filters.trainingOptOut ||
    filters.certifications.size > 0;

  function toggleCert(cert: Certification) {
    setFilters((prev) => {
      const next = new Set(prev.certifications);
      if (next.has(cert)) {
        next.delete(cert);
      } else {
        next.add(cert);
      }
      return { ...prev, certifications: next };
    });
  }

  function clearFilters() {
    setFilters({
      swissHosting: false,
      euHosting: false,
      dpaAvailable: false,
      trainingOptOut: false,
      certifications: new Set(),
    });
  }

  return (
    <div className={styles.root}>
      <fieldset className={styles.filters}>
        <legend className={styles.filtersLegend}>
          {vendorsMessages.filtersLegend}
        </legend>

        <div className={styles.filterRow}>
          <label className={styles.filterCheck}>
            <input
              type="checkbox"
              checked={filters.swissHosting}
              onChange={(event) =>
                setFilters((prev) => ({
                  ...prev,
                  swissHosting: event.target.checked,
                }))
              }
            />
            {vendorsMessages.filterSwissHosting}
          </label>
          <label className={styles.filterCheck}>
            <input
              type="checkbox"
              checked={filters.euHosting}
              onChange={(event) =>
                setFilters((prev) => ({
                  ...prev,
                  euHosting: event.target.checked,
                }))
              }
            />
            {vendorsMessages.filterEuHosting}
          </label>
          <label className={styles.filterCheck}>
            <input
              type="checkbox"
              checked={filters.dpaAvailable}
              onChange={(event) =>
                setFilters((prev) => ({
                  ...prev,
                  dpaAvailable: event.target.checked,
                }))
              }
            />
            {vendorsMessages.filterDpaAvailable}
          </label>
          <label className={styles.filterCheck}>
            <input
              type="checkbox"
              checked={filters.trainingOptOut}
              onChange={(event) =>
                setFilters((prev) => ({
                  ...prev,
                  trainingOptOut: event.target.checked,
                }))
              }
            />
            {vendorsMessages.filterTrainingOptOut}
          </label>
        </div>

        <div className={styles.certFilters}>
          <span className={styles.certLabel}>
            {vendorsMessages.filterCertifications}
          </span>
          <div className={styles.filterRow}>
            {certifications.map((cert) => (
              <label key={cert} className={styles.filterCheck}>
                <input
                  type="checkbox"
                  checked={filters.certifications.has(cert)}
                  onChange={() => toggleCert(cert)}
                />
                {certificationLabel(cert, vendorsMessages)}
              </label>
            ))}
          </div>
        </div>

        <div className={styles.filterMeta}>
          <p className={styles.resultCount} aria-live="polite">
            {formatResultCount(
              vendorsMessages.resultCount,
              filtered.length,
              sortedVendors.length,
            )}
          </p>
          <button
            type="button"
            className={styles.clearButton}
            onClick={clearFilters}
            disabled={!hasActiveFilters}
          >
            {vendorsMessages.clearFilters}
          </button>
        </div>
      </fieldset>

      {filtered.length === 0 ? (
        <p className={styles.empty}>{vendorsMessages.emptyFiltered}</p>
      ) : (
        <div className={styles.tableScroll}>
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
              {filtered.map((vendor) => (
                <tr key={vendor.id}>
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
      )}
    </div>
  );
}
