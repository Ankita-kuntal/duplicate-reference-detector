# function to clean the URL before comparison
def normalize_url(url):
    url = url.strip().lower()

    # remove protocol (http / https)
    if url.startswith("http://"):
        url = url[len("http://"):]
    elif url.startswith("https://"):
        url = url[len("https://"):]

    # remove trailing slash if present
    if url.endswith("/"):
        url = url[:-1]

    return url


# function to check if reference already exists
def check_duplicate(new_ref, existing_refs):
    new_ref_clean = normalize_url(new_ref)

    for ref in existing_refs:
        if normalize_url(ref) == new_ref_clean:
            return True

    return False


# sample existing references
existing_refs = [
    "https://example.com/article",
    "http://abc.com/news/",
    "https://test.com/page"
]


# take input from user
new_ref = input("Enter new reference (URL): ")


# check and print result
if check_duplicate(new_ref, existing_refs):
    print("Duplicate reference found!")
    print("You can reuse the existing reference")
else:
    print("This is a new reference. You can add it!")