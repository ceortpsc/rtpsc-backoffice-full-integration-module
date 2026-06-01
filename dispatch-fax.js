const fs = require('fs');
const path = require('path');
const { PDFDocument, StandardFonts } = require('pdf-lib');

const config = {
    firmName: "DBA 254-TAX CONSULTANTS|ROSS TAX PRO SOFTWARECO",
    rep: "CONDRE D ROSS",
    ptin: "P03215544",
    efin: "748335",
    caf: "031676228R",
    fax: "5124896749",
    address: "2509 Cody Poe Rd Unit B, Killeen, TX 76549"
};

async function createForm8821() {
    console.log(`Binding active runtime strings for: ${config.firmName}...`);
    
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([612, 792]);
    const { height } = page.getSize();
    
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
    
    page.drawText('FORM 8821', { x: 40, y: height - 50, size: 14, font: fontBold });
    page.drawText('TAX INFORMATION AUTHORIZATION', { x: 160, y: height - 50, size: 14, font: fontBold });
    page.drawLine({ start: { x: 40, y: height - 60 }, end: { x: 570, y: height - 60 }, thickness: 2 });
    
    // Part 2 Appointee Data Block
    page.drawText('2. DESIGNEE / REPRESENTATIVE REGISTRATION', { x: 40, y: height - 80, size: 11, font: fontBold });
    let y = height - 100;
    const lines = [
        `Primary Appointee Name: ${config.rep}`,
        `Firm Corporate Identity: ${config.firmName}`,
        `EFIN Key: ${config.efin}   |   PTIN Key: ${config.ptin}   |   CAF Registration: ${config.caf}`,
        `Corporate HQ Address: ${config.address}`,
        `Outbound Digital Gateway Interface: ${config.fax}`
    ];
    lines.forEach(line => {
        page.drawText(line, { x: 50, y: y, size: 10, font: fontRegular });
        y -= 15;
    });

    const pdfBytes = await pdfDoc.save();
    fs.writeFileSync(path.join(__dirname, 'Form_8821_Transmission_Ready.pdf'), pdfBytes);
    console.log('\x1b[32m✔ Form 8821 successfully compiled with split delimiter entity mapping.\x1b[0m');
}

createForm8821().catch(err => console.error(err));
