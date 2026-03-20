import type { ThemeRegistration } from "shiki";

/**
 * Custom Shiki theme — Tell brand.
 *
 * Restrained 3-tone palette:
 *   Brand violet (#8B83F0 light / #645AE6 base) for the important stuff
 *   Zinc scale for everything else
 *   One warm accent (#d4a373) for strings — subtle, not competing
 */
export const tellTheme: ThemeRegistration = {
  name: "tell",
  type: "dark",
  colors: {
    "editor.background": "#141415",
    "editor.foreground": "#a1a1aa",
  },
  settings: [
    // Default text — base zinc
    {
      scope: [],
      settings: { foreground: "#a1a1aa" },
    },
    // Comments — quiet
    {
      scope: ["comment", "punctuation.definition.comment"],
      settings: { foreground: "#3f3f46" },
    },
    // Keywords, control, storage — brand (lighter so it pops on dark bg)
    {
      scope: [
        "keyword",
        "keyword.control",
        "keyword.operator.logical",
        "keyword.operator.new",
        "keyword.operator.expression",
        "keyword.other",
        "storage.type",
        "storage.modifier",
      ],
      settings: { foreground: "#8B83F0" },
    },
    // Functions, method calls — light zinc, readable but not screaming
    {
      scope: [
        "entity.name.function",
        "meta.function-call",
        "support.function",
        "variable.function",
      ],
      settings: { foreground: "#e4e4e7" },
    },
    // Strings — warm muted sand (one deliberate non-violet accent)
    {
      scope: [
        "string",
        "string.quoted",
        "punctuation.definition.string",
      ],
      settings: { foreground: "#d4a373" },
    },
    // Numbers, constants — slightly brighter zinc
    {
      scope: [
        "constant.numeric",
        "constant.language",
        "constant.character",
        "constant.other",
      ],
      settings: { foreground: "#d4d4d8" },
    },
    // Types, classes — brand violet
    {
      scope: [
        "entity.name.type",
        "entity.name.class",
        "support.type",
        "support.class",
        "entity.other.inherited-class",
      ],
      settings: { foreground: "#8B83F0" },
    },
    // Variables, parameters
    {
      scope: [
        "variable",
        "variable.other",
        "variable.parameter",
        "meta.object-literal.key",
      ],
      settings: { foreground: "#a1a1aa" },
    },
    // Properties
    {
      scope: [
        "variable.other.property",
        "variable.other.object.property",
        "support.variable.property",
      ],
      settings: { foreground: "#a1a1aa" },
    },
    // Operators, punctuation — quiet
    {
      scope: [
        "keyword.operator",
        "punctuation",
        "punctuation.separator",
        "punctuation.terminator",
        "meta.brace",
      ],
      settings: { foreground: "#52525b" },
    },
    // Macros (Rust props!, vec!) — brand, same as keywords
    {
      scope: [
        "entity.name.function.macro",
        "support.function.macro",
        "entity.name.macro",
      ],
      settings: { foreground: "#8B83F0" },
    },
    // Attributes, annotations
    {
      scope: [
        "entity.other.attribute-name",
        "meta.attribute",
      ],
      settings: { foreground: "#71717a" },
    },
    // Module/namespace
    {
      scope: [
        "entity.name.module",
        "entity.name.namespace",
        "support.other.module",
      ],
      settings: { foreground: "#a1a1aa" },
    },
    // Lifetime (Rust 'a)
    {
      scope: [
        "storage.modifier.lifetime",
        "entity.name.lifetime",
        "punctuation.definition.lifetime",
      ],
      settings: { foreground: "#8B83F0" },
    },
    // Errors
    {
      scope: ["invalid", "invalid.illegal"],
      settings: { foreground: "#f87171" },
    },
  ],
};
