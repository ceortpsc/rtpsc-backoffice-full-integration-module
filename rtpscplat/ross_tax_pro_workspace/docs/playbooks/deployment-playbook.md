# Enterprise Deployment Playbook

## 1. Build and Package
1. Run the scaffold generator: `python3 scaffold_project.py`
2. Confirm the archive `ross_tax_pro_project.zip` is created in the workspace root.
3. Unpack or distribute the generated package for deployment.

## 2. Workspace Routing
- Gateway entry: `public/index.xhtml`
- Console: `public/dashboard.xhtml`
- Core modules: `public/return-editor.xhtml`, `public/efile-center.xhtml`, `public/bank-product.xhtml`, `public/envelope-creator.xhtml`, `public/signature-pad.xhtml`, `public/mef-center.xhtml`

## 3. Compliance Notes
- Keep route navigation and document previews consistent with IRS e-file workflow.
- Preserve timestamp and location metadata on envelopes and signatures.
- Run schema migrations before enabling e-file transmission operations.
