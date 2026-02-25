---
title: Quaker Cloud Core Vocabulary
description: Definitions for shared terms in the Quaker Cloud namespace used across all Quaker Cloud specifications.
version: "0.1"
specStatus: Draft
publishDate: 2026-02-25
lastModified: 2026-02-25
namespace: "https://quaker.cloud/spec/ns/"
---

## Overview

This document defines shared vocabulary terms in the Quaker Cloud (`qc:`) namespace. These terms are used across Quaker Cloud specifications wherever a controlled vocabulary is needed for Quaker-specific concepts not covered by schema.org or other standard vocabularies.

All terms defined here are properties of the namespace `https://quaker.cloud/spec/ns/`. Specifications that use these terms should declare the `qc:` prefix accordingly:

```json
"@context": {
  "@vocab": "https://schema.org/",
  "qc": "https://quaker.cloud/spec/ns/"
}
```

Other Quaker Cloud specifications are normatively dependent on this document for any term prefixed `qc:`.

---

## Meeting Types

**Term:** `qc:meetingType`
**Range:** string (controlled vocabulary)
**Used on:** `schema:Organization`

Identifies the structural level of a Quaker meeting or worship group within the organisational hierarchy of a yearly meeting. The value must be one of the following:

| Value           | Description                                                                                                     |
| --------------- | --------------------------------------------------------------------------------------------------------------- |
| `worship-group` | An informal gathering that meets for worship but is not yet a constituted meeting with full membership functions |
| `preparative`   | A meeting under the care of a monthly meeting; may hold membership but reports to its overseer meeting          |
| `monthly`       | The primary unit of Quaker church governance; holds membership and conducts meeting for business                 |
| `quarterly`     | A regional grouping of monthly meetings; meets quarterly for business and fellowship                             |
| `half-yearly`   | A regional grouping that meets twice yearly; used in some yearly meetings in place of quarterly meetings         |
| `yearly`        | The annual gathering of Friends across a region or nation; the highest unit of church governance in most branches |

These values are lowercase and hyphenated for use in JSON-LD and XML contexts.

---

## Quaker Branches

**Term:** `qc:quakerBranch`
**Range:** string (controlled vocabulary)
**Used on:** `schema:Organization`

Identifies the theological and ecclesiological tradition of a Quaker meeting. Friends' meetings vary considerably in worship style, theology, and church polity. This field supports disambiguation between meetings of the same name operating in different traditions.

The value must be one of the following:

| Value           | Description                                                                                                                                      |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `unprogrammed`  | Silent waiting worship; no pastor or planned order of service; includes most Friends General Conference and Britain Yearly Meeting affiliates     |
| `semi-programmed` | Worship that combines a period of open unprogrammed worship with some planned elements; common in some Pacific coast yearly meetings             |
| `programmed`    | Worship with a pastor and a prepared order of service; predominant in Friends Church and Evangelical Friends International affiliates             |
| `conservative`  | Unprogrammed meetings that maintain historic Quaker practices and testimonies; includes Ohio Yearly Meeting (Conservative) and similar bodies     |
| `evangelical`   | Meetings emphasising evangelical Christian theology, often with programmed worship; some overlap with the programmed category                     |

These values are not exhaustive of the full historical range of Quaker diversity. Implementations encountering meetings that do not fit any value may use a free-text string and are encouraged to propose additions via the Quaker Cloud issue tracker.

---

## Record Types

**Term:** `qc:type`
**Range:** string (controlled vocabulary)
**Used on:** any `schema:Article` or similar record

Identifies the specific Quaker record type within a general schema.org type. This allows consuming systems to distinguish Quaker-specific record categories without requiring a new top-level `@type`.

| Value             | Description                                                           | Defined in                                              |
| ----------------- | --------------------------------------------------------------------- | ------------------------------------------------------- |
| `MemorialMinute`  | A written tribute prepared by a meeting for a Friend who has died     | [Memorial Minute Specification](/specs/memorial/)       |

Additional record types will be added as further Quaker Cloud specifications are published.

---

## References

- schema.org Organization: https://schema.org/Organization
- JSON-LD 1.1 Contexts: https://www.w3.org/TR/json-ld11/#the-context
- Friends General Conference (FGC): https://www.fgcquaker.org
- Friends United Meeting (FUM): https://www.fum.org
- Evangelical Friends International (EFI): https://www.evangelicalfriends.org
- Britain Yearly Meeting: https://www.quaker.org.uk
- Quaker Cloud project: https://quaker.cloud
- Quaker Cloud namespace: https://quaker.cloud/spec/ns/
