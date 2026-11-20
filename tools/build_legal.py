"""Builds terms.html and privacy.html from legal/{terms,privacy}.md (copied verbatim from the app's docs/legal; refresh with tools/legal.sh).

Handles only what those files use: #/## headings, paragraphs, - lists (two-space nesting), | tables, **bold**, `code`.
Run by `npm run build` before Vite; the generated pages are not committed."""

import html
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PAGES = {
    "terms": "Terms of Use",
    "privacy": "Privacy Policy",
}


def inline(text: str) -> str:
    text = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", html.escape(text, quote=False))
    text = re.sub(r"`([^`]+)`", r"<code>\1</code>", text)
    return re.sub(r"<strong>(Not in this version\.?)</strong>", r'<strong class="nyv">\1</strong>', text)


def cells(row: str) -> list[str]:
    return [inline(cell.strip()) for cell in row.strip().strip("|").split("|")]


def table(rows: list[str]) -> str:
    head = "".join(f"<th>{c}</th>" for c in cells(rows[0]))
    body = "".join("<tr>" + "".join(f"<td>{c}</td>" for c in cells(r)) + "</tr>" for r in rows[2:])
    return f'<div class="table-scroll"><table><thead><tr>{head}</tr></thead><tbody>{body}</tbody></table></div>'


def bullets(items: list[str]) -> str:
    out, depth = [], -1
    for item in items:
        level = (len(item) - len(item.lstrip())) // 2
        while depth < level:
            out.append("<ul>")
            depth += 1
        while depth > level:
            out.append("</li></ul>")
            depth -= 1
        if out[-1] != "<ul>":
            out.append("</li>")
        out.append(f"<li>{inline(item.strip()[2:])}")
    out.append("</li></ul>" * (depth + 1))
    return "".join(out)


def to_html(markdown: str) -> str:
    out, block = [], []

    def flush():
        if not block:
            return
        if block[0].startswith("|"):
            out.append(table(block))
        elif block[0].lstrip().startswith("- "):
            out.append(bullets(block))
        else:
            out.append(f"<p>{'<br>'.join(inline(line) for line in block)}</p>")
        block.clear()

    for line in markdown.splitlines():
        heading = re.match(r"(#+) (.*)", line)
        kind = "table" if line.startswith("|") else "list" if line.lstrip().startswith("- ") else "text"
        if heading:
            flush()
            level = len(heading.group(1))
            out.append(f"<h{level}>{inline(heading.group(2))}</h{level}>")
        elif not line.strip():
            flush()
        else:
            if block:
                was = "table" if block[0].startswith("|") else "list" if block[0].lstrip().startswith("- ") else "text"
                if was != kind:
                    flush()
            block.append(line)
    flush()
    return "\n".join(out)


TEMPLATE = (ROOT / "tools" / "page.html").read_text()

if __name__ == "__main__":
    for slug, title in PAGES.items():
        body = to_html((ROOT / "legal" / f"{slug}.md").read_text())
        page = TEMPLATE.replace("{{title}}", title).replace("{{slug}}", slug).replace("{{body}}", body)
        (ROOT / f"{slug}.html").write_text(page)
