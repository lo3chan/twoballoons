module.exports = grammar({
  name: "philo",

  extras: ($) => [/\s/, /\/\/.*|\/\*[\s\S]*?\*\//],

  conflicts: ($) => [
    [$.immanent_judgement, $.extensional_f, $.term],
    [$.term, $.extensional_f],
    [$.immanent_judgement, $.extensional_f],
  ],

  rules: {
    // Document Structure
    source_file: ($) => seq(repeat($.declaration), repeat($.block)),

    // Declarations
    declaration: ($) =>
      choice(
        $.agent_decl,
        $.prop_decl,
        $.nominal_decl,
        $.sort_decl,
        $.relation_decl,
        $.preference_decl,
      ),

    agent_decl: ($) =>
      seq("agent", field("name", $.identifier), optional($.string), ";"),
    prop_decl: ($) =>
      seq(
        "prop",
        field("name", $.identifier),
        optional(seq(":", $.string)),
        ";",
      ),
    nominal_decl: ($) => seq("nominal", field("name", $.identifier), ";"),
    sort_decl: ($) =>
      seq(
        "sort",
        field("name", $.identifier),
        optional(seq(":", $.string)),
        ";",
      ),

    relation_decl: ($) =>
      seq(
        "relation",
        field("name", $.identifier),
        optional($.string),
        optional(seq("{", $.relation_attribute_list, "}")),
        ";",
      ),

    preference_decl: ($) =>
      seq(
        "preference_relation",
        field("name", $.identifier),
        "for",
        field("agent", $.identifier),
        optional(seq("{", $.pref_attribute_list, "}")),
        ";",
      ),

    relation_attribute_list: ($) =>
      seq($.rel_attribute, repeat(seq(",", $.rel_attribute))),
    rel_attribute: ($) =>
      choice(
        "reflexive",
        "transitive",
        "symmetric",
        "Euclidean",
        "serial",
        "convergent",
        "modular",
      ),

    pref_attribute_list: ($) =>
      seq($.pref_attribute, repeat(seq(",", $.pref_attribute))),
    pref_attribute: ($) =>
      choice("reflexive", "transitive", "locally_connected", "well_founded"),

    // Blocks
    block: ($) =>
      choice(
        $.state_block,
        $.action_model_block,
        $.dialogue_block,
        $.evaluate_block,
        $.edge_decl, // Added to handle w1 --[R]--> w2
      ),

    // Edge declaration e.g. w_ideal --[access_Deontic]--> w_actual;
    edge_decl: ($) =>
      seq(
        field("from", $.identifier),
        "--[",
        field("relation", $.identifier),
        "]-->",
        field("to", $.identifier),
        ";",
      ),

    state_block: ($) =>
      seq(
        "state",
        field("name", $.identifier),
        optional($.string),
        optional(seq("{", repeat($.state_stmt), "}")),
      ),

    state_stmt: ($) => choice(seq($.formula, ";"), seq($.assignment_stmt, ";")),

    assignment_stmt: ($) => seq(field("var", $.identifier), "=", $.formula),

    evaluate_block: ($) =>
      seq(
        "evaluate",
        field("name", $.identifier),
        "{",
        repeat($.evaluation_stmt),
        "}",
      ),
    evaluation_stmt: ($) =>
      seq(
        field("premise", $.formula),
        "=>",
        field("conclusion", $.formula),
        ";",
      ),

    action_model_block: ($) =>
      seq(
        "action_model",
        field("name", $.identifier),
        "{",
        repeat($.event_block),
        "}",
      ),
    event_block: ($) =>
      seq(
        "event",
        field("name", $.identifier),
        "{",
        "pre",
        ":",
        $.formula,
        ";",
        optional(seq("plausibility", ":", $.number, ";")),
        "}",
      ),

    dialogue_block: ($) =>
      seq(
        "dialogue",
        field("name", $.identifier),
        "{",
        "thesis",
        ":",
        $.formula,
        ";",
        "rules",
        ":",
        choice("intuitionistic", "classical", "immanent"),
        ";",
        "repetition",
        ":",
        $.number,
        ";",
        optional(seq("concessions", ":", $.formula_list, ";")),
        repeat($.dialogue_move),
        "}",
      ),

    dialogue_move: ($) =>
      choice(
        seq(
          field("player", $.identifier),
          "states",
          $.formula,
          optional(seq("challenges", field("target", $.identifier))),
          ";",
        ),
        seq(
          field("player", $.identifier),
          "requests",
          $.string,
          optional(seq("challenges", field("target", $.identifier))),
          ";",
        ),
        seq(
          field("player", $.identifier),
          "states_ctt",
          $.immanent_judgement,
          optional(seq("challenges", field("target", $.identifier))),
          ";",
        ),
      ),

    immanent_judgement: ($) =>
      prec(
        2,
        choice(
          seq($.term, ":", $.formula),
          seq($.term, "=", $.term, ":", $.formula),
          seq($.formula, ":", "prop"),
          seq($.identifier, ":", "set"),
        ),
      ),

    // Formulas
    formula: ($) =>
      choice(
        $.extensional_f,
        $.modal_f,
        $.conditional_f,
        $.substructural_f,
        $.epistemic_f,
        $.justification_f,
        $.dynamic_f,
        $.temporal_f,
        $.deontic_f,
        $.agential_f,
      ),

    extensional_f: ($) =>
      choice(
        seq("not", "(", $.formula, ")"),
        seq("and", "(", $.formula, ",", $.formula, ")"),
        seq("or", "(", $.formula, ",", $.formula, ")"),
        seq("impl", "(", $.formula, ",", $.formula, ")"),
        seq("equiv", "(", $.formula, ",", $.formula, ")"),
        seq(
          "forall",
          "(",
          $.identifier,
          ",",
          $.identifier,
          ",",
          $.formula,
          ")",
        ),
        seq(
          "exists",
          "(",
          $.identifier,
          ",",
          $.identifier,
          ",",
          $.formula,
          ")",
        ),
        seq("exists_imp", "(", $.identifier, ")"),
        seq(
          "abstract",
          "(",
          $.identifier,
          ",",
          $.formula,
          ",",
          $.identifier,
          ")",
        ),
        $.identifier,
      ),

    modal_f: ($) =>
      choice(
        seq("box", "(", $.formula, ")"),
        seq("dia", "(", $.formula, ")"),
        seq("global_box", "(", $.formula, ")"),
        seq("global_dia", "(", $.formula, ")"),
        seq("at", "(", $.identifier, ",", $.formula, ")"),
        seq("bind", "(", $.identifier, ",", $.formula, ")"),
      ),

    conditional_f: ($) =>
      choice(
        seq("strict_impl", "(", $.formula, ",", $.formula, ")"),
        seq("counterfactual", "(", $.formula, ",", $.formula, ")"),
        seq("connexive_impl", "(", $.formula, ",", $.formula, ")"),
        seq("relatedness_impl", "(", $.formula, ",", $.formula, ")"),
      ),

    substructural_f: ($) =>
      choice(
        seq("fusion", "(", $.formula, ",", $.formula, ")"),
        seq("lollipop", "(", $.formula, ",", $.formula, ")"),
        seq("bang", "(", $.formula, ")"),
        seq("quest", "(", $.formula, ")"),
        seq("sequent", "(", $.formula_list, ",", $.formula_list, ")"),
      ),

    formula_list: ($) =>
      seq("[", optional(seq($.formula, repeat(seq(",", $.formula)))), "]"),

    epistemic_f: ($) =>
      choice(
        seq("know", "(", $.identifier, ",", $.formula, ")"),
        seq("believe", "(", $.identifier, ",", $.formula, ")"),
        seq(
          "cond_believe",
          "(",
          $.identifier,
          ",",
          $.formula,
          ",",
          $.formula,
          ")",
        ),
        seq("everybody_knows", "(", $.identifier_list, ",", $.formula, ")"),
        seq("common_know", "(", $.identifier_list, ",", $.formula, ")"),
        seq(
          "rel_common_know",
          "(",
          $.identifier_list,
          ",",
          $.formula,
          ",",
          $.formula,
          ")",
        ),
        seq("dist_know", "(", $.identifier_list, ",", $.formula, ")"),
      ),

    identifier_list: ($) =>
      seq(
        "[",
        optional(seq($.identifier, repeat(seq(",", $.identifier)))),
        "]",
      ),

    justification_f: ($) => seq("justify", "(", $.term, ",", $.formula, ")"),

    term: ($) =>
      prec(
        1,
        choice(
          $.term_variable,
          $.term_constant,
          $.term_apply,
          $.term_sum,
          $.term_verify,
          $.term_negative_inspect,
          $.identifier, // adding identifier for simplicity (e.g., 't', 's')
        ),
      ),

    term_variable: ($) =>
      choice(
        seq("x", optional($.number)),
        seq("y", optional($.number)),
        seq("z", optional($.number)),
      ),

    term_constant: ($) =>
      choice(
        seq("a", optional($.number)),
        seq("b", optional($.number)),
        seq("c", optional($.number)),
      ),

    term_apply: ($) => seq("apply", "(", $.term, ",", $.term, ")"),
    term_sum: ($) => seq("sum", "(", $.term, ",", $.term, ")"),
    term_verify: ($) => seq("verify", "(", $.term, ")"),
    term_negative_inspect: ($) => seq("neg_inspect", "(", $.term, ")"),

    dynamic_f: ($) =>
      choice(
        seq("announce", "(", $.formula, ",", $.formula, ")"),
        seq("radical_upgrade", "(", $.formula, ")"),
        seq("suggestion", "(", $.formula, ")"),
        seq(
          "action",
          "(",
          $.identifier,
          ",",
          $.identifier,
          ",",
          $.formula,
          ")",
        ),
      ),

    deontic_f: ($) =>
      choice(
        seq("oblig", "(", $.formula, ")"),
        seq("perm", "(", $.formula, ")"),
        seq("forbid", "(", $.formula, ")"),
        seq("dyadic_oblig", "(", $.formula, ",", $.formula, ")"),
        seq("optional", "(", $.formula, ")"),
        seq("indifferent", "(", $.formula, ")"),
        "violation",
      ),

    agential_f: ($) =>
      choice(
        seq("cstit", "(", $.identifier, ",", $.formula, ")"),
        seq("dstit", "(", $.identifier, ",", $.formula, ")"),
        seq("brings_about", "(", $.identifier, ",", $.formula, ")"),
        seq("refrain", "(", $.identifier, ",", $.formula, ")"),
      ),

    temporal_f: ($) =>
      choice(
        seq("future_pos", "(", $.formula, ")"),
        seq("future_nec", "(", $.formula, ")"),
        seq("past_pos", "(", $.formula, ")"),
        seq("past_nec", "(", $.formula, ")"),
        seq("meets", "(", $.formula, ")"),
        seq("starts", "(", $.formula, ")"),
        seq("during", "(", $.formula, ")"),
        seq("overlaps", "(", $.formula, ")"),
        seq("chop", "(", $.formula, ",", $.formula, ")"),
        "point_interval",
      ),

    identifier: ($) => /[a-zA-Z_][a-zA-Z0-9_]*/,
    string: ($) => /"[^"]*"/,
    number: ($) => /[0-9]+/,
  },
});
