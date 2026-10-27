# References

Designs studied in detail: technique notes, what to borrow, known defects and full provenance.

## Why some entries have no code

If a design has no clear license, or a license that forbids redistribution, publishing its source would be infringement. Those entries carry `published_source: false` and contain prose only. The original export stays in the local `_private/` folder, which git ignores. The validator rejects code files in such entries.

If you want to use one of these patterns in a project, write an original implementation informed by the notes, and credit the author in the project.

## Adding one

Copy `template/entry.md` into a new folder. Record where you found it, who made it, when you retrieved it and its license. If you cannot establish the license, use `unknown` and `private-reference`.
