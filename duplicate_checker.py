def normalize_url(url):
    url = url.strip().lower()

    if url.startswith("http://"):
        url = url[7:]
    elif url.startswith("https://"):
        url = url[8:]

    if url.startswith("www."):
        url = url[4:]

    url = url.split("?")[0]
    url = url.split("#")[0]

    if url.endswith("/"):
        url = url[:-1]

    return url


def check_duplicate(new_ref, existing_refs):
    new_clean = normalize_url(new_ref)

    normalized_existing = [normalize_url(ref) for ref in existing_refs]

    for i in range(len(normalized_existing)):
        if normalized_existing[i] == new_clean:
            return True, existing_refs[i]

    return False, None


existing_refs = [
    "https://example.com/article",
    "http://abc.com/news/",
    "https://test.com/page"
]


new_ref = input("Enter new reference (URL): ")

is_dup, matched = check_duplicate(new_ref, existing_refs)

if is_dup:
    print("Duplicate reference found!")
    print("You can reuse:", matched)
else:
    print("This is a new reference. You can add it!")
