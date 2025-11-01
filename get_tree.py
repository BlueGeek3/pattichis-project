import os

# =========================
# CONFIG: use paths RELATIVE to project root (where this file lives)
# =========================

EXCLUDE = {
    # Files/dirs to omit entirely from the tree (not listed, not descended into)
    "get_tree.py": True,
    "backend/app/__pycache__": True,
    "backend/app/routes/__pycache__": True,
    "Tree_And_Files_Output.txt": True,
    ".env.example": True
}

SHALLOW = {
    # Dirs to show as a single line (listed but NOT recursed into)
    ".git": True,
    ".vs": True,
    ".github": True,
    "mobile/node_modules": True,
    "backend/node_modules": True,
    ".conda": True,
    "backend/venv": True
}

# Files to show (optionally with line ranges). Keys are paths relative to project root.
# [] means full file; otherwise list of (start, end) 1-based inclusive ranges.
DISPLAY_FILES_WITH_RANGES = {
    "backend/.env": [],
    "mobile/App.tsx": [],
    "mobile/screens/History.tsx": [],
    "mobile/screens/Home.tsx": [], #"mobile/screens/Home.tsx": [(1,23)], Example of ranges
    "mobile/screens/Intro.tsx": [],
    "mobile/screens/Log.tsx": [],
    "mobile/screens/Profile.tsx": [],
    "mobile/app.tsx": [],
    "mobile/index.ts": [],
    "mobile/lib/api.ts": []
}

# Toggle line numbers when printing files
SHOW_LINE_NUMBERS = False

# Preferred encodings to try when reading text files (Windows-safe order)
READ_ENCODINGS = ("utf-8", "utf-8-sig", "cp1252", "latin-1", "utf-16")


# =========================
# Helpers for path normalization
# =========================

def _norm_key(p: str) -> str:
    """
    Normalize a user-specified relative path key:
    - strip leading ./ or .\\
    - normalize separators and dot segments
    - apply case-folding on case-insensitive OSes (via normcase)
    - remove trailing separator
    """
    p = (p or "").strip().lstrip("./\\")
    # normpath collapses redundant separators and up-level refs
    p = os.path.normpath(p)
    # normcase makes it case-insensitive on Windows/mac (APFS can be either)
    p = os.path.normcase(p)
    return p


def _rel_norm(root: str, abs_path: str) -> str:
    """Relative normalized key for an absolute path, comparable to _norm_key keys."""
    rel = os.path.relpath(abs_path, root)
    return _norm_key(rel)


def _normalize_config_maps():
    """Produce normalized sets/maps from the user config dicts."""
    exclude_set = { _norm_key(k) for k, v in EXCLUDE.items() if v }
    shallow_set = { _norm_key(k) for k, v in SHALLOW.items() if v }
    display_map = { _norm_key(k): v for k, v in DISPLAY_FILES_WITH_RANGES.items() }
    return exclude_set, shallow_set, display_map


# =========================
# IO helpers
# =========================

def read_text_lines(file_path):
    """
    Read a text file into a list of lines, trying multiple encodings to avoid UnicodeDecodeError.
    Falls back to UTF-8 with replacement characters if all attempts fail.
    """
    for enc in READ_ENCODINGS:
        try:
            with open(file_path, "r", encoding=enc) as f:
                return f.readlines()
        except UnicodeDecodeError:
            continue
        except Exception:
            # Non-encoding related issues should surface later (e.g., permissions)
            continue
    # Last-resort: decode with replacement so the script never crashes
    with open(file_path, "r", encoding="utf-8", errors="replace") as f:
        return f.readlines()


# =========================
# Validation & rendering
# =========================

def validate_files_and_ranges(project_root, display_map):
    """
    Validate that each requested display file exists (by exact relative path),
    and that any specified ranges are within bounds.
    """
    ok = True
    for rel_key, ranges in display_map.items():
        abs_path = os.path.join(project_root, rel_key)
        if not os.path.isfile(abs_path):
            print(f"The file '{rel_key}' specified for display does not exist.")
            ok = False
            continue

        if ranges:
            lines = read_text_lines(abs_path)
            n = len(lines)
            for (start, end) in ranges:
                if start < 1 or end < 1 or start > end:
                    print(f"Error: Invalid LOC range ({start}, {end}) in '{rel_key}'.")
                    ok = False
                    break
                if end > n:
                    print(f"Error: LOC range end {end} in '{rel_key}' exceeds file length ({n}).")
                    ok = False
                    break
    return ok


def display_directory_tree(project_root, exclude_set, shallow_set, path=None, indent="", output_lines=None):
    """
    Build and append the directory tree to output_lines.
    - EXCLUDE: hide entry entirely (no listing, no recursion)
    - SHALLOW: list the directory but do not recurse into it
    """
    if output_lines is None:
        output_lines = []
    if path is None:
        path = project_root

    try:
        entries = sorted(os.listdir(path))
    except PermissionError:
        output_lines.append(indent + "└── [Permission Denied]")
        return
    except FileNotFoundError:
        output_lines.append(indent + "└── [Not Found]")
        return

    for i, name in enumerate(entries):
        entry_path = os.path.join(path, name)
        rel_key = _rel_norm(project_root, entry_path)

        # If excluded, skip entirely
        if rel_key in exclude_set:
            continue

        prefix = "└── " if i == len(entries) - 1 else "├── "
        output_lines.append(indent + prefix + name)

        # If directory: recurse unless shallow
        if os.path.isdir(entry_path):
            if rel_key in shallow_set:
                # Shallow: do not descend
                continue
            new_indent = indent + ("    " if i == len(entries) - 1 else "│   ")
            display_directory_tree(project_root, exclude_set, shallow_set, entry_path, new_indent, output_lines)


def display_file_contents(project_root, display_map, output_lines):
    """
    Append contents of files specified in display_map (keys are RELATIVE paths).
    Ranges are 1-based (inclusive). If empty, print entire file.
    NOTE: This ignores EXCLUDE/SHALLOW and uses direct paths—if you listed it here,
    we assume you want to show it.
    """
    items = list(display_map.items())
    for index, (rel_key, ranges) in enumerate(items):
        # Separator lines between files
        if index > 0:
            output_lines.append("\n" + "=" * 90)

        output_lines.append(f"\nContents of {rel_key}:")
        abs_path = os.path.join(project_root, rel_key)

        if not os.path.isfile(abs_path):
            output_lines.append(f"[Skipped: '{rel_key}' not found]")
            continue

        lines = read_text_lines(abs_path)

        if not ranges:
            if SHOW_LINE_NUMBERS:
                output_lines.extend([f"{i+1} {line.rstrip()}" for i, line in enumerate(lines)])
            else:
                output_lines.extend([line.rstrip() for line in lines])
        else:
            n = len(lines)
            for (start, end) in ranges:
                s = max(1, start)
                e = min(n, end)
                if SHOW_LINE_NUMBERS:
                    for i, line in enumerate(lines[s-1:e], start=s):
                        output_lines.append(f"{i} {line.rstrip()}")
                else:
                    output_lines.extend([lines[i-1].rstrip() for i in range(s, e + 1)])


def main():
    """Main orchestrator."""
    project_root = os.path.dirname(os.path.realpath(__file__))
    exclude_set, shallow_set, display_map = _normalize_config_maps()

    # Validate display targets (by exact paths)
    if not validate_files_and_ranges(project_root, display_map):
        return

    output_file = "Tree_And_Files_Output.txt"
    output_lines = [project_root]

    # Tree
    display_directory_tree(project_root, exclude_set, shallow_set, output_lines=output_lines)

    # Files
    display_file_contents(project_root, display_map, output_lines)

    # Write output
    with open(os.path.join(project_root, output_file), 'w', encoding='utf-8') as f:
        f.write("\n".join(output_lines))


if __name__ == "__main__":
    main()
