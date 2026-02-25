---
title: Memorial Minute Specification
description: A standard data model, serialization formats, and URL conventions for memorial minutes published by Quaker meetings.
version: "0.1"
specStatus: Draft
publishDate: 2026-02-25
lastModified: 2026-02-25
namespace: "https://quaker.cloud/spec/ns/memorial/"
---

## Overview

A memorial minute is a written tribute prepared by a Quaker meeting to honor a Friend who has died. It is read in meeting for worship with attention to business, entered into the minutes, and often shared with other meetings and publications such as yearly meeting journals. This specification defines a standard data model, serialization formats, and URL conventions for memorial minutes published by Quaker meetings and worship groups.

The goal is interoperability: a meeting should be able to publish memorial minutes in a structured format that other Quaker platforms, directories, and publications can consume without requiring manual re-entry.

This specification draws on schema.org vocabulary wherever possible to avoid reinventing structures that the broader web already understands, and to enable memorial minutes to be indexed and understood by general-purpose tools.

---

## Scope

This specification covers:

- The data model for a memorial minute record
- Handling of partial or uncertain dates
- Place of birth, death, and meeting membership
- Name representation across cultural conventions
- Date and place entry user interface requirements
- Serialization formats: JSON-LD, XML, and Atom
- URL structure and namespace conventions
- A minimal reference listing format

It does not cover the internal meeting process for drafting or approving memorial minutes, nor does it specify the spiritual or theological content of the minute body itself.

---

## Data Model

### Top-Level Fields

| Field          | Schema.org Term       | Required | Notes                                                  |
| -------------- | --------------------- | -------- | ------------------------------------------------------ |
| `identifier`   | `schema:identifier`   | Yes      | Unique ID within the meeting's namespace               |
| `dateCreated`  | `schema:dateCreated`  | Yes      | ISO 8601 date the record was created                   |
| `dateModified` | `schema:dateModified` | No       | ISO 8601 date last modified                            |
| `publisher`    | `schema:publisher`    | Yes      | The meeting or worship group that approved this minute |
| `person`       | `schema:Person`       | Yes      | The Friend being remembered (see below)                |
| `body`         | `schema:articleBody`  | Yes      | Free-form text of the minute                           |
| `language`     | `schema:inLanguage`   | No       | BCP 47 language tag (e.g. `en`, `fi`, `de`)            |
| `source`       | `schema:isPartOf`     | No       | Publication or minute book this appears in             |

### Person Fields

The person block uses `schema:Person` vocabulary. Name fields follow schema.org conventions, which are deliberately culture-neutral: they do not assume a specific word order or that any particular component is present.

| Field             | Schema.org Term          | Required | Notes                                                                          |
| ----------------- | ------------------------ | -------- | ------------------------------------------------------------------------------ |
| `givenName`       | `schema:givenName`       | No       | First/personal name(s)                                                         |
| `familyName`      | `schema:familyName`      | No       | Family, clan, or surname                                                       |
| `additionalName`  | `schema:additionalName`  | No       | Middle name(s) or additional given names                                       |
| `honorificPrefix` | `schema:honorificPrefix` | No       | e.g. Dr., Rev., Elder                                                          |
| `honorificSuffix` | `schema:honorificSuffix` | No       | e.g. Jr., Sr., III                                                             |
| `birthDate`       | `schema:birthDate`       | No       | ISO 8601 partial date: `1923-04-17`, `1923-04`, or `1923` — see Date Precision |
| `deathDate`       | `schema:deathDate`       | No       | ISO 8601 partial date — see Date Precision                                     |
| `birthPlace`      | `schema:birthPlace`      | No       | Place object or free text — see Place Fields                                   |
| `deathPlace`      | `schema:deathPlace`      | No       | Place object or free text — see Place Fields                                   |
| `memberOf`        | `schema:memberOf`        | No       | Meeting(s) the Friend held membership in — see Place Fields                    |

**Note on name ordering:** Schema.org does not prescribe display order. Implementations should not assume `givenName familyName` order. Display name construction should follow the cultural conventions of the meeting or the Friend's own preference where known. The `name` field from `schema:Person` may be used to store a canonical display name when word order is culturally significant.

### Date Precision

Dates of birth and death are often uncertain for historical figures, or known only partially for contemporary ones. This specification uses ISO 8601 partial date strings to represent whatever is known, without requiring any additional metadata field to signal precision. The specificity of the string itself is the signal.

**ISO 8601 partial dates:**

ISO 8601 permits reduced-precision representations. All three forms are valid values for `birthDate` and `deathDate`:

| Form       | Example      | Use when                             |
| ---------- | ------------ | ------------------------------------ |
| Full date  | `1923-04-17` | Day, month, and year are known       |
| Year-month | `1923-04`    | Month and year are known; day is not |
| Year only  | `1923`       | Only the year is known               |

If the date is entirely unknown, the field should be omitted rather than set to an empty string or a placeholder value. Omission means unknown; a partial string means partially known.

**Examples:**

Day, month, and year known:

```json
"birthDate": "1923-04-17"
```

Year and month known, day not recorded:

```json
"birthDate": "1923-04"
```

Year only known:

```json
"birthDate": "1923"
```

Death date recorded, birth date not known (omit `birthDate` entirely):

```json
"deathDate": "2024-09-14"
```

This convention is consistent with how schema.org documents `birthDate` and `deathDate`, and how established genealogical data formats handle partial knowledge. A consuming system — whether a search engine, a language model, or another Quaker platform — can determine precision directly from the string format without any additional vocabulary.

**Note on accuracy vs. precision:** This model handles *precision* (how much of the date is known) but not *accuracy* (whether what is recorded is correct). A date recorded as `1923` may be an estimate that could be off by several years. This specification does not provide a field for accuracy qualifiers in v0.1; that is noted as an open question for archival and historical use cases.

---

## Place Fields

Place data serves two purposes in this specification: disambiguation (distinguishing two Friends with similar names and overlapping dates) and historical record (documenting where a Friend was born, died, or worshipped). Both are legitimate, and both are served by the same structure.

Schema.org's `Place` object is used as the basis. Its full vocabulary includes street addresses, geo-coordinates, containedInPlace hierarchies, and more — none of which are needed here. This specification defines a constrained subset.

### Place object

A Place object in this specification has the following fields:

| Field            | Schema.org Term         | Required | Notes                                                                                       |
| ---------------- | ----------------------- | -------- | ------------------------------------------------------------------------------------------- |
| `name`           | `schema:name`           | No       | Free-text name of the specific place (city, town, village, neighbourhood)                   |
| `addressRegion`  | `schema:addressRegion`  | No       | State, province, county, or equivalent subdivision                                          |
| `addressCountry` | `schema:addressCountry` | No       | ISO 3166-1 alpha-2 country code (e.g. `FI`, `GB`, `US`) or plain text for historical places |

All three fields are optional. A Place object may have any combination — including just a country, just a city name, or all three. The intent is to capture whatever is known without requiring what is not.

**Why not a full address?** Street-level address data is inappropriate for birth and death records in a published memorial minute. It is not necessary for disambiguation and may implicate the privacy of surviving family members.

**Historical place names:** Country borders and place names change over time. A Friend born in 1880 in what is now Finland may have been recorded as born in the Russian Empire or in Grand Duchy of Finland. `addressCountry` accepts plain text for historical places where an ISO country code would be anachronistic or misleading. If using a plain text country name, use the name as it would have been used at the time of the event rather than the contemporary name.

**Examples:**

City and country known:

```json
"birthPlace": {
  "@type": "Place",
  "name": "Turku",
  "addressCountry": "FI"
}
```

Region and country known, city not recorded:

```json
"birthPlace": {
  "@type": "Place",
  "addressRegion": "Yorkshire",
  "addressCountry": "GB"
}
```

Historical place name:

```json
"birthPlace": {
  "@type": "Place",
  "name": "Vyborg",
  "addressCountry": "Grand Duchy of Finland"
}
```

Country only:

```json
"birthPlace": {
  "@type": "Place",
  "addressCountry": "US"
}
```

Free text fallback (when structured entry is not possible or the place is ambiguous):

```json
"birthPlace": {
  "@type": "Place",
  "name": "near Philadelphia"
}
```

### Meeting membership

The `memberOf` field records which meeting or meetings the Friend held membership in during their life. This is genealogically significant: meeting membership records are often the most complete documentary source for Quaker individuals, and knowing a Friend's meeting can resolve ambiguity that names and dates alone cannot.

`memberOf` accepts either a single Organization object or an array of them:

```json
"memberOf": [
  {
    "@type": "Organization",
    "name": "Helsinki Monthly Meeting",
    "qc:meetingType": "monthly"
  },
  {
    "@type": "Organization",
    "name": "Finland Yearly Meeting",
    "qc:meetingType": "yearly"
  }
]
```

### Place entry user interface

The same principle applies to place entry as to date entry: users must not be forced to enter more than they know.

The recommended pattern is three independent optional fields presented in order — city/town, region, country — each of which can be filled, partially filled, or left blank. None of the three should be required for the record to save.

Country entry should offer an autocomplete list backed by ISO 3166-1 country names, but allow free text for historical place names not in the standard list. Region entry is a free text field — the variety of subdivision types across countries (states, provinces, counties, cantons, oblasts, prefectures) makes a controlled vocabulary impractical at this scope.

This section is part of the specification because the data model and the entry interface must be designed together. An off-the-shelf calendar widget will corrupt data: it requires a complete date selection, which forces a user to either falsify the day and month, or abandon the field. Neither outcome is acceptable for a record where data integrity matters and partial knowledge is routine.

**Implementations must not require users to enter more date components than they know.**

The reference pattern for date entry is a stepwise progressive input:

1. The user enters a four-digit year. This alone is sufficient to save the record. The stored value is `1923`.
2. Optionally, the user adds a month. A simple 1–12 numeric field or short-name dropdown is appropriate. The month input is only shown or enabled once a year has been entered. The stored value becomes `1923-04`.
3. Optionally, the user adds a day. The day input is only shown or enabled once a month has been entered. The stored value becomes `1923-04-17`.

At each step the user may stop. The form does not require progression to the next level before it can be saved or submitted.

This is not a calendar. There is no month-grid view, no "today" shortcut, and no requirement to navigate through months to select a date. The input is structured text with progressive optional fields. Implementations may offer a calendar as an optional convenience for full-date entry, but must not make it the only path.

**Resulting stored values by input level:**

| User enters        | Stored value  |
| ------------------ | ------------- |
| Year only          | `1923`        |
| Year + month       | `1923-04`     |
| Year + month + day | `1923-04-17`  |
| Nothing / unknown  | Field omitted |

This pattern is established in genealogical software (FamilySearch, Gramps, GEDCOM) and archival systems (EAD). It is not novel; implementations can look to those systems for reference UI patterns.

---

The `publisher` object identifies the meeting responsible for the minute.

| Field           | Notes                                                                                   |
| --------------- | --------------------------------------------------------------------------------------- |
| `name`          | Full name of the meeting                                                                |
| `meetingType`   | One of: `worship-group`, `preparative`, `monthly`, `quarterly`, `half-yearly`, `yearly` |
| `url`           | Canonical URL of the meeting's website                                                  |
| `yearlyMeeting` | Name of affiliated yearly meeting, if any                                               |
| `quakerBranch`  | e.g. `unprogrammed`, `programmed`, `conservative`, `evangelical`                        |

---

## Serialization Formats

### JSON-LD

The canonical serialization is JSON-LD using schema.org vocabulary. This format is recommended for REST APIs and for embedding in HTML pages as structured data.

File extension: `.json`
Media type: `application/ld+json`

```json
{
  "@context": {
    "@vocab": "https://schema.org/",
    "qc": "https://quaker.cloud/spec/ns/memorial/"
  },
  "@type": "Article",
  "qc:type": "MemorialMinute",
  "identifier": "memorial/lindqvist-anna-maria-2024",
  "dateCreated": "2024-11-01",
  "inLanguage": "fi",
  "publisher": {
    "@type": "Organization",
    "name": "Finland Yearly Meeting",
    "url": "https://kvakari.fi",
    "qc:meetingType": "yearly",
    "qc:quakerBranch": "unprogrammed"
  },
  "about": {
    "@type": "Person",
    "givenName": "Anna Maria",
    "familyName": "Lindqvist",
    "birthDate": "1923",
    "birthPlace": {
      "@type": "Place",
      "name": "Turku",
      "addressCountry": "FI"
    },
    "deathDate": "2024-09-14"
  },
  "articleBody": "Full text of the memorial minute goes here..."
}
```

### XML

The XML format is intended for archival use and exchange with systems that prefer XML. It uses a `quaker.cloud` namespace alongside `schema.org` property names for field identification.

File extension: `.xml`
Media type: `application/xml`
Namespace: `https://quaker.cloud/spec/ns/memorial/`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<memorialMinute
  xmlns="https://quaker.cloud/spec/ns/memorial/"
  xmlns:schema="https://schema.org/"
  version="0.1">

  <identifier>memorial/lindqvist-anna-maria-2024</identifier>
  <dateCreated>2024-11-01</dateCreated>
  <inLanguage>fi</inLanguage>

  <publisher>
    <schema:name>Finland Yearly Meeting</schema:name>
    <schema:url>https://kvakari.fi</schema:url>
    <meetingType>yearly</meetingType>
    <quakerBranch>unprogrammed</quakerBranch>
  </publisher>

  <about schema:type="Person">
    <schema:givenName>Anna Maria</schema:givenName>
    <schema:familyName>Lindqvist</schema:familyName>
    <schema:birthDate>1923</schema:birthDate>
    <schema:birthPlace schema:type="Place">
      <schema:name>Turku</schema:name>
      <schema:addressCountry>FI</schema:addressCountry>
    </schema:birthPlace>
    <schema:deathDate>2024-09-14</schema:deathDate>
  </about>

  <schema:articleBody><![CDATA[
    Full text of the memorial minute goes here...
  ]]></schema:articleBody>

</memorialMinute>
```

### RSS / Atom Feed

Meetings may publish a feed of memorial minutes for syndication. Atom is preferred over RSS 2.0 for its cleaner namespace handling and better internationalization support.

File extension: `.atom` or `.xml`
Media type: `application/atom+xml`
Recommended feed URL path: `/memorial-minutes/feed.atom`

Each `<entry>` in the feed should include:

- `<title>`: Display name of the Friend
- `<id>`: Canonical URI of the memorial minute record
- `<updated>`: Date of last modification
- `<published>`: Date the minute was approved or first published
- `<summary>`: Optional brief excerpt
- `<content>`: Full minute text or link via `<link rel="alternate">`
- Custom extension elements in the `memorial:` namespace for structured person data

```xml
<entry>
  <title>In memory of Anna Maria Lindqvist (c. 1923–2024)</title>
  <id>https://kvakari.fi/memorial-minutes/lindqvist-anna-maria-2024</id>
  <updated>2024-11-01T00:00:00Z</updated>
  <published>2024-11-01T00:00:00Z</published>
  <memorial:person
    xmlns:memorial="https://quaker.cloud/spec/ns/memorial/"
    givenName="Anna Maria"
    familyName="Lindqvist"
    birthDate="1923"
    birthPlaceName="Turku"
    birthPlaceCountry="FI"
    deathDate="2024-09-14" />
  <content type="html"><![CDATA[ ... ]]></content>
</entry>
```

---

## URL Structure

Implementations should follow a consistent URL pattern. The recommended structure is:

```text
/{base-path}/{slug}
```

Where `{base-path}` defaults to `memorial-minutes` and `{slug}` is a URL-safe identifier derived from the Friend's name and death year.

**Slug construction:**

Slugs should be constructed from `familyName` + `givenName` + death year, lowercased and hyphenated, with Latin-script diacritics transliterated for URL safety (e.g. `ä` → `a`, `ö` → `o`). Where family name conventions differ (e.g. patronymics, matronymics, single names), the meeting should document its own slug convention and apply it consistently.

For names in non-Latin scripts (Arabic, Chinese, Japanese, Korean, Cyrillic, and others), transliteration is ambiguous and lossy. Implementations expecting non-Latin names should use either a manually specified slug field that the editor fills in, or a numeric identifier as the URL slug. The numeric fallback is always acceptable:

```text
/memorial-minutes/42
```

Name-derived slug generation is recommended for Latin-script names but must not be the only option.

Examples:

```text
/memorial-minutes/lindqvist-anna-maria-2024
/memorial-minutes/garcia-lopez-jose-maria-2019
/memorial-minutes/krishnamurthy-2001
/memorial-minutes/42
```

**Namespace listing page:**

A listing of all memorial minutes for a meeting should be available at the `{base-path}` URL:

```text
/memorial-minutes/
```

The listing should support at minimum:

- Chronological order by death date (most recent first by default)
- Alphabetical order by family name
- Where family naming conventions vary, alphabetical sorting should follow the convention established in the meeting's own metadata

**Serialization endpoints:**

Individual records should be available in all supported formats via content negotiation or explicit URL suffixes:

```text
/memorial-minutes/lindqvist-anna-maria-2024          (HTML, default)
/memorial-minutes/lindqvist-anna-maria-2024.json     (JSON-LD)
/memorial-minutes/lindqvist-anna-maria-2024.xml      (XML)
/memorial-minutes/feed.atom                           (Atom feed, all records)
```

---

## Open Questions

The following questions are noted for future revision:

1. **Multilingual minutes (high priority):** A meeting may publish the same minute in more than one language — this is an immediate practical concern for meetings operating in bilingual contexts (e.g. Finnish/Swedish in Finland, Welsh/English in Wales). Should multilingual versions be separate records linked by a `sameAs` relationship, or variants within a single record? The current `inLanguage` field assumes one language per record, which may be too restrictive.

2. **Date accuracy qualifiers:** The current model handles *precision* (how much of the date is known) via partial ISO strings, but not *accuracy* (whether what is recorded is correct). For historical records where a year like `1923` may itself be an estimate, a future version may need a qualifier field. This should be addressed in v0.2 with reference to established archival vocabularies.

3. **Name disambiguation:** When two Friends share a family name and the same death year, the current slug convention creates a collision. A numeric suffix (`-2`) is a practical workaround, but a more principled approach may be needed.

4. **Historical minutes:** Some meetings hold minutes going back centuries. The question of digitization standards and archival metadata (provenance, transcription notes) is out of scope for version 0.1.

5. **Privacy:** For Friends who died recently, some family members may have privacy concerns about publishing detailed biographical information. Implementations should consider whether birth dates and biographical details should be withheld even when known, and whether the specification should define a mechanism for redacting or omitting fields on request.

6. **Relationship to FGC's memorial resources:** Friends General Conference and yearly meetings often also hold or republish memorial minutes. A `relatedLink` or `sameAs` field could support cross-referencing between platforms.

---

## Conformance

An implementation is considered conformant with this specification if it:

- Provides JSON-LD serialization as the baseline format (required)
- Provides an Atom feed at a stable, documented URL (strongly recommended)
- Includes the required fields: `identifier`, `dateCreated`, `publisher`, `person` (with at least `familyName` or `givenName`), and `articleBody`
- Uses ISO 8601 partial date strings for any date values, omitting fields that are entirely unknown
- Follows the date entry UI requirements: does not force users to enter more date components than they know
- Makes a listing of all published memorial minutes available at a stable URL

XML serialization is optional. Implementations that provide only XML without JSON-LD are not conformant, as JSON-LD is the format most widely consumed by search engines, language models, and federated Quaker platforms.

Implementations are encouraged to support all three serialization formats.

---

## References

- schema.org Person: https://schema.org/Person
- schema.org Article: https://schema.org/Article
- schema.org Place: https://schema.org/Place
- ISO 3166-1 country codes: https://www.iso.org/iso-3166-country-codes.html
- BCP 47 (language tags): https://www.rfc-editor.org/rfc/rfc5646
- Atom Syndication Format: https://www.rfc-editor.org/rfc/rfc4287
- JSON-LD 1.1: https://www.w3.org/TR/json-ld11/
- Western Friend website (reference implementation, Wagtail/Django): https://github.com/westernfriend/westernfriend.org
- FamilySearch date handling (stepwise date entry reference): https://www.familysearch.org
- GEDCOM 7.0 date and place specification: https://gedcom.io/specifications/FamilySearchGEDCOMv7.html
- Quaker Cloud project: https://quaker.cloud
- Quaker Cloud memorial minute namespace: https://quaker.cloud/spec/ns/memorial/
