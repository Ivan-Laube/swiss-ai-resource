import type { de } from "./messages/de";

export type Messages = {
  [K in keyof typeof de]: (typeof de)[K] extends string
    ? string
    : { [P in keyof (typeof de)[K]]: string };
};
