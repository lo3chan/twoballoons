# PhiloDSL ($\mathcal{L}_{\text{diag}}$): Complete Technical Specification & Language Reference
## Version 2.0.0 — Comprehensive Domain-Specific Language for Philosophical Logic
### Designed for Automated Synthesis, Parsing, AST Compilation, and Semantic Representation

This document serves as the complete, self-contained reference and synthesis guide for **PhiloDSL** ($\mathcal{L}_{\text{diag}}$). It provides the exact lexical grammar, semantic algebras, and compiler architecture required to build a parser and evaluation engine capable of compiling, verifying, and diagramming the entire spectrum of philosophical logics [440, 442].

---

## 1. Syntax and Lexical Grammar (EBNF Specification)

Below is the complete, non-truncated Extended Backus-Naur Form (EBNF) for PhiloDSL. This grammar covers declarations, static world-spaces, action models, preference-ordering networks, dynamic programs, and interactive dialogical games.

```ebnf
(* ========================================== *)
(* Lexical & Primitive Rules                  *)
(* ========================================== *)
identifier     = [a-zA-Z_] { [a-zA-Z0-9_] } ;
string         = '"' { any_character } '"' ;
number         = [0-9]+ ;
whitespace     = { " " | "\t" | "\n" | "\r" } ;

(* ========================================== *)
(* Document Structure                         *)
(* ========================================== *)
specification  = { declaration } { block } ;

declaration    = agent_decl 
               | prop_decl 
               | nominal_decl 
               | sort_decl 
               | relation_decl 
               | preference_decl ;

agent_decl     = "agent" identifier [ string ] ";" ;
prop_decl      = "prop" identifier [ ":" string ] ";" ;
nominal_decl   = "nominal" identifier ";" ;
sort_decl      = "sort" identifier [ ":" string ] ";" ;
relation_decl  = "relation" identifier [ string ] [ "{" relation_attribute_list "}" ] ";" ;
preference_decl= "preference_relation" identifier "for" identifier [ "{" pref_attribute_list "}" ] ";" ;

relation_attribute_list = rel_attribute { "," rel_attribute } ;
rel_attribute           = "reflexive" | "transitive" | "symmetric" | "Euclidean" | "serial" | "convergent" | "modular" ;

pref_attribute_list     = pref_attribute { "," pref_attribute } ;
pref_attribute          = "reflexive" | "transitive" | "locally_connected" | "well_founded" ;

(* ========================================== *)
(* Block Structures                           *)
(* ========================================== *)
block          = state_block 
               | action_model_block 
               | dialogue_block 
               | evaluate_block ;

state_block    = "state" identifier [ string ] [ "{" { state_stmt } "}" ] ;
state_stmt     = ( formula | assignment_stmt ) ";" ;
assignment_stmt= identifier "=" formula ;

evaluate_block = "evaluate" identifier "{" { evaluation_stmt } "}" ;
evaluation_stmt= formula "=>" formula ";" ;

(* ========================================== *)
(* Formulas                                   *)
(* ========================================== *)
formula        = extensional_f 
               | modal_f 
               | conditional_f 
               | substructural_f
               | epistemic_f 
               | justification_f 
               | dynamic_f 
               | temporal_f 
               | deontic_f 
               | agential_f ;

(* Family 1: Extensional, Many-Sorted, & Free Logics *)
extensional_f  = "not" "(" formula ")"
               | "and" "(" formula "," formula ")"
               | "or" "(" formula "," formula ")"
               | "impl" "(" formula "," formula ")"
               | "equiv" "(" formula "," formula ")"
               | "forall" "(" identifier "," identifier "," formula ")" (* forall(var, sort, formula) *)
               | "exists" "(" identifier "," identifier "," formula ")" (* exists(var, sort, formula) *)
               | "exists_imp" "(" identifier ")"                       (* E!t *)
               | "abstract" "(" identifier "," formula "," identifier ")" (* lambda-abstraction *)
               | identifier ; (* propositional variables, constants, terms *)

(* Family 2: Alethic & Hybrid Modalities *)
modal_f        = "box" "(" formula ")"
               | "dia" "(" formula ")"
               | "global_box" "(" formula ")"
               | "global_dia" "(" formula ")"
               | "at" "(" identifier "," formula ")"                   (* satisfaction @ _i *)
               | "bind" "(" identifier "," formula ")"                 (* downarrow binder *) ;

(* Family 3: Conditionals & Connexivity *)
conditional_f  = "strict_impl" "(" formula "," formula ")"
               | "counterfactual" "(" formula "," formula ")"
               | "connexive_impl" "(" formula "," formula ")"
               | "relatedness_impl" "(" formula "," formula ")" ;

(* Family 4: Substructural & Resource Algebras *)
substructural_f= "fusion" "(" formula "," formula ")"                 (* multiplicative conjunction *)
               | "lollipop" "(" formula "," formula ")"               (* linear implication *)
               | "bang" "(" formula ")"                                (* modal exponential !A *)
               | "quest" "(" formula ")"                               (* modal exponential ?A *)
               | "sequent" "(" formula_list "," formula_list ")"       (* proof-theoretic sequent *) ;

formula_list   = "[" [ formula { "," formula } ] "]" ;

(* Family 5: Epistemic & Doxastic Logics *)
epistemic_f    = "know" "(" identifier "," formula ")"                 (* K _a phi *)
               | "believe" "(" identifier "," formula ")"              (* B _a phi *)
               | "cond_believe" "(" identifier "," formula "," formula ")" (* B _a ^ psi phi *)
               | "everybody_knows" "(" identifier_list "," formula ")" (* E _G phi *)
               | "common_know" "(" identifier_list "," formula ")"    (* C _G phi *)
               | "rel_common_know" "(" identifier_list "," formula "," formula ")" (* C_G(phi | psi) *)
               | "dist_know" "(" identifier_list "," formula ")"       (* D _G phi *) ;

identifier_list = "[" [ identifier { "," identifier } ] "]" ;

(* Family 5b: Justification Logics *)
justification_f= "justify" "(" term "," formula ")" ;                  (* t : phi *)

term           = term_variable 
               | term_constant 
               | term_apply 
               | term_sum 
               | term_verify 
               | term_negative_inspect ;

term_variable  = "x" [ number ] | "y" [ number ] | "z" [ number ] ;
term_constant  = "a" [ number ] | "b" [ number ] | "c" [ number ] ;
term_apply     = "apply" "(" term "," term ")" ;                       (* s . t *)
term_sum       = "sum" "(" term "," term ")" ;                         (* s + t *)
term_verify    = "verify" "(" term ")" ;                               (* !t *)
term_negative_inspect = "neg_inspect" "(" term ")" ;                   (* ?t *)

(* Family 6: DEL & Plausibility Dynamics *)
dynamic_f      = "announce" "(" formula "," formula ")"                (* [A!]B *)
               | "radical_upgrade" "(" formula ")"                     (* Up A *)
               | "suggestion" "(" formula ")"                          (* # A *)
               | "action" "(" identifier "," identifier "," formula ")" (* [A, e] phi *) ;

(* Family 7: Deontic & Agential Action Logics *)
deontic_f      = "oblig" "(" formula ")"                               (* O phi *)
               | "perm" "(" formula ")"                                (* P phi *)
               | "forbid" "(" formula ")"                              (* F phi *)
               | "dyadic_oblig" "(" formula "," formula ")"            (* O(phi | psi) *)
               | "optional" "(" formula ")"                            (* OP phi *)
               | "indifferent" "(" formula ")"                         (* IN phi *)
               | "violation" ;                                         (* Andersonian constant V *)

agential_f     = "cstit" "(" identifier "," formula ")"                (* cstit _a phi *)
               | "dstit" "(" identifier "," formula ")"                (* dstit _a phi *)
               | "brings_about" "(" identifier "," formula ")"         (* BA _a phi *)
               | "refrain" "(" identifier "," formula ")"              (* RF _a phi *) ;

(* Family 8: Temporal & Interval Chronologies *)
temporal_f     = "future_pos" "(" formula ")"                          (* F phi *)
               | "future_nec" "(" formula ")"                          (* G phi *)
               | "past_pos" "(" formula ")"                            (* P phi *)
               | "past_nec" "(" formula ")"                            (* H phi *)
               | "meets" "(" formula ")"                               (* Allen's relations *)
               | "starts" "(" formula ")"
               | "during" "(" formula ")"
               | "overlaps" "(" formula ")"
               | "chop" "(" formula "," formula ")"                    (* C(phi, psi) interval chop *)
               | "point_interval" ;                                    (* interval length = 0 *)

(* ========================================== *)
(* Action Model Blocks                        *)
(* ========================================== *)
action_model_block = "action_model" identifier "{" { event_block } "}" ;
event_block        = "event" identifier "{" 
                        "pre" ":" formula ";" 
                        [ "plausibility" ":" number ";" ] 
                     "}" ;

(* ========================================== *)
(* Dialogue Blocks                            *)
(* ========================================== *)
dialogue_block = "dialogue" identifier "{" 
                     "thesis" ":" formula ";"
                     "rules" ":" ( "intuitionistic" | "classical" | "immanent" ) ";"
                     "repetition" ":" number ";"
                     [ "concessions" ":" "[" [ formula { "," formula } ] "]" ";" ]
                     { dialogue_move } 
                 "}" ;

dialogue_move  = identifier "states" formula [ "challenges" identifier ] ";" 
               | identifier "requests" string [ "challenges" identifier ] ";" 
               | identifier "states_ctt" immanent_judgement [ "challenges" identifier ] ";" ;

immanent_judgement = term ":" formula 
                   | term "=" term ":" formula 
                   | formula ":" "prop" 
                   | identifier ":" "set" ;
```

---

## 2. Mathematical Semantics and Algebraic Foundations

This section specifies the formal algebraic and model-theoretic rules that an evaluation engine must execute to compute truth, satisfaction, updates, or game matrices for PhiloDSL.

### Family 1: Extensional, Many-Sorted, & Free Logics [347]
1. **Many-Sorted Universes:** A structure $\mathcal{A}$ defines a family of disjoint domains $\{D_s\}_{s \in \text{Sort}}$. Variables $x$ declared under sort $S$ take values strictly in $D_S$ [347].
2. **Free Logic Semantics:** To accommodate non-designating terms (e.g., in a temporal/modal context), PhiloDSL employs a dual-domain architecture:
   - Inner domain $D_w$ represents objects existing *at world $w$* [243, 244].
   - Outer domain $U$ represents all possible objects across all worlds [243].
   - Singular existence: `exists_imp(t)` evaluates to $\top$ at world $w$ iff the denotation $\mathcal{I}(t, w) \in D_w$ [244].
   - Non-classical Neutral Evaluation ($\mathcal{V}^3$): If $t$ is non-designating ($\mathcal{I}(t, w) \notin D_w$), any atomic predicate $P(t)$ evaluates to the non-classical value *undefined* ($*$) in a Kleene strong 3-valued valuation [283].
3. **Predicate Abstraction:** `abstract(x, phi, t)` represents $[\lambda x . \phi](t)$ [243]. It resolves scope ambiguities:
   - $\Box [\lambda x . \phi](t)$ evaluates to $\top$ at $w$ iff the object denoted by $t$ at $w$ satisfies $\phi$ in all accessible worlds $u$ [243].
   - $[\lambda x . \Box \phi](t)$ is the *de re* necessity statement, whereas $\Box \phi(t/x)$ represents *de dicto* necessity [257].

### Family 2: Alethic & Hybrid Relational Modalities [209, 380]
1. **Kripke Frame Construction:** `relation R { attributes }` translates into a directed graph where nodes $W$ represent states and edges $R \subseteq W \times W$ obey the declared relational properties (e.g., reflexivity, transitivity, symmetry, Euclidean, seriality, convergence) [207, 380].
2. **Hybrid Operators:** 
   - `nominal(i)` restricts the valuation function $\mathcal{V}$ such that $\mathcal{V}(i)$ is a singleton $\{w\} \subseteq W$ [209].
   - `at(i, phi)` ($@_i \phi$) shifts the point of evaluation: $\mathcal{M}, w \models @_i \phi \iff \mathcal{M}, w_i \models \phi$ where $\mathcal{V}(i) = \{w_i\}$ [209].
   - `bind(i, phi)` ($\downarrow i . \phi$) stores the current world context: $\mathcal{M}, w \models \downarrow i . \phi \iff \mathcal{M}[i \mapsto \{w\}], w \models \phi$ [209].

### Family 3: Intensional Conditionals & Connexivity [124, 157]
1. **Strict Implication:** `strict_impl(A, B)` ($\Box(A \supset B)$) is evaluated as truth of $A \supset B$ at all accessible worlds [115, 380].
2. **Counterfactual Conditionals:** `counterfactual(A, B)` ($A > B$) uses Stalnaker-Lewis selection spheres: $\mathcal{M}, w \models A > B$ iff the closest $A$-worlds in the sphere ordering centered at $w$ satisfy $B$ [115, 116].
3. **Connexive Implication & Kapsner Strong Connexivity:** `connexive_impl(A, B)` ($A \rightarrow_c B$) explicitly rejects empty-content or self-contradictory conditionals [124]. The evaluation engine enforces:
   - **Aristotle's Theses:** $\neg(A \rightarrow_c \neg A)$ and $\neg(\neg A \rightarrow_c A)$ are valid [124].
   - **Boethius' Theses:** $(A \rightarrow_c B) \rightarrow_c \neg(A \rightarrow_c \neg B)$ is valid [124].
   - **Kapsner Strong Satisfiability Constraints:**
     - `Unsat1`: In no compiled model is $A \rightarrow_c \neg A$ or $\neg A \rightarrow_c A$ satisfiable [126].
     - `Unsat2`: In no compiled model are $A \rightarrow_c B$ and $A \rightarrow_c \neg B$ simultaneously satisfiable [126].
4. **Relating/Relatedness Implication:** `relatedness_impl(A, B)` ($A \rightarrow_R B$) uses a binary relevance relation $R$ over the set of formulas [157]. Truth is evaluated as:
   $$\mathcal{M}, w \models A \rightarrow_R B \iff (\mathcal{M}, w \models A \supset B) \land R(A, B)$$
   where $R(A, B)$ maps subject-matter containment or relevance between the antecedent and consequent [135, 157].

### Family 4: Substructural & Resource Algebras [345, 363]
To capture logics where premises cannot be freely duplicated (Contraction) or discarded (Weakening) [345], PhiloDSL supports:
1. **Fusion (Multiplicative Conjunction):** `fusion(A, B)` ($A \otimes B$) represents the active joint consumption of resources. It is evaluated over ternary frames [432]:
   $$\mathcal{M}, x \models A \otimes B \iff \exists y, z \in P \text{ s.t. } Ryzx \text{ and } \mathcal{M}, y \models A \text{ and } \mathcal{M}, z \models B$$
2. **Lollipop (Linear Implication):** `lollipop(A, B)` ($A \multimap B$) represents resource-bounded implication satisfying the algebraic residuation condition: $A \otimes B \vdash C \iff B \vdash A \multimap C$ [363, 425].
3. **Exponentials:** `bang(A)` ($!A$) acts as a license that allows the premise $A$ to be cloned or discarded in a sequent calculus, reintroducing weakening and contraction locally [346].

### Family 5: Epistemic, Doxastic, & Justification Logics [239, 320]
1. **Factive Knowledge vs. Consistent Belief:** `know(a, phi)` requires reflexivity of $R_a$ (Factivity: $K_a \phi \rightarrow \phi$), while `believe(a, phi)` requires seriality (Consistency: $\neg B_a \bot$) [27].
2. **Social and Group Epistemology:**
   - **Distributed Knowledge:** `dist_know(G, phi)` uses relation $R_{D_G} = \bigcap_{i \in G} R_i$ (pooling information) [239, 457].
   - **Common Knowledge:** `common_know(G, phi)` uses relation $R_{C_G} = (\bigcup_{i \in G} R_i)^+$ (transitive closure, representing infinite iterations) [240, 241, 459].
3. **Justification Terms and Evidence Semantics:** `justify(t, phi)` ($t : \phi$) asserts that term $t$ is an inspectable justification for $\phi$ [272, 295]. The evaluation engine uses **Mkrtychev evidence functions** $\mathcal{E}(t, \phi) \subseteq W$ [320]:
   $$\mathcal{M}, w \models t : \phi \iff w \in \mathcal{E}(t, \phi) \land (\forall u \in W \text{ s.t. } w R u \implies \mathcal{M}, u \models \phi)$$
   The evidence function $\mathcal{E}$ must structurally satisfy:
   - **Application Algebra:** $\mathcal{E}(s, \phi \rightarrow \psi) \cap \mathcal{E}(t, \phi) \subseteq \mathcal{E}(\text{apply}(s, t), \psi)$ [324].
   - **Sum Algebra:** $\mathcal{E}(s, \phi) \cup \mathcal{E}(t, \phi) \subseteq \mathcal{E}(\text{sum}(s, t), \phi)$ [305, 308].
   - **Positive Introspection:** $\mathcal{E}(t, \phi) \subseteq \mathcal{E}(\text{verify}(t), t : \phi)$ [327].
   - **Negative Introspection:** $\overline{\mathcal{E}(t, \phi)} \subseteq \mathcal{E}(\text{neg_inspect}(t), \neg t : \phi)$ [329].
   - **Fully Explanatory Models:** If $\phi$ is believed at $w$ in the Kripke sense, there must exist some $t$ such that $w \in \mathcal{E}(t, \phi)$ [325].

### Family 6: DEL & Plausibility Dynamics [47, 58, 411]
1. **Public Announcement Logic (PAL):** `announce(F, G)` ($[F!]G$) is a dynamic model-transformer that prunes the world-space, removing all worlds where $F$ is false [26, 266]. The compiler evaluates this by recursively applying **PAL Reduction Axioms** to nested expressions [32, 267]:
   - $[F!]p \leftrightarrow (F \rightarrow p)$ for atomic $p$ [32].
   - $[F!]\neg G \leftrightarrow (F \rightarrow \neg [F!]G)$ [32].
   - $[F!](G \wedge H) \leftrightarrow ([F!]G \wedge [F!]H) [32]$.
   - $[F!]K_a G \leftrightarrow (F \rightarrow K_a (F \rightarrow [F!]G))$ [33].
2. **Relativized Common Knowledge (RCK):** `rel_common_know(G, F, H)` ($[G^*](F | H)$) asserts that $F$ is common knowledge among group $G$ relative to $H$ [45]. It maintains a complete reduction theorem in the presence of public announcements [45]. Evaluated on the reflexive-transitive closure of the union of relation $R_i$ pruned by $H$: $(R[H!]_G)^*$ [47].
3. **BMS Action Model Product Update:** `action(A, e, phi)` represents the update of Kripke model $M$ with action model $A$ at event $e$ [58, 86]. The resulting Kripke model $M \times A$ is computed over the restricted domain:
   $$W[A] = \{ (w, f) \in W \times E \mid \mathcal{M}, w \models \text{pre}(f) \}$$
   Accessibility is computed as: $(w, f) R_a (u, g) \iff w R_a u \land f R^A_a g$ [59, 86].
4. **Plausibility Dynamics (APUL):**
   - **Radical Upgrade:** `radical_upgrade(F)` ($\Uparrow F$) shifts the plausibility ordering of the model: all $F$-worlds are ranked strictly more plausible than all $\neg F$-worlds while keeping internal relations stable [71, 411, 450].
   - **Suggestion:** `suggestion(F)` ($\sharp F$) prunes plausibility transitions: it deletes all preference edges leading from $F$-worlds to $\neg F$-worlds [409, 410].

### Family 7: Deontic & Agential Action Logics [81, 338]
1. **Dyadic Conditional Obligation:** `dyadic_oblig(phi, psi)` ($O(\phi | \psi)$) represents conditional obligation under sub-ideal conditions, preventing the collapsing of obligations in contrary-to-duty contexts [338]. It is evaluated over preference-ordered worlds: $O(\phi | \psi)$ is true iff the best $\psi$-worlds satisfy $\phi$.
2. **Andersonian-Kangerian Reduction:** The violation constant `violation` ($V$) reduces monadic deontic operators to modal-action statements: `oblig(phi)` is represented as $\Box(\neg \phi \rightarrow V)$ [83].
3. **Agential Action and Refraining:**
   - `stit(a, phi)` represents deliberative seeing-to-it-that: $\text{dstit}_a \phi \leftrightarrow (\text{cstit}_a \phi \wedge \neg \Box \phi)$ where $\Box$ represents historical necessity [81].
   - `refrain(a, phi)` represents agential omission: the agent actively sees to it that they do not perform the action that brings about $\phi$.

### Family 8: Temporal & Interval Chronologies [437]
1. **Priorean Tenses:** Evaluated over linear or branching structures representing moments of time [380].
2. **Allen's Interval Relations (Halpern-Shoham):** Modalities `meets(phi)`, `starts(phi)`, `during(phi)` shift evaluation from the current interval $[d_1, d_2]$ to an interval $[d_3, d_4]$ that meets, starts, or occurs during the original interval [437].
3. **Chop Operator:** `chop(phi, psi)` splits the current interval: true on $[d_1, d_2]$ iff there exists a partition point $d_3 \in [d_1, d_2]$ such that $\phi$ is true on $[d_1, d_3]$ and $\psi$ is true on $[d_3, d_2]$ [437].

### Family 9: Interactive Dialogical Logics [181, 214]
Dialogue trees are evaluated dynamically by simulating alternating two-player game runs [179].
1. **Procedural Structural Rules:**
   - **Starting Rule (SR0):** Proponent **P** states the thesis. Player **O** declares her repetition rank $n \in \mathbb{N}$ (maximum challenges/defences per move), then **P** declares his rank $m \in \mathbb{N}$ [190].
   - **Intuitionistic Rule (SR1i):** The game is governed by the *Last Duty First* constraint (players can only challenge or defend in response to the most recent open attack) [188, 204].
   - **Classical Rule (SR1c):** The *Last Duty First* restriction is removed; players can backtrack and challenge the same move up to their repetition rank [204].
   - **Formal Copy-Cat Rule (SR2):** **P** cannot play an elementary proposition unless **O** has previously stated it [192].
2. **Immanent Reasoning (CTT Dialogues):**
   - Statements are explicit judgements: $p : \phi$ [216].
   - Particle rules are replaced by rules for the **synthesis and analysis of local reasons** [217].
   - **Resolution of Instructions:** Players can request the adversary to resolve abstract proof instructions (e.g., left/right projection functions $L^\supset(p)$ or $R^\supset(p)$) into concrete local reasons [217, 219].

---

## 3. Compiler Architecture & Execution Pipeline

A reference compiler implementing PhiloDSL must execute a four-phase pipeline:

```
[PhiloDSL Text] ---> (1. Parser / AST Generator) ---> (2. Graph & Context Compiler)
                                                             |
[Visual Diagram] <--- (4. Renderer / DOT) <--- (3. Dynamic Semantic Reducer)
```

### Phase 1: AST Generation and Syntax Validation
1. Construct an Abstract Syntax Tree (AST) mapping identifiers to their respective typed definitions (`agent`, `prop`, `nominal`, `sort`, `relation`).
2. Validate semantic coherence (e.g., checking that variables used in quantifiers belong to declared sorts, and accessibility relations belong to the correct Kripke worlds).

### Phase 2: Graph & Context Compilation
1. Instantiate Kripke frames: map `state` blocks to nodes $W$ and `relation` blocks to directed edges $R$.
2. For preference structures, build connected, well-founded preorder relations representing relative plausibility [67].

### Phase 3: Dynamic Semantic Simplification
1. Traverse the AST and locate any dynamic operators (`announce`, `radical_upgrade`, `action`).
2. If `announce` is encountered, execute the **PAL Reduction Engine** [32, 267]:
   - Evaluate the precondition. If false, prune the world node.
   - If true, recursively apply reduction axioms to nested sub-formulas until the expression is announcement-free [34, 267].
3. For `action`, perform a **BMS Product Update** over the world-state graph and the action-model event graph to output the updated, combined state graph [59, 86].

### Phase 4: Output Rendering and Code Compilation
1. **Relational Models:** Compile Kripke frames and Plausibility models into **Graphviz DOT** files:
   - Worlds map to circular or bento-grid nodes labeled with their nominals and true formulas.
   - Accessibility relations map to directed edges labeled with the relation identifier.
2. **Dialogue Plays:** Compile `dialogue` blocks into structured, interactive two-column tables tracking Move Number, Player, Statement, and Challenges.

---

## 4. Standardized Test Cases & Test Suite

The following concrete models are the standard test suite for PhiloDSL. Any compliant compiler must successfully parse and evaluate these scripts.

### Test Case 1: Chisholm's Contrary-to-Duty Paradox
Demonstrates deontic representation, dyadic conditional obligations, and factual detachment [338].

```philo
// Chisholm's Contrary-to-Duty Paradox
prop G: "Jones goes to assist his neighbors";
prop T: "Jones tells his neighbors he is coming";

nominal w_ideal;
nominal w_actual;

relation access_Deontic "Obedience Accessibility" { serial, transitive };

state w_ideal "Ideal World" {
    oblig(G);                                  // jones ought to go
    dyadic_oblig(T, G);                        // if jones goes, he ought to tell them
}

state w_actual "Sub-ideal Actual World" {
    not(G);                                    // jones does not go
    oblig(G);                                  // jones ought to go (primary obligation persists)
    dyadic_oblig(not(T), not(G));              // if jones does not go, he ought not to tell
}

// Actual choice transition
w_ideal --[access_Deontic]--> w_actual;

evaluate w_actual {
    // Under factual detachment, we successfully derive the sub-ideal obligation
    and(not(G), dyadic_oblig(not(T), not(G))) => oblig(not(T));
}
```

### Test Case 2: Gettier Counterexample (Justification Logic)
Demonstrates hyperintensional justification tracking, evidence functions, and the failure of factivity [339, 340].

```philo
// Gettier Case - Smith believes Jones owns a Ford
prop owns_ford "Jones owns a Ford";
prop owns_brown "Brown is in Barcelona";

nominal w_actual;

state w_actual "Smith's epistemic world" {
    not(owns_ford);                            // Jones does not own a Ford (Fictionalized)
    owns_brown;                                // Brown is indeed in Barcelona (True)

    // Smith has justification term 't' for the false proposition
    justify(t, owns_ford);

    // Smith applies Basic Justification Logic (J0) proof transformation rules [308]
    // s is the logical proof that: owns_ford -> (owns_ford OR owns_brown)
    // Smith deduces the disjunction and justifies it via apply(s, t) [304]
    justify(apply(s, t), or(owns_ford, owns_brown));
}

evaluate w_actual {
    // Smith's disjunctive belief is true and justified, yet it is NOT knowledge
    // because factivity on 't' fails in the actual world
    not(impl(justify(t, owns_ford), owns_ford)) => not(know(smith, or(owns_ford, owns_brown)));
}
```

### Test Case 3: Muddy Children Puzzle (Dynamic Epistemic Logic)
Demonstrates public announcements, state-pruning, and the transition to common knowledge [24, 266, 269].

```philo
// Muddy Children (3 Children: Alice, Bob, Charlie)
agent alice;
agent bob;
agent charlie;

prop m_alice "Alice is muddy";
prop m_bob "Bob is muddy";
prop m_charlie "Charlie is muddy";

nominal w000; nominal w100; nominal w010; nominal w001;
nominal w110; nominal w101; nominal w011; nominal w111; // 1 = muddy, 0 = clean

relation access_A "Alice's Epistemic" { reflexive, symmetric };
relation access_B "Bob's Epistemic" { reflexive, symmetric };
relation access_C "Charlie's Epistemic" { reflexive, symmetric };

// Actual world is w111 (All three children are muddy)
state w111 {
    m_alice; m_bob; m_charlie;
}

// Establish Kripke indistinguishability edges (children cannot see their own forehead)
w111 --[access_A]--> w011;
w111 --[access_B]--> w101;
w111 --[access_C]--> w110;

// Step 1: Father announces "At least one of you is muddy"
// This prunes world w000 from the model [26]
state w111 {
    announce(or(m_alice, or(m_bob, m_charlie)), not(common_know([alice, bob, charlie], m_alice)));
}
```

### Test Case 4: Dialogical Game for the Law of Excluded Middle
Demonstrates classical vs intuitionistic game matrices and backtracking [204, 205].

```philo
// Dialogue for the Law of Excluded Middle
prop p;

dialogue lem_intuitionistic {
    thesis: or(p, not(p));
    rules: intuitionistic;                      // last-duty-first active [188]
    repetition: 1;

    O requests "or";                           // Challenge the disjunction (Move 1)
    P states not(p);                           // P must choose a side (Move 2)
    O states p challenges Move_2;              // O challenges the negation (Move 3)
    // P is stuck! Intuitionistic rules prevent backtracking to challenge Move 1 again.
    // O wins the intuitionistic game.
}

dialogue lem_classical {
    thesis: or(p, not(p));
    rules: classical;                           // backtracking allowed [204]
    repetition: 2;

    O requests "or";                           // Challenge the disjunction (Move 1)
    P states not(p);                           // P defends (Move 2)
    O states p challenges Move_2;              // O challenges negation (Move 3)
    P states p challenges Move_1;              // P backtracks to Move 1 and plays the left disjunct! (Move 4)
    // O has no moves left. P wins classical game [205].
}
```

### Test Case 5: Dynamic Preference Upgrades (APUL Dynamics)
Demonstrates plausibility models, radical preference upgrades, and suggestions [71, 409].

```philo
// Preference Dynamics Model
agent seeker;
prop truth "Seeker finds truth";
prop comfort "Seeker lives in comfort";

nominal w_comfort_only;
nominal w_truth_only;

preference_relation pref for seeker { reflexive, transitive, locally_connected };

state w_comfort_only {
    not(truth);
    comfort;
}

state w_truth_only {
    truth;
    not(comfort);
}

// Initial state: Seeker prefers Comfort to Truth
w_comfort_only --[pref]--> w_truth_only;

evaluate w_comfort_only {
    // Radical upgrade makes all truth-worlds strictly preferred to comfort-worlds [411]
    radical_upgrade(truth) => justify(seeker, truth > comfort);
}
```
