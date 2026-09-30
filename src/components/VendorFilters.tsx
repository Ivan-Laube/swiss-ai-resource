"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui";
import type { Certification } from "@/vendors/schema";

import styles from "./VendorTable.module.css";

/** The only vendor data the filters need (the table itself is server-rendered). */
export type VendorFacts = {
  id: string;
  swissHosting: boolean;
  euHosting: boolean;
  dpaAvailable: boolean;
  trainingOptOut: boolean;
  /** null = unverified */
  certifications: Certification[] | null;
};

export type VendorFiltersStrings = {
  filtersLegend: string;
  filterSwissHosting: string;
  filterEuHosting: string;
  filterDpaAvailable: string;
  filterTrainingOptOut: string;
  filterCertifications: string;
  resultCount: string;
  clearFilters: string;
  emptyFiltered: string;
  certLabels: { id: Certification; label: string }[];
};

type Filters = {
  swissHosting: boolean;
  euHosting: boolean;
  dpaAvailable: boolean;
  trainingOptOut: boolean;
  certifications: Set<Certification>;
};

const NO_FILTERS: Filters = {
  swissHosting: false,
  euHosting: false,
  dpaAvailable: false,
  trainingOptOut: false,
  certifications: new Set(),
};

function matchesFilters(vendor: VendorFacts, filters: Filters): boolean {
  if (filters.swissHosting && !vendor.swissHosting) return false;
  if (filters.euHosting && !vendor.euHosting) return false;
  if (filters.dpaAvailable && !vendor.dpaAvailable) return false;
  if (filters.trainingOptOut && !vendor.trainingOptOut) return false;
  if (filters.certifications.size > 0) {
    const certs = vendor.certifications;
    if (certs === null) return false;
    if (![...filters.certifications].some((cert) => certs.includes(cert))) {
      return false;
    }
  }
  return true;
}

type Props = {
  facts: VendorFacts[];
  strings: VendorFiltersStrings;
  /** id of the server-rendered element holding `[data-vendor-id]` rows/cards. */
  listsId: string;
};

/**
 * Filter panel for the vendor comparison. The table and mobile cards are
 * rendered on the server; this island only shows/hides them by vendor id,
 * so the page no longer hydrates 15 rows × 2 layouts (Lighthouse R55: TBT).
 */
export function VendorFilters({ facts, strings, listsId }: Props) {
  const [filters, setFilters] = useState<Filters>(NO_FILTERS);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional hydration flag for e2e
    setHydrated(true);
  }, []);

  const visibleIds = new Set(
    facts.filter((vendor) => matchesFilters(vendor, filters)).map((v) => v.id),
  );
  const shown = visibleIds.size;

  const hasActiveFilters =
    filters.swissHosting ||
    filters.euHosting ||
    filters.dpaAvailable ||
    filters.trainingOptOut ||
    filters.certifications.size > 0;

  const visibleKey = [...visibleIds].sort().join(",");
  useEffect(() => {
    const lists = document.getElementById(listsId);
    if (!lists) return;
    const visible = new Set(visibleKey ? visibleKey.split(",") : []);
    lists.hidden = visible.size === 0;
    for (const element of lists.querySelectorAll<HTMLElement>("[data-vendor-id]")) {
      element.hidden = !visible.has(element.dataset.vendorId ?? "");
    }
  }, [listsId, visibleKey]);

  function setFlag(key: Exclude<keyof Filters, "certifications">, value: boolean) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  function toggleCert(cert: Certification) {
    setFilters((prev) => {
      const next = new Set(prev.certifications);
      if (next.has(cert)) next.delete(cert);
      else next.add(cert);
      return { ...prev, certifications: next };
    });
  }

  const flagFilters: {
    key: Exclude<keyof Filters, "certifications">;
    label: string;
  }[] = [
    { key: "swissHosting", label: strings.filterSwissHosting },
    { key: "euHosting", label: strings.filterEuHosting },
    { key: "dpaAvailable", label: strings.filterDpaAvailable },
    { key: "trainingOptOut", label: strings.filterTrainingOptOut },
  ];

  return (
    <>
      <fieldset
        className={styles.filters}
        data-hydrated={hydrated ? "true" : "false"}
      >
        <legend className={styles.filtersLegend}>{strings.filtersLegend}</legend>

        <div className={styles.filterRow}>
          {flagFilters.map(({ key, label }) => (
            <label key={key} className={styles.filterCheck}>
              <input
                type="checkbox"
                checked={filters[key]}
                onChange={(event) => setFlag(key, event.target.checked)}
              />
              {label}
            </label>
          ))}
        </div>

        <div className={styles.certFilters}>
          <span className={styles.certLabel}>{strings.filterCertifications}</span>
          <div className={styles.filterRow}>
            {strings.certLabels.map(({ id, label }) => (
              <label key={id} className={styles.filterCheck}>
                <input
                  type="checkbox"
                  checked={filters.certifications.has(id)}
                  onChange={() => toggleCert(id)}
                />
                {label}
              </label>
            ))}
          </div>
        </div>

        <div className={styles.filterMeta}>
          <p className={styles.resultCount} aria-live="polite">
            {strings.resultCount
              .replace("{shown}", String(shown))
              .replace("{total}", String(facts.length))}
          </p>
          <Button
            type="button"
            variant="ghost"
            onClick={() => setFilters(NO_FILTERS)}
            disabled={!hasActiveFilters}
          >
            {strings.clearFilters}
          </Button>
        </div>
      </fieldset>

      {shown === 0 ? <p className={styles.empty}>{strings.emptyFiltered}</p> : null}
    </>
  );
}
