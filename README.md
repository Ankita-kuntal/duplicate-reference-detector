# Duplicate Reference Detector

This is a simple prototype that detects duplicate references (URLs) before adding them.

## Problem
While editing articles, the same reference can be added multiple times in slightly different formats — for example:
- with or without `https`
- with or without `www`
- with trailing slashes

This leads to duplicate references and makes the article less clean and harder to maintain.

## Approach
This prototype normalizes references before comparing them.

The normalization includes:
- converting to lowercase
- removing protocol (`http://`, `https://`)
- removing `www.` if present
- removing trailing slashes

After normalization, the new reference is compared with existing references.

If a duplicate is found, the system also returns the already existing reference so it can be reused.

## Example

Input: https://www.example.com/article/

Existing: https://example.com/article

Duplicate reference found!
You can reuse: https://example.com/article


## What this prototype demonstrates
- Basic duplicate detection logic using normalization
- Handling small variations in URLs
- Returning the matched reference for reuse (better user experience)

## Possible Improvements
- Support DOI and ISBN-based matching
- Handle query parameters and redirects
- Improve normalization for more edge cases
- Suggest reuse directly inside the editor UI
- Integrate with Visual Editor for real-time duplicate detection

