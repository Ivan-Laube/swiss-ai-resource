"use client";

import { useState } from "react";
import Link from "next/link";

import type { Locale } from "@/i18n";
import type { Messages } from "@/i18n/types";
import {
  pickLocalized,
  type DecisionTree,
  type Verdict,
} from "@/rules/schema";

import styles from "./DecisionTree.module.css";

type ToolsMessages = Messages["tools"];

type DecisionTreeProps = {
  tree: DecisionTree;
  locale: Locale;
  toolsMessages: ToolsMessages;
};

function verdictLabel(verdict: Verdict, messages: ToolsMessages): string {
  switch (verdict) {
    case "likely":
      return messages.verdictLikely;
    case "unlikely":
      return messages.verdictUnlikely;
    case "unclear":
      return messages.verdictUnclear;
    case "depends":
      return messages.verdictDepends;
  }
}

export function DecisionTree({
  tree,
  locale,
  toolsMessages,
}: DecisionTreeProps) {
  const [currentId, setCurrentId] = useState(tree.start);
  const [history, setHistory] = useState<string[]>([]);

  const node = tree.nodes[currentId];

  function goTo(nextId: string) {
    setHistory((prev) => [...prev, currentId]);
    setCurrentId(nextId);
  }

  function goBack() {
    setHistory((prev) => {
      if (prev.length === 0) {
        return prev;
      }
      const previous = prev[prev.length - 1];
      setCurrentId(previous);
      return prev.slice(0, -1);
    });
  }

  function restart() {
    setCurrentId(tree.start);
    setHistory([]);
  }

  return (
    <div className={styles.root}>
      <div className={styles.controls}>
        <button
          type="button"
          className={styles.controlButton}
          onClick={goBack}
          disabled={history.length === 0}
        >
          {toolsMessages.back}
        </button>
        <button
          type="button"
          className={styles.controlButton}
          onClick={restart}
          disabled={currentId === tree.start && history.length === 0}
        >
          {toolsMessages.restart}
        </button>
      </div>

      {node.type === "question" ? (
        <div className={styles.question}>
          <p className={styles.prompt}>
            {pickLocalized(node.prompt, locale)}
          </p>
          {node.help ? (
            <p className={styles.help}>{pickLocalized(node.help, locale)}</p>
          ) : null}
          <ul className={styles.answers}>
            {node.answers.map((answer) => (
              <li key={answer.id}>
                <button
                  type="button"
                  className={styles.answerButton}
                  onClick={() => goTo(answer.next)}
                >
                  {pickLocalized(answer.label, locale)}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className={styles.outcome}>
          <p className={styles.verdict}>
            {verdictLabel(node.verdict, toolsMessages)}
          </p>
          <p className={styles.summary}>
            {pickLocalized(node.summary, locale)}
          </p>

          <section
            className={styles.section}
            aria-labelledby="caveats-heading"
          >
            <h2 id="caveats-heading" className={styles.sectionTitle}>
              {toolsMessages.caveats}
            </h2>
            <ul className={styles.list}>
              {node.caveats.map((caveat, index) => (
                <li key={index}>{pickLocalized(caveat, locale)}</li>
              ))}
            </ul>
          </section>

          <section
            className={styles.section}
            aria-labelledby="sources-heading"
          >
            <h2 id="sources-heading" className={styles.sectionTitle}>
              {toolsMessages.sources}
            </h2>
            <ul className={styles.list}>
              {node.sources.map((source) => (
                <li key={source.url}>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {source.title}
                  </a>
                </li>
              ))}
            </ul>
          </section>

          {node.related_pages.length > 0 ? (
            <section
              className={styles.section}
              aria-labelledby="related-heading"
            >
              <h2 id="related-heading" className={styles.sectionTitle}>
                {toolsMessages.relatedPages}
              </h2>
              <ul className={styles.list}>
                {node.related_pages.map((slug) => (
                  <li key={slug}>
                    <Link href={`/${locale}/${slug}/`}>{slug}</Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      )}

      <p className={styles.disclaimer}>{toolsMessages.disclaimer}</p>
    </div>
  );
}
