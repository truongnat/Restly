# Software Requirements Specification — <System>

> Follows **ISO/IEC/IEEE 29148** (supersedes IEEE 830). Every requirement has a
> stable ID, a source, and is verifiable. Do not invent requirements — mark
> `Gap`/`Unknown` where evidence is missing. Keep requirement statements
> testable ("shall …"), atomic, and free of design detail.

- **Status:** draft / reviewed / approved · **Version:** `x.y` · **Last-synced:** `<commit>`
- **Sources:** _(BUSINESS_ANALYSIS.md, DISCUSSION.md, code, tickets)_

## 1. Introduction

### 1.1 Purpose
_(What this SRS specifies and for whom.)_

### 1.2 Scope
_(System name; what it does / does not do; benefits and objectives.)_

### 1.3 Product overview
- **Product perspective:** _(context, system-of-systems, interfaces to other systems)_
- **Product functions:** _(high-level summary of major functions)_
- **User classes & characteristics:** _(roles, expertise, frequency)_
- **Operating environment:** _(platforms, runtimes, dependencies)_
- **Constraints:** _(regulatory, hardware, standards, language)_
- **Assumptions & dependencies:** _(what must hold true)_

### 1.4 Definitions, acronyms, abbreviations
_(Link to `glossary.md`; list SRS-specific terms.)_

## 2. References
_(Standards, tickets, design docs, external specs — with locations.)_

## 3. Specific requirements

### 3.1 External interface requirements
- **User interfaces:** _(screens, UX constraints)_
- **Hardware interfaces:** _(N/A + reason if none)_
- **Software interfaces:** _(APIs, DBs, services, versions)_
- **Communications interfaces:** _(protocols, ports, formats)_

### 3.2 Functional requirements

| ID | Requirement (shall …) | Priority | Source | AC / Verify | Trace (design/code) |
|---|---|---|---|---|---|
| FR-001 | _(atomic, testable)_ | must/should/could | _(§/ticket)_ | _(observable check)_ | _(HLD/LLD §, path)_ |

_(Group by feature when large; keep one row per atomic requirement.)_

### 3.3 Usability requirements
| ID | Requirement | Measure | Source |
|---|---|---|---|
| NFR-U-001 | _(…)_ | _(target)_ | _(…)_ |

### 3.4 Performance requirements
| ID | Requirement | Measure/target | Source |
|---|---|---|---|
| NFR-P-001 | _(latency/throughput/capacity)_ | _(e.g. p95 < 200ms)_ | _(…)_ |

### 3.5 Logical database / data requirements
_(Entities, retention, integrity, volumes. Link `data-model.md`.)_

### 3.6 Design constraints
_(Standards compliance, tech mandates, hardware limits.)_

### 3.7 Software system attributes (quality)
| Attribute | Requirement | Measure | Source |
|---|---|---|---|
| Reliability | _(…)_ | _(…)_ | |
| Availability | _(…)_ | _(SLO %)_ | |
| Security | _(authn/z, data protection, compliance)_ | _(…)_ | |
| Maintainability | _(…)_ | _(…)_ | |
| Portability | _(…)_ | _(…)_ | |

### 3.8 Supporting information
_(Anything aiding understanding: mockups, examples.)_

## 4. Verification
_(How each requirement class is verified: test, demo, inspection, analysis.
Cross-reference `TESTCASES.md` where present.)_

## 5. Appendices
- **Assumptions & dependencies** _(consolidated)_
- **Traceability matrix** _(FR/NFR → design → code → test)_
- **Open issues / gaps** _(explicit `Gap`/`Unknown` list)_
