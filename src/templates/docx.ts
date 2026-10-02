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
  PageOrientation,
  Paragraph,
  ShadingType,
  Table,
  TableCell,
  TableLayoutType,
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

type RunStyle = Pick<IRunOptions, "bold" | "italics" | "font" | "size">;

const FONT = "Calibri";
/** Font size in half-points (Word's unit): 11 pt body, 9 pt in wide tables. */
const BODY_SIZE = 22;
const WIDE_TABLE_SIZE = 18;
/** Tables with this many columns or more use the smaller font. */
const WIDE_TABLE_COLUMNS = 7;

/**
 * A4 portrait, in twips (1/20 pt). Side margins match WordPad's fixed
 * default (3.17 cm): WordPad ignores the document's margins and orientation
 * but sizes percentage-wide tables from them, so with any other value
 * tables overflow there. Word shows the same layout.
 */
const A4 = { width: 11906, height: 16838 };
const MARGIN = { top: 1134, bottom: 1134, side: 1800 };
const TEXT_WIDTH = A4.width - 2 * MARGIN.side;

/** List indent per level (also the hanging indent for bullet/number), in twips. */
const LIST_INDENT = 360;
/** Extra left indent of the guidance box (block quotes). */
const GUIDANCE_INDENT = 240;
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
        indent: { left: GUIDANCE_INDENT, right: GUIDANCE_INDENT },
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
        // Explicit indent: the guidance box's own indent would otherwise
        // override the list indent and push bullets out of alignment.
        indent: {
          left: (ctx.guidance ? GUIDANCE_INDENT : 0) + LIST_INDENT * (level + 1),
          hanging: LIST_INDENT,
          ...(ctx.guidance ? { right: GUIDANCE_INDENT } : {}),
        },
        spacing: { after: 60 },
        children,
        numbering: { reference: token.ordered ? "ordered" : "bullet", level, instance },
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

function isWide(token: Token): boolean {
  return token.type === "table" && (token as Tokens.Table).header.length >= WIDE_TABLE_COLUMNS;
}

/** Left + right cell margin, in twips. */
const CELL_PADDING = 120;

const NARROW = new Set("iljtfrI.,;:!|'()[]/ -");
const WIDE = new Set("mwMWOQGDHNU@%");

/**
 * Rough width of a text in em for Calibri, per glyph class. Bold runs about
 * 7% wider. Accurate enough to keep words like "Owner" (wide letters) from
 * breaking without wasting width on narrow ones.
 */
function textEm(text: string, bold: boolean): number {
  let em = 0;
  for (const ch of text) {
    em += NARROW.has(ch) ? 0.3 : WIDE.has(ch) ? 0.8 : /[A-ZÄÖÜ]/.test(ch) ? 0.62 : 0.5;
  }
  return bold ? em * 1.07 : em;
}

/**
 * Column widths in twips. Every column gets at least its widest word, so no
 * word breaks mid-way; short values ("ja / nein") stay on one line; long
 * text may wrap. Spare width is shared equally, since fill-in columns with
 * short headers (e.g. "Purpose") need room for what people will write.
 * When space is short, only the part above the widest word shrinks.
 */
function columnWidths(token: Tokens.Table, total: number, sizeHalfPt: number): number[] {
  const twipsPerEm = (sizeHalfPt / 2) * 20;
  const SLACK = 0.4; // em
  const columns = token.header.map((header, col) => {
    const cells = [
      { text: header.text, bold: true },
      ...token.rows.map((row) => ({ text: row[col]?.text ?? "", bold: false })),
    ];
    // Never broken: the widest word, and short values ("ja / nein") as a whole.
    const unbreakable = Math.max(
      ...cells.flatMap((c) => [
        ...c.text.split(/\s+/).map((w) => textEm(w, c.bold)),
        ...(c.text.length <= 12 ? [textEm(c.text, c.bold)] : []),
      ]),
    );
    // Long text may wrap, but should not become a narrow column.
    const longText = Math.max(...cells.map((c) => textEm(c.text, c.bold) / 6));
    const min = (unbreakable + SLACK) * twipsPerEm + CELL_PADDING;
    const want = Math.max(min, (longText + SLACK) * twipsPerEm + CELL_PADDING);
    return { min, want };
  });

  const sumWant = columns.reduce((a, c) => a + c.want, 0);
  if (sumWant <= total) {
    return columns.map((c) => Math.floor(c.want + (total - sumWant) / columns.length));
  }
  const sumMin = columns.reduce((a, c) => a + c.min, 0);
  if (sumMin >= total) {
    return columns.map((c) => Math.floor((c.min / sumMin) * total));
  }
  const flexible = sumWant - sumMin;
  return columns.map((c) => Math.floor(c.min + ((c.want - c.min) / flexible) * (total - sumMin)));
}

function table(token: Tokens.Table, textWidth: number): Table {
  const style: RunStyle = isWide(token) ? { size: WIDE_TABLE_SIZE } : {};
  const widths = columnWidths(token, textWidth, typeof style.size === "number" ? style.size : BODY_SIZE);
  // Percentages, not fixed widths: viewers that ignore the page setup
  // (WordPad uses its own page size and no landscape) still fit the table.
  const total = widths.reduce((a, b) => a + b, 0);
  const percent = widths.map((w) => Math.max(1, Math.round((w / total) * 100)));
  const cell = (cellToken: Tokens.TableCell, col: number, header: boolean) =>
    new TableCell({
      width: { size: percent[col], type: WidthType.PERCENTAGE },
      shading: header ? { type: ShadingType.CLEAR, fill: GUIDANCE_FILL, color: "auto" } : undefined,
      margins: { top: 40, bottom: 40, left: CELL_PADDING / 2, right: CELL_PADDING / 2 },
      children: [
        new Paragraph({
          spacing: { after: 0 },
          children: inline(cellToken.tokens, header ? { ...style, bold: true } : style),
        }),
      ],
    });
  // `| | |` header rows exist only because Markdown tables need one.
  const hasHeader = token.header.some((c) => c.text.trim() !== "");
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    layout: TableLayoutType.FIXED,
    rows: [
      ...(hasHeader
        ? [new TableRow({ tableHeader: true, children: token.header.map((c, i) => cell(c, i, true)) })]
        : []),
      ...token.rows.map((row) => new TableRow({ children: row.map((c, i) => cell(c, i, false)) })),
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
            keepNext: true,
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
        out.push(table(token as Tokens.Table, TEXT_WIDTH), new Paragraph({}));
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

/**
 * Title size (half-points) that fits the title on one portrait line,
 * assuming an average Calibri Light glyph width of about half an em.
 */
export function titleSize(title: string): number {
  const fitPt = TEXT_WIDTH / 20 / (title.length * 0.5);
  return Math.max(36, Math.min(56, Math.floor(fitPt) * 2));
}

/** Convert a template's Markdown to a .docx file. */
export async function markdownToDocx(
  markdown: string,
  meta: { title: string; footer: string },
): Promise<Buffer> {
  let instance = 0;
  const nextListInstance = () => ++instance;

  const footer = () =>
    new Footer({
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: `${meta.footer} · `, size: 16, color: "64748B" }),
            new TextRun({ children: [PageNumber.CURRENT], size: 16, color: "64748B" }),
          ],
        }),
      ],
    });

  const sections = [
    {
      properties: {
        page: {
          size: { width: A4.width, height: A4.height, orientation: PageOrientation.PORTRAIT },
          margin: { top: MARGIN.top, bottom: MARGIN.bottom, left: MARGIN.side, right: MARGIN.side },
        },
      },
      footers: { default: footer() },
      children: block(marked.lexer(markdown), { guidance: false, nextListInstance }),
    },
  ];

  const levels = (format: "ordered" | "bullet") =>
    [0, 1, 2].map((level) => ({
      level,
      format: format === "ordered" ? LevelFormat.DECIMAL : LevelFormat.BULLET,
      text: format === "ordered" ? `%${level + 1}.` : ["•", "–", "•"][level],
      alignment: AlignmentType.START,
      style: { paragraph: { indent: { left: LIST_INDENT * (level + 1), hanging: LIST_INDENT } } },
    }));

  const doc = new Document({
    title: meta.title,
    creator: "aicompliant.ch",
    styles: {
      default: {
        document: {
          run: { font: FONT, size: BODY_SIZE },
          paragraph: { spacing: { after: 120 } },
        },
        title: { run: { size: titleSize(meta.title) }, paragraph: { spacing: { after: 240 } } },
        // A blank line's worth of space before each numbered section.
        heading1: { paragraph: { spacing: { before: 480, after: 120 } } },
        heading2: { paragraph: { spacing: { before: 240, after: 80 } } },
      },
    },
    numbering: {
      config: [
        { reference: "ordered", levels: levels("ordered") },
        { reference: "bullet", levels: levels("bullet") },
      ],
    },
    sections,
  });

  return Packer.toBuffer(doc);
}
