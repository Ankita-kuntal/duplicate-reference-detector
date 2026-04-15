/**
 * Duplicate Reference Detector
 * Prototype for Wishlist #3 - Visual Editor Duplicate Reference Detection
 * 
 * In the actual VE integration, this logic would hook into
 * ve.ui.MWCitoidInspector.prototype.performLookup before
 * making the Citoid API call, checking the document's
 * InternalList first.
 */

// --- Normalization Utilities ---

function normalizeURL(url) {
  try {
    url = url.trim().toLowerCase();
    // Strip protocol
    url = url.replace(/^https?:\/\//, '');
    // Strip www
    url = url.replace(/^www\./, '');
    // Strip query string and fragment
    url = url.split('?')[0].split('#')[0];
    // Strip trailing slash
    url = url.replace(/\/$/, '');
    return url;
  } catch (e) {
    return url.trim().toLowerCase();
  }
}

function normalizeDOI(doi) {
  doi = doi.trim().toLowerCase();
  // Strip resolver prefix in all common forms
  doi = doi.replace(/^https?:\/\/doi\.org\//i, '');
  doi = doi.replace(/^doi:\s*/i, '');
  return doi;
}

function normalizeISBN(isbn) {
  // Strip hyphens, spaces — compare raw digits/X only
  return isbn.replace(/[\s\-]/g, '').toUpperCase();
}

/**
 * Detect identifier type from raw input string.
 * Mirrors how VE/Citoid infers identifier type.
 */
function detectType(identifier) {
  identifier = identifier.trim();
  if (/^https?:\/\//i.test(identifier)) {
    if (/doi\.org/i.test(identifier)) return 'doi';
    return 'url';
  }
  if (/^doi:/i.test(identifier) || /^10\.\d{4,}/.test(identifier)) return 'doi';
  if (/^(97[89])?\d{9}[\dX]$/i.test(identifier.replace(/[\s\-]/g, ''))) return 'isbn';
  return 'url'; // fallback
}

function normalize(identifier, type) {
  switch (type) {
    case 'url':  return normalizeURL(identifier);
    case 'doi':  return normalizeDOI(identifier);
    case 'isbn': return normalizeISBN(identifier);
    default:     return identifier.trim().toLowerCase();
  }
}

// --- Core Detector (O(1) lookup via Map) ---

class DuplicateDetector {
  constructor() {
    // Map: normalized key → original reference object
    this.refMap = new Map();
  }

  /**
   * Load existing references from the document.
   * In real VE integration: iterate InternalList mwReference nodes
   * and extract templateData identifiers.
   */
  loadRefs(refs) {
    this.refMap.clear();
    for (const ref of refs) {
      const type = detectType(ref.identifier);
      const key = normalize(ref.identifier, type);
      this.refMap.set(key, ref);
    }
  }

  /**
   * Check if a new identifier is a duplicate.
   * Returns { isDuplicate, existing, normalizedKey }
   */
  check(identifier) {
    const type = detectType(identifier);
    const key = normalize(identifier, type);
    if (this.refMap.has(key)) {
      return {
        isDuplicate: true,
        type,
        normalizedKey: key,
        existing: this.refMap.get(key)
      };
    }
    return { isDuplicate: false, type, normalizedKey: key };
  }
}

// Export for use in both browser and Node
if (typeof module !== 'undefined') module.exports = { DuplicateDetector, normalize, detectType };
