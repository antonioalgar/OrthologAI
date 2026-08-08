# OrthoLogAI — Product Manifesto

> **Mandatory product reference:** Before making any product, UX, architecture, or development decision for OrthoLogAI, review this document in full.

## 1. Why OrthoLogAI exists

During a surgical career, an orthopaedic surgeon performs thousands of procedures.

Every operation generates data, images, decisions, complications, results and, most importantly, experience.

Much of that experience becomes fragmented across hospital records, operative reports, photographs, messages, spreadsheets, presentations and personal memory.

OrthoLogAI exists to prevent that knowledge from disappearing.

OrthoLogAI is the professional memory of the surgeon.

It should not merely record what was done. It should preserve what happened, how the patient evolved, what the surgeon learned and how their surgical practice changes throughout their career.

## 2. Mission

Convert every surgery into reusable knowledge throughout the surgeon's career.

## 3. Vision

A surgeon who uses OrthoLogAI for 10–20 years should be able to explore and understand their entire surgical career.

Examples:

- How many ACL reconstructions have I performed?
- How has my technique evolved?
- What complications have I had?
- What did I learn from my early osteotomies?
- Which implant did I use in a particular case?
- How did a specific TKA evolve?
- Which patients are still awaiting review?
- Which private procedures have not yet been paid?
- Which cases could become a clinical series or publication?
- What pearls have I accumulated regarding ACL revision surgery?

The system should progressively become a surgical second brain.

## 4. The fundamental unit: the surgery

The surgery remains the core entity of OrthoLogAI.

A surgical case may connect to:

- clinical information
- diagnosis
- procedure
- role
- surgical technique
- implants
- images
- complications
- pearls
- learning
- follow-up
- discharge
- professional / financial information
- research
- AI-generated insights

Future features should generally reinforce this case-centric architecture rather than fragment the product into unrelated modules.

## 5. Five product pillars

### Clinical

Capture and understand each surgical case:

- Surgery
- Diagnosis
- Procedure
- Role
- Implants
- Complications
- Images
- Evolution
- Follow-up
- Discharge

### Learning

Every operation should leave reusable knowledge:

- What I learned
- Surgical pearls
- Mistakes
- Difficulties
- What I would do differently
- Mentor advice
- Evolution of surgical technique

### Professional activity

Especially relevant for private practice:

- Public / private activity
- Hospital
- Insurance company or private patient
- Expected fee
- Invoiced amount
- Received amount
- Invoice date
- Payment date
- Payment status
- Billing issues

Clinical status and financial status must remain independent.

For example, a case may simultaneously be:

**Paid**

and

**Still under clinical follow-up.**

### Research and career

Accumulated cases should be useful for:

- Clinical series
- Abstracts
- Oral communications
- Publications
- Presentations
- Audits
- Surgical logbook
- Professional portfolio

OrthoLogAI should eventually help answer questions such as:

> "I have an idea for a study. Which of my cases could be included?"

### Intelligence

AI must not be decorative.

AI should perform useful work using the surgeon's own data and experience.

Potential capabilities:

- Generate surgical summaries
- Detect incomplete information
- Extract pearls and learning points
- Summarize follow-up
- Organize knowledge
- Search cases using natural language
- Analyze surgical activity
- Identify potentially interesting clinical series
- Support preparation of abstracts or publications
- Answer questions about the surgeon's own practice

## 6. Clinical lifecycle

A case does not end when the operation finishes.

The intended lifecycle is:

**Surgery → configurable first review → unlimited subsequent reviews → discharge**

Possible clinical states include:

- Incomplete
- Under follow-up
- Active complication
- Discharged / closed

The next follow-up should derive from the actual next pending follow-up event and should never depend on a hard-coded schedule.

## 7. UX principle: capture now, enrich later

OrthoLogAI should request the minimum information necessary at each moment.

Recording a basic surgery should be extremely fast.

Users must be able to save a case quickly and enrich it later.

Core principle:

> **Capture now. Enrich later.**

Avoid forcing the surgeon through long forms before a case can be saved.

## 8. Core daily workflows

OrthoLogAI must optimize not only for surgical documentation, but also for rapid retrieval of actionable information.

Three questions should guide the primary product experience:

1. Which cases require my attention?
2. Which private cases require financial action?
3. Which previous surgical experience do I want to retrieve?

### Action-oriented visualization

The dashboard and case lists should make actionable states immediately visible.

Important categories include:

- overdue clinical review
- upcoming clinical review
- surgery/case still incomplete
- surgery with no appropriate review recorded yet
- active complication
- pending invoice
- invoiced but unpaid
- paid
- discharged / closed

These concepts must remain semantically distinct.

Clinical follow-up status and financial/payment status must never be conflated.

Whenever practical, dashboard counters or cards should be actionable: selecting one should lead to the corresponding filtered set of cases.

The preferred information flow is:

**Dashboard → actionable category → filtered case list → individual case**

Users should not need to open cases individually to discover what requires attention.

### Private practice and payments are a core capability

Financial management is a central recurring use case for surgeons working in private practice.

The long-term financial model should be capable of representing:

- public / private / insurance activity
- hospital or clinic
- insurance company or private patient
- expected professional fee
- invoiced amount
- received amount
- invoice date
- payment date
- billing/payment status
- billing incident or notes

The basic financial lifecycle should remain simple:

**Not invoiced → Invoiced → Paid**

with an optional incident/problem state when required.

Future financial dashboards should make it possible to understand, for a selected period:

- number of private procedures
- expected amount
- invoiced amount
- received amount
- outstanding amount
- cases awaiting invoice
- invoices awaiting payment

Do not turn OrthoLogAI into full accounting software.

The objective is to let the surgeon immediately understand:

- what professional activity has been performed
- what has been invoiced
- what has been received
- what still requires financial action

### Visualization and information retrieval

Ease of visualization is a first-class product requirement.

OrthoLogAI should make important information scannable before requiring the user to open an individual case.

Prefer:

- concise cards
- meaningful badges
- clear status hierarchy
- quick-filter chips
- filtered views
- progressive disclosure
- visible next actions

Avoid:

- long undifferentiated lists
- excessive information on cards
- large filter forms
- showing every possible field simultaneously

Clinical detail belongs inside the individual case.

Actionable summaries belong in dashboards and lists.

## 9. The 80% rule

If a feature is not useful in most surgical cases, it should not occupy the primary workflow.

Highly specialized functionality may exist, but it should appear contextually or behind progressive disclosure.

This rule exists to prevent OrthoLogAI from becoming a bloated hospital information system.

## 10. Design philosophy

OrthoLogAI should feel closer to:

- Apple
- Linear
- Notion
- ChatGPT

than to traditional hospital software.

Prioritize:

- clear visual hierarchy
- whitespace
- readability
- excellent mobile experience
- progressive disclosure
- few primary actions
- powerful secondary functionality
- minimal cognitive load
- consistent terminology

The interface should feel premium, calm and fast.

## 11. What OrthoLogAI is NOT

OrthoLogAI should not attempt to become:

- The hospital's official electronic health record
- A hospital ERP
- A full appointment scheduling platform
- A nursing management system
- A large administrative suite
- A full accounting package

The primary user is the surgeon.

Avoid feature creep into areas already better served by hospital or administrative software.

## 12. Privacy and data minimization

Privacy must be treated as core infrastructure.

The product should encourage storage of only the minimum personally identifiable patient information necessary.

Architecture should favour:

- pseudonymisation / anonymisation where possible
- private storage
- appropriate access controls
- secure image and document storage
- separation of users' data
- minimal exposure of patient information

Any future expansion involving real clinical data must treat security and applicable privacy/regulatory requirements as a first-class concern.

Do not assume that current functionality automatically constitutes regulatory compliance.

## 13. Question for every new feature

Before implementing a new feature, ask:

> "Will this help the surgeon work better, learn more, or preserve something valuable that they may want to retrieve years later?"

If the answer is weak, the feature should go to the backlog rather than the core product.

## 14. Current product priorities

The existing clinical foundation already includes:

- surgical case registration
- case details
- image upload
- clinical follow-up
- configurable first review
- additional reviews
- discharge
- payment state
- dashboard follow-up information

Do not rebuild these features unnecessarily.

Current strategic priorities are:

### A. Professional / financial management

Improve management of private practice, invoicing and payments while keeping it separate from clinical follow-up.

### B. AI applied to each case

Summaries, organization, learning extraction and completeness assistance.

### C. Intelligent search

Allow users to find cases and information using natural language.

### D. Statistics and dashboard

Help surgeons understand their clinical and professional activity.

### E. Automatic professional knowledge library

Transform accumulated cases, pearls and learning points into reusable personal surgical knowledge.

## 15. Product identity

OrthoLogAI should not be thought of simply as a database containing surgical procedures.

The desired mental model is:

> A surgeon has hundreds or thousands of reusable surgical experiences.

Not:

> "I have 856 operations stored."

But:

> "I have 856 surgical experiences that I can learn from and retrieve."

## 16. Product language

Primary concept:

> **OrthoLogAI — Your surgical second brain.**

Product line:

> **Every surgery becomes experience. Every experience becomes knowledge.**

## 17. Development principles for Codex and future contributors

Before implementing any significant feature:

1. Read this manifesto.
2. Inspect the existing implementation before writing new code.
3. Prefer extending existing models and UI patterns rather than duplicating functionality.
4. Do not break working clinical workflows.
5. Keep clinical status separate from financial status.
6. Preserve the flexible follow-up model.
7. Prioritize mobile usability.
8. Avoid unnecessary new database fields.
9. Prefer structured data when it will enable useful future analysis, but avoid over-structuring every clinical detail.
10. Keep user-facing complexity lower than technical complexity.
11. Do not introduce a major dependency without a clear benefit.
12. Preserve backwards compatibility with existing surgical records whenever practical.
13. Every new feature must have an obvious user benefit.
14. Security and privacy changes should fail safely rather than expose data.
15. New AI functionality should assist the surgeon, not pretend to replace clinical judgement.
16. When improving an existing screen, optimize information retrieval as much as data entry. A feature is not complete merely because information can be stored; important information must also be easy to find, scan and act upon.

---

> **Before beginning a new OrthoLogAI feature, review this document and explicitly identify which product principle the proposed feature supports.**
