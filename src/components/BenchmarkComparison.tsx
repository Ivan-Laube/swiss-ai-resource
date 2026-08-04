"use client";

import { useId, useState } from "react";
import type { Messages } from "@/i18n/types";
import type {
  BenchmarkComparisonOption,
  BenchmarkMedianRow,
} from "@/survey/benchmark";
import styles from "./BenchmarkComparison.module.css";

type BenchmarkMessages = Messages["benchmark"];

type BenchmarkComparisonProps = {
  messages: BenchmarkMessages;
  sizeOptions: BenchmarkComparisonOption[];
  medianBySize: Record<string, BenchmarkMedianRow>;
};

export function BenchmarkComparison({
  messages,
  sizeOptions,
  medianBySize,
}: BenchmarkComparisonProps) {
  const selectId = useId();
  const [selectedSize, setSelectedSize] = useState("");

  const row = selectedSize ? medianBySize[selectedSize] : undefined;
  let result: string | null = null;
  if (selectedSize) {
    if (!row) {
      result = messages.comparisonInsufficient;
    } else if (!row.medianBandLabel) {
      result = messages.comparisonNoMedian;
    } else {
      result = row.medianBandLabel;
    }
  }

  return (
    <section className={styles.section} aria-labelledby={`${selectId}-heading`}>
      <h2 id={`${selectId}-heading`}>{messages.comparisonHeading}</h2>
      <p className={styles.lead}>{messages.comparisonLead}</p>

      <div className={styles.field}>
        <label htmlFor={selectId}>{messages.comparisonSelectLabel}</label>
        <select
          id={selectId}
          value={selectedSize}
          onChange={(event) => setSelectedSize(event.target.value)}
        >
          <option value="">{messages.comparisonSelectPlaceholder}</option>
          {sizeOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {selectedSize && result ? (
        <div
          className={styles.result}
          role="status"
          aria-live="polite"
        >
          {row?.medianBandLabel ? (
            <>
              <p className={styles.resultLabel}>
                {messages.comparisonMedianLabel}
              </p>
              <p className={styles.resultValue}>{result}</p>
              <p className={styles.resultMeta}>
                {messages.questionSample.replace("{n}", String(row.n))}
              </p>
            </>
          ) : (
            <p className={styles.resultEmpty}>{result}</p>
          )}
        </div>
      ) : null}
    </section>
  );
}
