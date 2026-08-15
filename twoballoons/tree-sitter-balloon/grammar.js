module.exports = grammar({
  name: 'balloon',

  rules: {
    source_file: $ => repeat($._statement),

    _statement: $ => choice(
      $.entity_declaration,
      $.relation,
      $.assertion,
      $.view_projection,
      $.state_block,
      $.edge_decl
    ),

    // LogiDSL entities
    entity_declaration: $ => seq(
      field('kind', choice('actor', 'component', 'store', 'claim', 'boundary')),
      field('name', $.identifier),
      optional($.string),
      optional(seq('{', repeat($.property), '}')),
      ';'
    ),

    property: $ => seq(
      field('key', $.identifier),
      ':',
      field('value', choice($.string, $.array_literal)),
      ';'
    ),

    relation: $ => seq(
      field('from', $.identifier),
      field('operator', choice('->', '<=>', '=>', '=/=', '..>')),
      field('to', $.identifier),
      optional(seq(':', field('label', $.string))),
      ';'
    ),

    assertion: $ => seq(
      'assert',
      field('expression', $.logic_expression),
      ';'
    ),

    view_projection: $ => seq(
      'view',
      field('name', $.identifier),
      optional(seq('{', repeat($.property), '}')),
      ';'
    ),

    // PhiloDSL states and edges
    state_block: $ => seq(
      'state',
      field('name', $.identifier),
      optional($.string),
      optional(seq('{', repeat($.state_stmt), '}')),
    ),

    state_stmt: $ => seq($.formula, ';'),

    edge_decl: $ => seq(
      field('from', $.identifier),
      '--[',
      field('relation', $.identifier),
      ']-->',
      field('to', $.identifier),
      ';'
    ),

    // Logic and formulas combined
    logic_expression: $ => choice(
        $.identifier,
        $.string,
        seq('not', '(', $.logic_expression, ')'),
        seq('and', '(', $.logic_expression, ',', $.logic_expression, ')'),
        seq('or', '(', $.logic_expression, ',', $.logic_expression, ')'),
        seq('implies', '(', $.logic_expression, ',', $.logic_expression, ')'),
        seq('knows', '(', $.identifier, ',', $.logic_expression, ')'),
        seq('believes', '(', $.identifier, ',', $.logic_expression, ')'),
        seq('world', '(', $.identifier, ',', $.logic_expression, ')'),
        seq('future_nec', '(', $.logic_expression, ')'),
        seq('always', '(', $.logic_expression, ')'),
        seq('common_knowledge', '(', $.array_literal, ',', $.logic_expression, ')'),
    ),

    formula: $ => $.logic_expression,

    // Basic types
    identifier: $ => /[a-zA-Z_][a-zA-Z0-9_]*/,
    string: $ => /"[^"]*"/,
    number: $ => /[0-9]+/,
    array_literal: $ => seq('[', optional(seq($.string, repeat(seq(',', $.string)))), ']')
  }
});
