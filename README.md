# AVRXT documentation

The standalone Mintlify source for `docs.avrxt.dev`.

```sh
npm ci
npm run check
npm run links
npm run dev
```

The local preview uses port 3003. Brand settings are in `docs.json`, custom styling is in `style.css`, and content is MDX. The Mintlify CLI is pinned for reproducible checks.

The two legacy CMS articles and their original Markdown are preserved in `migration/source-articles.json`. There were two published documents and no drafts at migration time. The original database records and CDN attachments are retained as a rollback source.

## Cutover order

1. Review this local Mintlify preview and the main-site redirect/removal diff.
2. With owner approval, create `aviorxt/avrxt-docs` and push this source.
3. Connect the repository to the existing `avrxtdev` Mintlify project. Preserve its existing draft pages until the owner decides which to retain.
4. Configure `docs.avrxt.dev` with the DNS target Mintlify actually supplies. Verify its TLS, pages, assets, and redirects.
5. Publish the main-site docs removal and redirects only after the custom docs domain works.
6. Run the existing public search reconciliation to remove stale CMS article hits.

Git connection, live publishing, and DNS cutover have not been performed by the local preparation step. No paid plan is assumed.
