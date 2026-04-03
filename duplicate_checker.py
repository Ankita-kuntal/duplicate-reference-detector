# clean a URL before comparing
def normalize_url(url):
    url = url.strip().lower()

    # remove protocol
    if url.startswith("http://"):
        url = url[7:]
    elif url.startswith("https://"):
        url = url[8:]

    # remove www if present
    if url.startswith("www."):
        url = url[4:]

    # remove trailing slash
    if url.endswith("/"):
        url = url[:-1]

    return url


# check if reference already exists
def check_duplicate(new_ref, existing_refs):
    new_clean = normalize_url(new_ref)

    # normalize all existing refs once
    normalized_existing = []
    for ref in existing_refs:
        normalized_existing.append(normalize_url(ref))

    for i in range(len(normalized_existing)):
        if normalized_existing[i] == new_clean:
            return True, existing_refs[i]   # return original match

    return False, None


# sample references
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
