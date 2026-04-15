# Duplicate Reference Detector

**Prototype for Outreachy Wishlist #3**  
Automatic Duplicate Reference Detection in the Visual Editor  
**Author:** Ankita Kuntal | [Live Demo](https://ankita-kuntal.github.io/duplicate-reference-detector/)

---

## What this prototype does

When an editor adds a citation in Wikipedia's Visual Editor, there is currently no check
to see whether the same source already exists in the article. This leads to duplicate
references that clutter the article source.

This prototype implements the **core detection logic** that would run inside the VE
before making a Citoid API call — checking locally first.

---

## How it works

### 1. Normalization
The same source can appear in many formats. Before comparing, identifiers are
converted to a canonical form:

| Type | Example input | Normalized |
|------|--------------|-----------|
| URL  | `https://www.example.com/page/` | `example.com/page` |
| URL  | `http://example.com/page` | `example.com/page` |
| DOI  | `https://doi.org/10.1000/xyz` | `10.1000/xyz` |
| DOI  | `DOI: 10.1000/XYZ` | `10.1000/xyz` |
| ISBN | `978-3-16-148410-0` | `9783161484100` |

### 2. O(1) Duplicate Detection
Normalized identifiers are stored in a JavaScript `Map`.  
Each new reference is normalized and looked up in O(1) time — no scanning.  
This keeps the editor responsive even on long articles with hundreds of references.

### 3. Where this fits in the Visual Editor
In the actual VE integration, this logic would intercept
`ve.ui.MWCitoidInspector.prototype.performLookup` — the method that fires
when an editor pastes a URL or DOI into the citation dialog.  
The check runs against the document's `InternalList` (which stores all existing
`mwReference` nodes) **before** any network request is made.

If a match is found, the user sees a notification and is offered the option to
reuse the existing reference instead of creating a duplicate.

---

## Try it

```
git clone https://github.com/Ankita-kuntal/duplicate-reference-detector
# open index.html in your browser
```

Or visit the [live demo](https://ankita-kuntal.github.io/duplicate-reference-detector/).

**Test cases to try:**
- `http://example.com/article` → duplicate (matches `https://example.com/article/`)
- `10.1000/xyz123` → duplicate (matches `https://doi.org/10.1000/xyz123`)
- `978 3 16 148410 0` → duplicate (matches `978-3-16-148410-0`)
- `https://github.com` → new reference

---

## What I learned exploring the problem

- The VE and Citoid are separate codebases. The citation automation logic lives in
  `ve.ui.MWCitoidInspector.js` and communicates with the Citoid extension.
- The `InternalList` is the VE's internal store for all references in the document.
  A duplicate check needs to read from here, not the DOM.
- Normalization is the hardest part — DOIs are case-insensitive, ISBNs can appear
  with or without hyphens, and URLs have at least 4 common variations for the same page.
- False positives (flagging something as duplicate when it isn't) are worse than
  false negatives here, because blocking an editor unnecessarily is disruptive.

---

## Next steps (full VE integration)

1. Hook into `performLookup` in `ve.ui.MWCitoidInspector.js`
2. Read existing refs from `ve.dm.InternalList`
3. Render duplicate alert using `OO.ui.MessageWidget` (matches VE design patterns)
4. Add "Switch to Reuse tab" action button that highlights the matching reference
