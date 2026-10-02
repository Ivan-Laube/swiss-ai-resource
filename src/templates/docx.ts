import {
  AlignmentType,
  BorderStyle,
  Document,
  ExternalHyperlink,
  Footer,
  HeadingLevel,
  LevelFormat,
  Packer,
  PageNumber,
  Paragraph,
  ShadingType,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
  type IRunOptions,
  type ParagraphChild,
} from "docx";
import { marked, type Token, type Tokens } from "marked";

import { PLACEHOLDER_RE } from "./load";

/**
 * Markdown → Word (.docx) for downloadable templates (T50). Supports what
 * the templates use: headings, paragraphs, bold/italic/code/links, nested
 * lists, tables, block quotes (rendered as a shaded guidance box) and rules.
 * `[Placeholders]` are highlighted so they're easy to find and replace.
 * Anything else fails loudly instead of being dropped silently.
 */

type RunStyle = Pick<IRunOptions, "bold" | "italics" | "font">;

const FONT = "Calibri";
const GUIDANCE_FILL = "EEF2F7";
const BORDER_COLOR = "94A3B8";

function decodeEntities(text: string): string {
  return text
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

/**
 * Text runs, with `[placeholders]` highlighted. Line breaks inside a
 * paragraph are kept: in a fill-in template two source lines are meant as
 * two lines (e.g. company name above the document title).
 */
function textRuns(text: string, style: RunStyle): TextRun[] {
  const lines = text.split("\n");
  if (lines.length > 1) {
    return lines.flatMap((line, i) => [
      ...(i > 0 ? [new TextRun({ break: 1 })] : []),
      ...textRuns(line, style),
    ]);
  }
  const runs: TextRun[] = [];
  let last = 0;
  for (const match of text.matchAll(PLACEHOLDER_RE)) {
    const at = match.index ?? 0;
    if (at > last) {
      runs.push(new TextRun({ ...style, text: text.slice(last, at) }));
    }
    runs.push(new TextRun({ ...style, text: match[0], highlight: "yellow" }));
    last = at + match[0].length;
  }
  if (last < text.length) {
    runs.push(new TextRun({ ...style, text: text.slice(last) }));
  }
  return runs;
}

function inline(tokens: Token[] | undefined, style: RunStyle = {}): ParagraphChild[] {
  const out: ParagraphChild[] = [];
  for (const token of tokens ?? []) {
    switch (token.type) {
      case "text":
      case "escape": {
        const t = token as Tokens.Text;
        if (t.tokens && t.tokens.length > 0) {
          out.push(...inline(t.tokens, style));
        } else {
          out.push(...textRuns(decodeEntities(t.text), style));
        }
        break;
      }
      case "strong":
        out.push(...inline((token as Tokens.Strong).tokens, { ...style, bold: true }));
        break;
      case "em":
        out.push(...inline((token as Tokens.Em).tokens, { ...style, italics: true }));
        break;
      case "codespan":
        out.push(new TextRun({ ...style, text: decodeEntities((token as Tokens.Codespan).text), font: "Consolas" }));
        break;
      case "link": {
        const link = token as Tokens.Link;
        out.push(
          new ExternalHyperlink({
            link: link.href,
            children: [new TextRun({ ...style, text: decodeEntities(link.text), style: "Hyperlink" })],
          }),
        );
        break;
      }
      case "br":
      case "softbreak":
        out.push(new TextRun({ break: 1 }));
        break;
      default:
        throw new Error(`Unsupported inline Markdown in template: ${token.type}`);
    }
  }
  return out;
}

type BlockContext = {
  /** Inside a block quote: indented, shaded guidance box. */
  guidance: boolean;
  nextListInstance: () => number;
};

function guidanceProps(ctx: BlockContext) {
  return ctx.guidance
    ? {
        shading: { type: ShadingType.CLEAR, fill: GUIDANCE_FILL, color: "auto" },
        border: { left: { style: BorderStyle.SINGLE, size: 18, color: BORDER_COLOR, space: 8 } },
        indent: { left: 240, right: 240 },
      }
    : {};
}

const HEADINGS = [
  HeadingLevel.TITLE,
  HeadingLevel.HEADING_1,
  HeadingLevel.HEADING_2,
  HeadingLevel.HEADING_3,
] as const;

function list(token: Tokens.List, ctx: BlockContext, level: number): Paragraph[] {
  const instance = ctx.nextListInstance();
  const out: Paragraph[] = [];
  for (const item of token.items) {
    const [first, ...rest] = item.tokens;
    const children =
      first && (first.type === "text" || first.type === "paragraph")
        ? inline((first as Tokens.Text).tokens ?? [first])
        : [];
    out.push(
      new Paragraph({
        ...guidanceProps(ctx),
        children,
        ...(token.ordered
          ? { numbering: { reference: "ordered", level, instance } }
          : { bullet: { level } }),
      }),
    );
    for (const child of children.length > 0 ? rest : item.tokens) {
      if (child.type === "list") {
        out.push(...list(child as Tokens.List, ctx, level + 1));
      } else if (child.type !== "space") {
        out.push(...(block([child], ctx) as Paragraph[]));
      }
    }
  }
  return out;
}

function table(token: Tokens.Table): Table {
  const columns = token.header.length;
  const cell = (cellToken: Tokens.TableCell, header: boolean) =>
    new TableCell({
      width: { size: Math.floor(100 / columns), type: WidthType.PERCENTAGE },
      shading: header ? { type: ShadingType.CLEAR, fill: GUIDANCE_FILL, color: "auto" } : undefined,
      children: [new Paragraph({ children: inline(cellToken.tokens, header ? { bold: true } : {}) })],
    });
  // `| | |` header rows exist only because Markdown tables need one.
  const hasHeader = token.header.some((c) => c.text.trim() !== "");
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      ...(hasHeader
        ? [new TableRow({ tableHeader: true, children: token.header.map((c) => cell(c, true)) })]
        : []),
      ...token.rows.map((row) => new TableRow({ children: row.map((c) => cell(c, false)) })),
    ],
  });
}

function block(tokens: Token[], ctx: BlockContext): (Paragraph | Table)[] {
  const out: (Paragraph | Table)[] = [];
  for (const token of tokens) {
    switch (token.type) {
      case "space":
        break;
      case "heading": {
        const h = token as Tokens.Heading;
        out.push(
          new Paragraph({
            heading: HEADINGS[Math.min(h.depth, 4) - 1],
            children: inline(h.tokens),
          }),
        );
        break;
      }
      case "paragraph":
        out.push(
          new Paragraph({
            ...guidanceProps(ctx),
            children: inline((token as Tokens.Paragraph).tokens),
          }),
        );
        break;
      case "list":
        out.push(...list(token as Tokens.List, ctx, 0));
        break;
      case "table":
        out.push(table(token as Tokens.Table), new Paragraph({}));
        break;
      case "blockquote":
        out.push(...block((token as Tokens.Blockquote).tokens, { ...ctx, guidance: true }));
        break;
      case "hr":
        out.push(
          new Paragraph({
            border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: BORDER_COLOR, space: 1 } },
          }),
        );
        break;
      case "code":
        out.push(
          new Paragraph({
            children: [new TextRun({ text: (token as Tokens.Code).text, font: "Consolas" })],
          }),
        );
        break;
      default:
        throw new Error(`Unsupported Markdown block in template: ${token.type}`);
    }
  }
  return out;
}

/** Convert a template's Markdown to a .docx file. */
export async function markdownToDocx(
  markdown: string,
  meta: { title: string; footer: string },
): Promise<Buffer> {
  let instance = 0;
  const children = block(marked.lexer(markdown), {
    guidance: false,
    nextListInstance: () => ++instance,
  });

  const doc = new Document({
    title: meta.title,
    creator: "aicompliant.ch",
    styles: {
      default: { document: { run: { font: FONT, size: 22 } } },
    },
    numbering: {
      config: [
        {
          reference: "ordered",
          levels: [0, 1, 2].map((level) => ({
            level,
            format: LevelFormat.DECIMAL,
            text: `%${level + 1}.`,
            alignment: AlignmentType.START,
            style: { paragraph: { indent: { left: 360 * (level + 1), hanging: 360 } } },
          })),
        },
      ],
    },
    sections: [
      {
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({ text: `${meta.footer} · `, size: 16, color: "64748B" }),
                  new TextRun({ children: [PageNumber.CURRENT], size: 16, color: "64748B" }),
                ],
              }),
            ],
          }),
        },
        children,
      },
    ],
  });

  return Packer.toBuffer(doc);
}
