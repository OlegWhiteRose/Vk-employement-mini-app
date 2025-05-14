import html2pdf from 'html2pdf.js';

export function exportToPDF(elementId, filename = 'CV.pdf') {
    const element = document.getElementById(elementId);
    if (!element) return;

    const clonedElement = element.cloneNode(true);
    const exportButton = clonedElement.querySelector('#export');
    if (exportButton) exportButton.remove();

    clonedElement.querySelectorAll('textarea').forEach(textarea => {
        const div = document.createElement('div');
        div.style.whiteSpace = 'pre-wrap';
        div.style.lineHeight = '1.5';
        div.style.width = textarea.offsetWidth + 'px';
        div.style.minHeight = textarea.offsetHeight + 'px';
        
        const content = textarea.value
        .replace(/\n/g, '<br>') 
        .replace(/\s/g, '&nbsp;');
        
        div.innerHTML = content; 
        
        div.className = textarea.className;
        div.style.cssText = textarea.style.cssText;
        
        textarea.parentNode.replaceChild(div, textarea);
    });

    const tempStyles = document.createElement('style');
    tempStyles.innerHTML = `
        .vkuiTextarea, .avatar-button {
        border: none !important;
        padding: 0 !important;
        resize: none !important;
        }
        .avatar-button {
        border-radius: 50% !important;
        overflow: hidden !important;
        }
        div {
        white-space: pre-wrap !important;
        }
    `;
    clonedElement.appendChild(tempStyles);

    const options = {
        margin: [10, 10],
        filename,
        image: { 
        type: 'jpeg', 
        quality: 0.98 
        },
        html2canvas: { 
        scale: 2,
        useCORS: true,
        logging: true,
        ignoreElements: (el) => el.id === 'export',
        allowTaint: true,
        letterRendering: true
        },
        jsPDF: { 
        unit: 'mm', 
        format: 'a4', 
        orientation: 'portrait',
        compressPDF: true
        }
    };

    html2pdf()
        .set(options)
        .from(clonedElement)
        .save()
        .catch(err => {
        console.error('Ошибка генерации PDF:', err);
        alert('Произошла ошибка при создании PDF!');
        });
}

import { Document, Packer, Paragraph, TextRun, ImageRun, HeadingLevel } from "docx";
import { saveAs } from "file-saver";

export async function exportToDOCX(userData) {
    try {
        let imageBuffer;
        if (userData.avatar instanceof File) {
        imageBuffer = await new Response(userData.avatar).arrayBuffer();
        }

        const doc = new Document({
        sections: [{
            properties: {},
            children: [
            new Paragraph({
                children: [
                new TextRun({
                    text: userData.name || "Имя",
                    bold: true,
                    size: 32
                }),
                new TextRun({
                    text: "\n" + (userData.lastName || "Фамилия"),
                    bold: true,
                    size: 32
                })
                ],
                spacing: { after: 400 }
            }),

            ...(imageBuffer ? [
                new Paragraph({
                    children: [
                    new ImageRun({
                        data: imageBuffer,
                        transformation: {
                        width: 150,
                        height: 150,
                        }
                    })
                    ],
                    spacing: { after: 200 }
                })
                ] : []),

            createSectionHeader("Контактные данные"),
            ...createContactItems(userData),

            createSectionHeader("Образование"),
            createContentParagraph(userData.education),

            createSectionHeader("Навыки"),
            createContentParagraph(userData.skills),

            createSectionHeader("Опыт работы"),
            createContentParagraph(userData.experience),

            createSectionHeader("Предпочтения"),
            createContentParagraph(userData.preferences),
            ],
        }],
        });

        const blob = await Packer.toBlob(doc);
        saveAs(blob, `${userData.name || "Резюме"}.docx`);

    } catch (error) {
        console.error("Ошибка генерации DOCX:", error);
        alert("Произошла ошибка при создании документа!");
    }
}


function createSectionHeader(text) {
    return new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun({
        text: text,
        bold: true,
        size: 28,
        color: "2d2d2d"
        })],
        spacing: { before: 600, after: 200 },
    });
}

function createContentParagraph(text) {
    if (!text) {
        return new Paragraph({
        text: "Информация не указана",
        spacing: { line: 300 },
        });
    }

    const lines = text.split('\n');

    return new Paragraph({
        children: lines.flatMap((line, index) => [
        new TextRun(line),
        ...(index < lines.length - 1 ? [new TextRun({ text: "", break: 1 })] : [])
        ]),
        spacing: { line: 300 },
    });
}

function createContactItems(data) {
    const contactParagraphs = [
        data.phone && createContactParagraph("☎", "Телефон", data.phone),
        data.email && createContactParagraph("✉", "Email", data.email),
        data.vk && createContactParagraph("🌐", "VK", data.vk)
    ].filter(Boolean);

    return contactParagraphs.length > 0 
        ? contactParagraphs 
        : [new Paragraph('Контактные данные не указаны')];
}

function createContactParagraph(icon, label, value) {
    return new Paragraph({
        children: [
        new TextRun({
            text: `${icon} ${label}: ${value}`,
            size: 22
        })
        ],
        spacing: { after: 100 }
    });
}


