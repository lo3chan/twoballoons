module.exports = grammar({
  name: "logi",

  extras: ($) => [/\s/, $.comment],

  rules: {
    source_file: ($) => repeat($._statement),

    _statement: ($) =>
      choice(
        $.entity_declaration,
        $.relation,
        $.assertion,
        $.view_projection,
        $.gate_declaration,
      ),

    comment: ($) => token(seq("//", /.*/)),

    // Entities
    entity_declaration: ($) =>
      seq(
        field(
          "kind",
          choice("actor", "component", "store", "claim", "boundary"),
        ),
        field("name", $.identifier),
        "{",
        repeat($.property),
        "}",
      ),

    property: ($) =>
      seq(
        field("key", $.identifier),
        ":",
        field("value", choice($.string, $.list, $.identifier)),
      ),

    // Logic Gates
    gate_declaration: ($) =>
      seq(
        "gate",
        field("name", $.identifier),
        "=",
        field("operation", $.gate_operation),
      ),

    gate_operation: ($) =>
      seq(
        field("operator", choice("AND", "OR", "NOT")),
        "(",
        commaSep($.identifier),
        ")",
      ),

    // Relations
    relation: ($) =>
      seq(
        field("from", $.identifier),
        field("operator", choice("->", "<=>", "=>", "=/=", "..>")),
        field("to", $.identifier),
        optional(seq(":", field("label", $.string))),
      ),

    // Assertions
    assertion: ($) => seq("assert", field("expression", $.logic_expression)),

    logic_expression: ($) =>
      seq(
        field("left", choice($.identifier, $.gate_operation)),
        "=>",
        field("right", $.identifier),
      ),

    // Projections
    view_projection: ($) =>
      seq("@view", field("name", $.identifier), "{", repeat($.property), "}"),

    // Primitives
    identifier: ($) => /[a-zA-Z_][a-zA-Z0-9_\.]*/,
    string: ($) => seq('"', /[^"]*/, '"'),
    list: ($) => seq("[", commaSep($.identifier), "]"),
  },
});

function commaSep(rule) {
  return optional(commaSep1(rule));
}

function commaSep1(rule) {
  return seq(rule, repeat(seq(",", rule)));
}
