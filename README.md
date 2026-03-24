# Duplicate Reference Detector

This is a simple prototype for detecting duplicate references such as URLs.

## Problem
While adding references, the same source can be inserted multiple times in different formats (for example, with or without "https" or trailing slashes). This leads to duplicate references.

## Approach
This prototype checks if a reference already exists before adding it.

- The input reference is normalized (removing protocol and trailing slashes)
- Existing references are normalized in the same way
- A comparison is performed to detect duplicates

## Example
Input:
https://example.com/article/

Existing:
https://example.com/article

Output:
Duplicate reference detected

## Possible Improvements
- Support DOI and ISBN comparison
- Improve normalization (handle query parameters, redirects, etc.)
- Suggest reusing an existing reference instead of adding a duplicate
