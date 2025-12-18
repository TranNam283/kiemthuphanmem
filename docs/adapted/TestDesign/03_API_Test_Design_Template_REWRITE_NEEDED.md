# REWRITE_NEEDED: 03_API_Test_Design_Template

This file is a rewrite outline (not a rewrite) because the corresponding template in docs/ref was detected as COPIED_VERBATIM vs the reference repository.

## Provenance
- Source (reference): D:\Projects\fullstack-vitejs-books\docs\tests\TestDesign\03_API_Test_Design_Template.xlsx
- Local copy (tracked as original): d:\Projects\ktpm\docs\ref\TestDesign\03_API_Test_Design_Template.xlsx
- Similarity evidence: alignedTokenPct=100%, lineOverlapPct=100%

## Rewrite Instructions (must be original)
- Rewrite the content to fit KTPM (e-commerce clothing) domain; avoid copying phrasing/structure verbatim.
- Keep only generic testing concepts; re-derive examples, IDs, and scenarios from KTPM endpoints/features.
- Prefer Vietnamese wording consistent with the rest of this repo.

## Proposed New Structure (suggestion)
- Purpose & scope
- Definitions (role, state, entities: product, cart, order, voucher, address)
- Test data strategy
- Test case format (new column set)
- Example test cases (new IDs + new steps)
- Review checklist

## KTPM Mapping Hints
- Access control: /api/login, JWT middleware, admin/user separation
- Product browsing: /api/get-all-product-user, /api/get-detail-product-by-id
- Cart: /api/add-shopcart, /api/get-shop-cart-by-user-id
- Orders: /api/create-new-order, /api/get-order-by-id

## Next Action
- Replace this outline with a newly-authored document/template and update docs/NOTICE_ADAPTATION.md with what changed.
