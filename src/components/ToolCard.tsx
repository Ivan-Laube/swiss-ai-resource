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

export function ToolCard({ tree, locale, maxQuestionsLabel }: ToolCardProps) {
  const maxQuestions = longestQuestionCount(tree, tree.start);
  const meta = maxQuestionsLabel.replace("{count}", String(maxQuestions));

  return (
    <Card href={`/${locale}/tools/${tree.id}/`} className={styles.card}>
      <h2 className={styles.title}>{pickLocalized(tree.title, locale)}</h2>
      <p className={styles.description}>
        {pickLocalized(tree.description, locale)}
      </p>
      <p className={styles.meta}>{meta}</p>
    </Card>
  );
}
