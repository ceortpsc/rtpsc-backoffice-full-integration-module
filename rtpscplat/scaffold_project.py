#!/usr/bin/env python3
"""
ROSS TAX PRO ENTERPRISE - PROJECT SCAFFOLDING & EXPORT ENGINE
Generates a fuller multi-module ERO workspace package and exports a deployment ZIP archive.
System Context: XHTML 1.0 Strict + OAuth 2.0 state-gated architecture with IRS e-file, return editing, bank products, envelopes, signatures, and MEF queues.
"""

from pathlib import Path
import json
import zipfile


def write_text_file(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content.strip() + "\n", encoding="utf-8")


def create_workspace() -> None:
    project_root = Path("ross_tax_pro_workspace")
    print(f"[*] Initializing project build matrix for: {project_root}")

    directories = [
        project_root,
        project_root / "public",
        project_root / "assets",
        project_root / "docs" / "playbooks",
        project_root / "docs" / "runbooks",
        project_root / "sql",
    ]

    for directory in directories:
        directory.mkdir(parents=True, exist_ok=True)
        print(f" [+] Ready Directory: {directory}")

    config_payload = {
        "OAuthConfig": {
            "AuthorizeEndpoint": "https://auth.rosstaxpro-cloud.com/oauth2/v2/authorize",
            "TokenEndpoint": "https://auth.rosstaxpro-cloud.com/oauth2/v2/token",
            "ClientId": "ero_client_prod_7719a8bc4",
            "Scope": "openid profile workflow.mef statutory.7216",
            "RedirectUri": "https://workspace.rosstaxpro.com/console.xhtml",
        },
        "OfficeMetadata": {
            "FirmIdentity": "ROSS TAX PRO SOFTWARE CO.",
            "EFIN": "748335",
            "PTIN": "P001482948",
            "EnvironmentCluster": "PROD-TX-CORE-04",
        },
        "WorkflowModules": [
            "ReturnEditor",
            "EfileCenter",
            "BankProducts",
            "EnvelopeCreator",
            "SignaturePad",
            "MefCenter",
        ],
    }

    write_text_file(project_root / "assets" / "metadata.json", json.dumps(config_payload, indent=4))
    print(" [+] Generated Module: assets/metadata.json")

    readme_content = """# ROSS TAX PRO ERO WORKSPACE SYSTEM

## Compliance & Architectural Profile
- **Document Architecture**: Strict XHTML 1.0 Validation Engine.
- **Authentication Directives**: OAuth 2.0 Authorization Code Flow state handler simulation.
- **Security & Regulatory Frameworks**: Mapped against IRS IRC Section 7216 and NIST SP 800-53 controls.

## Included Enterprise Modules
- OAuth 2.0 secure gateway entry page
- Production dashboard console
- Return editor with bank-product and envelope shortcuts
- IRS and ERO-facing e-file center
- Bank product design console
- Envelope creator with stamped time and location preview
- Digital signature pad with audit metadata
- MEF transmission center and queue workspace

## Deployment Context
1. Execute `python3 scaffold_project.py` from the workspace root.
2. Serve the `public/` directory through a local HTTPS-capable server or deployment endpoint.
3. Review the SQL schema files under `sql/` before enabling production transmission workflows.
"""
    write_text_file(project_root / "README.md", readme_content)
    print(" [+] Generated Module: README.md")

    index_content = """<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta http-equiv="Pragma" content="no-cache" />
    <meta http-equiv="Expires" content="-1" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="security-policy" content="NIST-SP-800-53-Rev-5" />
    <meta name="compliance-governance" content="IRC-Section-7216" />
    <title>ROSS TAX PRO ENTERPRISE - OAuth 2.0 Secure Gateway</title>
    <link rel="stylesheet" type="text/css" href="../assets/theme.css" />
</head>
<body>
<div class="app-shell">
    <header class="topbar">
        <div><h1>ROSS TAX PRO SECURITY HUB</h1><p>OAuth 2.0 authorization endpoint gateway</p></div>
    </header>
    <main class="page-content">
        <section class="hero-card">
            <div><span class="eyebrow">AUTHENTICATION</span><h2>Enter the production operator credentials to unlock the ERO console.</h2></div>
        </section>
        <section class="content-grid">
            <article class="card">
                <h3>Secure Sign-In</h3>
                <form class="form-grid">
                    <label>Client Id<input type="text" value="ero_client_prod_7719a8bc4" /></label>
                    <label>Client Secret<input type="password" value="secureoperator" /></label>
                    <a class="btn primary" href="dashboard.xhtml">Authorize Session</a>
                </form>
            </article>
            <article class="card">
                <h3>Route Launchpad</h3>
                <ul class="stack">
                    <li><a href="dashboard.xhtml">Production Dashboard</a></li>
                    <li><a href="return-editor.xhtml">Return Editor</a></li>
                    <li><a href="efile-center.xhtml">E-File Center</a></li>
                    <li><a href="mef-center.xhtml">MEF Center</a></li>
                </ul>
            </article>
        </section>
    </main>
</div>
</body>
</html>
"""
    write_text_file(project_root / "public" / "index.xhtml", index_content)
    print(" [+] Generated Module: public/index.xhtml")

    dashboard_content = """<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>ROSS TAX PRO ERO WORKSPACE - Enterprise Production Console</title>
    <link rel="stylesheet" type="text/css" href="../assets/theme.css" />
</head>
<body>
<div class="app-shell">
    <header class="topbar">
        <div><h1>ROSS TAX PRO ERO WORKSPACE</h1><p>Enterprise dashboard console for IRS e-file, return review, and secure document operations.</p></div>
        <nav class="nav-links">
            <a data-route="dashboard.xhtml" href="dashboard.xhtml" class="active">Dashboard</a>
            <a data-route="return-editor.xhtml" href="return-editor.xhtml">Return Editor</a>
            <a data-route="efile-center.xhtml" href="efile-center.xhtml">E-File Center</a>
            <a data-route="bank-product.xhtml" href="bank-product.xhtml">Bank Products</a>
            <a data-route="envelope-creator.xhtml" href="envelope-creator.xhtml">Envelope Creator</a>
            <a data-route="signature-pad.xhtml" href="signature-pad.xhtml">Signature Pad</a>
            <a data-route="mef-center.xhtml" href="mef-center.xhtml">MEF Center</a>
            <a data-route="index.xhtml" href="index.xhtml">Security Gateway</a>
        </nav>
    </header>
    <main class="page-content">
        <section class="hero-card"><div><span class="eyebrow">PRODUCTION STATUS</span><h2>ERS/ERO operations are routed through a compliant, IRS-ready control plane.</h2></div><div class="pill-row"><span class="pill good">MEF Up</span><span class="pill good">Bank Products Online</span><span class="pill good">Signature Pad Active</span></div></section>
        <section class="metrics-grid">
            <article class="card"><h3>Returns Ready</h3><p class="metric">1,842</p></article>
            <article class="card"><h3>Accepted e-Files</h3><p class="metric">1,496</p></article>
            <article class="card"><h3>Pending Queue</h3><p class="metric">118</p></article>
            <article class="card"><h3>Envelope Drafts</h3><p class="metric">36</p></article>
        </section>
        <section class="content-grid">
            <article class="card"><h3>Transmission Watch</h3><table class="table"><tr><th>Client</th><th>Form</th><th>Status</th></tr><tr><td>Jonathan Sterling</td><td>1040</td><td><span class="pill good">Accepted</span></td></tr><tr><td>Apex Logistics</td><td>1120</td><td><span class="pill warning">Queued</span></td></tr></table></article>
            <article class="card"><h3>Workflow Launchers</h3><ul class="stack"><li><a href="return-editor.xhtml">Open Return Editor</a></li><li><a href="efile-center.xhtml">Launch ERO E-File Center</a></li><li><a href="mef-center.xhtml">Open MEF Transmission Center</a></li></ul></article>
        </section>
    </main>
</div>
<script src="../assets/router.js" type="text/javascript"></script>
</body>
</html>
"""
    write_text_file(project_root / "public" / "dashboard.xhtml", dashboard_content)
    print(" [+] Generated Module: public/dashboard.xhtml")

    return_editor_content = """<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head><meta http-equiv="Content-Type" content="text/html; charset=utf-8" /><title>ROSS TAX PRO - Return Editor</title><link rel="stylesheet" type="text/css" href="../assets/theme.css" /></head>
<body>
<div class="app-shell">
    <header class="topbar"><div><h1>Return Editor</h1><p>Draft, review, and route returns with bank-product and envelope support.</p></div><nav class="nav-links"><a data-route="dashboard.xhtml" href="dashboard.xhtml">Dashboard</a><a data-route="return-editor.xhtml" href="return-editor.xhtml" class="active">Return Editor</a><a data-route="efile-center.xhtml" href="efile-center.xhtml">E-File Center</a><a data-route="bank-product.xhtml" href="bank-product.xhtml">Bank Products</a><a data-route="envelope-creator.xhtml" href="envelope-creator.xhtml">Envelope Creator</a><a data-route="signature-pad.xhtml" href="signature-pad.xhtml">Signature Pad</a><a data-route="mef-center.xhtml" href="mef-center.xhtml">MEF Center</a></nav></header>
    <main class="page-content">
        <section class="content-grid">
            <article class="card"><h3>Return Intake</h3><form class="form-grid"><label>Taxpayer Name<input type="text" value="Jonathan Vance Sterling" /></label><label>Tax Year<input type="text" value="2026" /></label><label>Form Type<input type="text" value="1040" /></label><label>Return Status<select><option>Draft</option><option>Ready</option><option>Filed</option></select></label></form></article>
            <article class="card"><h3>Return Preview</h3><p>Federal adjusted gross income: $84,125.00</p><p>Refund transfer selected: Yes</p><p>Document bundle: 1040 + W-2 + State summary</p><div class="pill-row"><span class="pill good">Compliance Check Passed</span><span class="pill warning">Signature pending</span></div></article>
        </section>
    </main>
</div>
<script src="../assets/router.js" type="text/javascript"></script>
</body>
</html>
"""
    write_text_file(project_root / "public" / "return-editor.xhtml", return_editor_content)
    print(" [+] Generated Module: public/return-editor.xhtml")

    efile_center_content = """<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head><meta http-equiv="Content-Type" content="text/html; charset=utf-8" /><title>ROSS TAX PRO - IRS E-File Center</title><link rel="stylesheet" type="text/css" href="../assets/theme.css" /></head>
<body>
<div class="app-shell">
    <header class="topbar"><div><h1>IRS E-File Center</h1><p>ERO-facing workflow for routing returns into IRS MeF and compliance controls.</p></div><nav class="nav-links"><a data-route="dashboard.xhtml" href="dashboard.xhtml">Dashboard</a><a data-route="return-editor.xhtml" href="return-editor.xhtml">Return Editor</a><a data-route="efile-center.xhtml" href="efile-center.xhtml" class="active">E-File Center</a><a data-route="bank-product.xhtml" href="bank-product.xhtml">Bank Products</a><a data-route="envelope-creator.xhtml" href="envelope-creator.xhtml">Envelope Creator</a><a data-route="signature-pad.xhtml" href="signature-pad.xhtml">Signature Pad</a><a data-route="mef-center.xhtml" href="mef-center.xhtml">MEF Center</a></nav></header>
    <main class="page-content"><section class="content-grid"><article class="card"><h3>ERO / IRS Operations</h3><ul class="stack"><li>Transmit return package to IRS MeF</li><li>Monitor acknowledgements and reject codes</li><li>Route rejections back into return editing</li></ul></article><article class="card"><h3>Queue Snapshot</h3><table class="table"><tr><th>Sequence</th><th>Taxpayer</th><th>State</th></tr><tr><td>RTP-001</td><td>Jonathan Sterling</td><td><span class="pill good">Accepted</span></td></tr><tr><td>RTP-002</td><td>Apex Logistics</td><td><span class="pill warning">Pending</span></td></tr></table></article></section></main>
</div>
<script src="../assets/router.js" type="text/javascript"></script>
</body>
</html>
"""
    write_text_file(project_root / "public" / "efile-center.xhtml", efile_center_content)
    print(" [+] Generated Module: public/efile-center.xhtml")

    bank_product_content = """<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head><meta http-equiv="Content-Type" content="text/html; charset=utf-8" /><title>ROSS TAX PRO - Bank Products</title><link rel="stylesheet" type="text/css" href="../assets/theme.css" /></head>
<body>
<div class="app-shell"><header class="topbar"><div><h1>Bank Products Console</h1><p>Refund transfer and bank product design configuration.</p></div><nav class="nav-links"><a data-route="dashboard.xhtml" href="dashboard.xhtml">Dashboard</a><a data-route="return-editor.xhtml" href="return-editor.xhtml">Return Editor</a><a data-route="efile-center.xhtml" href="efile-center.xhtml">E-File Center</a><a data-route="bank-product.xhtml" href="bank-product.xhtml" class="active">Bank Products</a><a data-route="envelope-creator.xhtml" href="envelope-creator.xhtml">Envelope Creator</a><a data-route="signature-pad.xhtml" href="signature-pad.xhtml">Signature Pad</a><a data-route="mef-center.xhtml" href="mef-center.xhtml">MEF Center</a></nav></header>
    <main class="page-content"><section class="content-grid"><article class="card"><h3>Bank Product Suite</h3><ul class="stack"><li>Refund Transfer</li><li>Advance Product</li><li>Fee Payment Plan</li></ul></article><article class="card"><h3>Product Offer Preview</h3><p>Offer: Refund transfer with same-day deposit</p><p>Fees: $39.95</p><p>Delivery: Electronic authorization packet</p></article></section></main>
</div>
<script src="../assets/router.js" type="text/javascript"></script>
</body>
</html>
"""
    write_text_file(project_root / "public" / "bank-product.xhtml", bank_product_content)
    print(" [+] Generated Module: public/bank-product.xhtml")

    envelope_creator_content = """<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head><meta http-equiv="Content-Type" content="text/html; charset=utf-8" /><title>ROSS TAX PRO - Envelope Creator</title><link rel="stylesheet" type="text/css" href="../assets/theme.css" /></head>
<body>
<div class="app-shell"><header class="topbar"><div><h1>Envelope Creator</h1><p>Create tax document envelopes with stamped time and location preview.</p></div><nav class="nav-links"><a data-route="dashboard.xhtml" href="dashboard.xhtml">Dashboard</a><a data-route="return-editor.xhtml" href="return-editor.xhtml">Return Editor</a><a data-route="efile-center.xhtml" href="efile-center.xhtml">E-File Center</a><a data-route="bank-product.xhtml" href="bank-product.xhtml">Bank Products</a><a data-route="envelope-creator.xhtml" href="envelope-creator.xhtml" class="active">Envelope Creator</a><a data-route="signature-pad.xhtml" href="signature-pad.xhtml">Signature Pad</a><a data-route="mef-center.xhtml" href="mef-center.xhtml">MEF Center</a></nav></header>
    <main class="page-content"><section class="content-grid"><article class="card"><h3>Envelope Parameters</h3><form class="form-grid"><label>Recipient<input type="text" value="IRS MeF" /></label><label>Document Type<input type="text" value="1040 / State / W-2" /></label><label>Timestamp<input type="text" value="2026-06-30 14:22:11" /></label><label>Location<input type="text" value="Dallas, TX" /></label></form></article><article class="card"><h3>Stamped Preview</h3><div class="stamp-preview"><p>Envelope ID: ENV-2026-0142</p><p>Created At: 2026-06-30 14:22:11</p><p>Location: Dallas, TX</p><p>Channel: MeF Transmission</p></div></article></section></main>
</div>
<script src="../assets/router.js" type="text/javascript"></script>
</body>
</html>
"""
    write_text_file(project_root / "public" / "envelope-creator.xhtml", envelope_creator_content)
    print(" [+] Generated Module: public/envelope-creator.xhtml")

    signature_pad_content = """<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head><meta http-equiv="Content-Type" content="text/html; charset=utf-8" /><title>ROSS TAX PRO - Signature Pad</title><link rel="stylesheet" type="text/css" href="../assets/theme.css" /></head>
<body>
<div class="app-shell"><header class="topbar"><div><h1>Digital Signature Pad</h1><p>Collect a compliant electronic signature with audit-ready capture.</p></div><nav class="nav-links"><a data-route="dashboard.xhtml" href="dashboard.xhtml">Dashboard</a><a data-route="return-editor.xhtml" href="return-editor.xhtml">Return Editor</a><a data-route="efile-center.xhtml" href="efile-center.xhtml">E-File Center</a><a data-route="bank-product.xhtml" href="bank-product.xhtml">Bank Products</a><a data-route="envelope-creator.xhtml" href="envelope-creator.xhtml">Envelope Creator</a><a data-route="signature-pad.xhtml" href="signature-pad.xhtml" class="active">Signature Pad</a><a data-route="mef-center.xhtml" href="mef-center.xhtml">MEF Center</a></nav></header>
    <main class="page-content"><section class="content-grid"><article class="card"><h3>Signature Capture</h3><canvas id="signatureCanvas" class="signature-canvas" width="520" height="220"></canvas><div class="pill-row"><button type="button" class="btn" onclick="clearSignature()">Clear</button><button type="button" class="btn primary">Save Signature</button></div></article><article class="card"><h3>Capture Metadata</h3><p>Signer: Jonathan Vance Sterling</p><p>Timestamp: 2026-06-30 14:23:10</p><p>Location: Dallas, TX</p></article></section></main>
</div>
<script src="../assets/router.js" type="text/javascript"></script>
<script type="text/javascript">var canvas = document.getElementById('signatureCanvas'); var ctx = canvas.getContext('2d'); var drawing = false; canvas.addEventListener('mousedown', function() { drawing = true; ctx.beginPath(); }); canvas.addEventListener('mousemove', function(event) { if (!drawing) return; var rect = canvas.getBoundingClientRect(); ctx.lineTo(event.clientX - rect.left, event.clientY - rect.top); ctx.stroke(); }); canvas.addEventListener('mouseup', function() { drawing = false; }); function clearSignature() { ctx.clearRect(0, 0, canvas.width, canvas.height); }</script>
</body>
</html>
"""
    write_text_file(project_root / "public" / "signature-pad.xhtml", signature_pad_content)
    print(" [+] Generated Module: public/signature-pad.xhtml")

    mef_center_content = """<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head><meta http-equiv="Content-Type" content="text/html; charset=utf-8" /><title>ROSS TAX PRO - MEF Center</title><link rel="stylesheet" type="text/css" href="../assets/theme.css" /></head>
<body>
<div class="app-shell"><header class="topbar"><div><h1>MEF Transmission Center</h1><p>Transform returns into transmission XML, route queue states, and monitor channel health.</p></div><nav class="nav-links"><a data-route="dashboard.xhtml" href="dashboard.xhtml">Dashboard</a><a data-route="return-editor.xhtml" href="return-editor.xhtml">Return Editor</a><a data-route="efile-center.xhtml" href="efile-center.xhtml">E-File Center</a><a data-route="bank-product.xhtml" href="bank-product.xhtml">Bank Products</a><a data-route="envelope-creator.xhtml" href="envelope-creator.xhtml">Envelope Creator</a><a data-route="signature-pad.xhtml" href="signature-pad.xhtml">Signature Pad</a><a data-route="mef-center.xhtml" href="mef-center.xhtml" class="active">MEF Center</a></nav></header>
    <main class="page-content"><section class="content-grid"><article class="card"><h3>XML Conversion</h3><p>Transmission payload: 1040 + state + supporting docs</p><p>Schema validation: Passed</p><p>Submission channel: MeF</p></article><article class="card"><h3>Queue &amp; Center</h3><table class="table"><tr><th>Queue</th><th>Count</th><th>Status</th></tr><tr><td>Ready</td><td>42</td><td><span class="pill good">Healthy</span></td></tr><tr><td>Rejections</td><td>7</td><td><span class="pill warning">Review</span></td></tr></table></article></section></main>
</div>
<script src="../assets/router.js" type="text/javascript"></script>
</body>
</html>
"""
    write_text_file(project_root / "public" / "mef-center.xhtml", mef_center_content)
    print(" [+] Generated Module: public/mef-center.xhtml")

    theme_css = """body { margin: 0; font-family: Arial, sans-serif; background: linear-gradient(135deg, #07111f 0%, #16253d 100%); color: #e2e8f0; }
a { color: #7dd3fc; text-decoration: none; }
.app-shell { min-height: 100vh; }
.topbar { display: flex; justify-content: space-between; align-items: center; padding: 20px 28px; background: rgba(2, 6, 23, 0.92); border-bottom: 1px solid #243447; }
.topbar h1 { margin: 0 0 4px; font-size: 24px; }
.topbar p { margin: 0; color: #94a3b8; }
.nav-links { display: flex; flex-wrap: wrap; gap: 8px; }
.nav-links a { padding: 8px 10px; border-radius: 999px; border: 1px solid #243447; background: #111827; }
.nav-links a.active, .nav-links a:hover { background: #0f766e; color: white; }
.page-content { padding: 24px 28px 36px; }
.hero-card, .card { background: rgba(15, 23, 42, 0.9); border: 1px solid #243447; border-radius: 16px; padding: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); }
.hero-card { display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; }
.metrics-grid, .content-grid { display: grid; gap: 16px; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); margin-top: 18px; }
.metric { font-size: 32px; font-weight: 700; color: #f8fafc; }
.table { width: 100%; border-collapse: collapse; }
.table th, .table td { padding: 10px 8px; border-bottom: 1px solid #243447; text-align: left; }
.pill-row { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 10px; }
.pill { display: inline-block; padding: 6px 10px; border-radius: 999px; font-size: 12px; font-weight: 700; }
.pill.good { background: #064e3b; color: #6ee7b7; }
.pill.warning { background: #78350f; color: #fde68a; }
.form-grid { display: grid; gap: 10px; }
.form-grid label { display: flex; flex-direction: column; gap: 4px; color: #cbd5e1; }
.form-grid input, .form-grid select { background: #020617; color: white; border: 1px solid #243447; border-radius: 8px; padding: 8px 10px; }
.stack { margin: 0; padding-left: 18px; color: #cbd5e1; }
.btn { padding: 8px 12px; border-radius: 999px; border: 1px solid #243447; background: #020617; color: white; cursor: pointer; }
.btn.primary { background: #0f766e; }
.signature-canvas { border: 1px solid #243447; border-radius: 12px; background: white; width: 100%; max-width: 520px; display: block; }
.stamp-preview { border: 1px dashed #38bdf8; border-radius: 12px; padding: 16px; background: rgba(56, 189, 248, 0.08); color: #e2e8f0; }
"""
    write_text_file(project_root / "assets" / "theme.css", theme_css)
    print(" [+] Generated Module: assets/theme.css")

    router_js = """document.addEventListener('DOMContentLoaded', function () {
    var current = window.location.pathname.split('/').pop() || 'index.xhtml';
    var links = document.querySelectorAll('[data-route]');
    for (var i = 0; i < links.length; i++) {
        if (links[i].getAttribute('data-route') === current) {
            links[i].classList.add('active');
        }
    }
});
"""
    write_text_file(project_root / "assets" / "router.js", router_js)
    print(" [+] Generated Module: assets/router.js")

    playbook_content = """# Enterprise Deployment Playbook

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
"""
    write_text_file(project_root / "docs" / "playbooks" / "deployment-playbook.md", playbook_content)
    print(" [+] Generated Module: docs/playbooks/deployment-playbook.md")

    runbook_content = """# Operations Runbook

## Daily Execution Checklist
- Verify the gateway login page loads from `public/index.xhtml`.
- Confirm the dashboard and e-file modules are reachable.
- Review MEF queue status and any rejection backlog.
- Validate that envelope and signature metadata include timestamp and location fields.

## Incident Response
1. Re-run the scaffolding generator if the public package is missing files.
2. Inspect `metadata.json` for environment parameters.
3. Reconcile queue and acknowledgement logs before re-transmitting.
"""
    write_text_file(project_root / "docs" / "runbooks" / "operations-runbook.md", runbook_content)
    print(" [+] Generated Module: docs/runbooks/operations-runbook.md")

    schema_core = """-- Core client and return management
CREATE TABLE IF NOT EXISTS clients (
    id UUID PRIMARY KEY,
    office_id UUID NOT NULL,
    client_id_number VARCHAR(32) NOT NULL UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    dob DATE NOT NULL,
    ssn VARCHAR(11) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(32),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS client_returns (
    id UUID PRIMARY KEY,
    client_id UUID NOT NULL REFERENCES clients(id),
    tax_year INTEGER NOT NULL,
    program_used VARCHAR(64) NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'DRAFT',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
"""
    write_text_file(project_root / "sql" / "001_core_schema.sql", schema_core)
    print(" [+] Generated Module: sql/001_core_schema.sql")

    schema_efile = """-- IRS e-file and transmission controls
CREATE TABLE IF NOT EXISTS transmissions (
    id UUID PRIMARY KEY,
    client_return_id UUID NOT NULL REFERENCES client_returns(id),
    office_id UUID NOT NULL,
    channel VARCHAR(32) NOT NULL DEFAULT 'MEF',
    status VARCHAR(32) NOT NULL DEFAULT 'PENDING',
    irs_submission_id VARCHAR(64),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reject_codes (
    code VARCHAR(32) PRIMARY KEY,
    description TEXT NOT NULL,
    severity VARCHAR(16) NOT NULL DEFAULT 'ERROR'
);
"""
    write_text_file(project_root / "sql" / "002_efile_schema.sql", schema_efile)
    print(" [+] Generated Module: sql/002_efile_schema.sql")

    schema_banking = """-- Bank product, envelope, and signature-bearing artifacts
CREATE TABLE IF NOT EXISTS bank_products (
    id UUID PRIMARY KEY,
    product_code VARCHAR(64) NOT NULL UNIQUE,
    product_name VARCHAR(255) NOT NULL,
    product_fee NUMERIC(10,2) NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS envelopes (
    id UUID PRIMARY KEY,
    client_return_id UUID NOT NULL REFERENCES client_returns(id),
    envelope_id VARCHAR(64) NOT NULL UNIQUE,
    timestamp_utc TIMESTAMPTZ NOT NULL,
    location_text VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
"""
    write_text_file(project_root / "sql" / "003_bank_and_envelope_schema.sql", schema_banking)
    print(" [+] Generated Module: sql/003_bank_and_envelope_schema.sql")

    schema_signatures = """-- Digital signature capture and audit trail
CREATE TABLE IF NOT EXISTS signature_events (
    id UUID PRIMARY KEY,
    client_return_id UUID NOT NULL REFERENCES client_returns(id),
    signer_name VARCHAR(255) NOT NULL,
    signature_hash VARCHAR(128) NOT NULL,
    captured_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    location_text VARCHAR(255)
);
"""
    write_text_file(project_root / "sql" / "004_signature_schema.sql", schema_signatures)
    print(" [+] Generated Module: sql/004_signature_schema.sql")

    zip_filename = "ross_tax_pro_project.zip"
    print(f"[*] Packaging workspace directories into archive file: {zip_filename}")

    with zipfile.ZipFile(zip_filename, "w", zipfile.ZIP_DEFLATED) as archive:
        for file_path in sorted(project_root.rglob("*")):
            if file_path.is_file():
                archive_name = file_path.relative_to(project_root.parent).as_posix()
                archive.write(file_path, archive_name)
                print(f"  [+] Compressed: {archive_name}")

    print(f"\n[!] BUILD SUCCESSFUL: Enterprise package file '{zip_filename}' generated smoothly.")


if __name__ == "__main__":
    create_workspace()
