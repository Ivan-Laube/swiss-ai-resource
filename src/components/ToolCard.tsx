import { Card } from "@/components/ui";
import type { Locale } from "@/i18n/config";
import type { Messages } from "@/i18n/types";
import { longestQuestionCount } from "@/rules/path";
import { pickLocalized, type DecisionTree } from "@/rules/schema";

import styles from "./ToolCard.module.css";

type ToolCardProps = {
  tree: DecisionTree;
  locale: Locale;
  maxQuestionsLabel: Messages["tools"]["maxQuestions"];
};

/** Card for any tool on the tools index (decision trees, readiness check). */
export function ToolLinkCard({
  href,
  title,
  description,
  meta,
}: {
  href: string;
  title: string;
  description: string;
  meta: string;
}) {
  return (
    <Card href={href} className={styles.card}>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.description}>{description}</p>
      <p className={styles.meta}>{meta}</p>
    </Card>
  );
}

export function ToolCard({ tree, locale, maxQuestionsLabel }: ToolCardProps) {
  const maxQuestions = longestQuestionCount(tree, tree.start);
  return (
    <ToolLinkCard
      href={`/${locale}/tools/${tree.id}/`}
      title={pickLocalized(tree.title, locale)}
      description={pickLocalized(tree.description, locale)}
      meta={maxQuestionsLabel.replace("{count}", String(maxQuestions))}
    />
  );
}
