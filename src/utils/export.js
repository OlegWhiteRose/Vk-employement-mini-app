import { Document, Packer, Paragraph, TextRun, ImageRun, HeadingLevel, AlignmentType, convertInchesToTwip } from "docx";
import { saveAs } from "file-saver";
import html2pdf from 'html2pdf.js';
import bridge from '@vkontakte/vk-bridge';

const getFormData = (element) => {
    const textareas = element.querySelectorAll('textarea');
    const formData = {};
    
    textareas.forEach(textarea => {
        if (textarea.id) {
            formData[textarea.id] = textarea.value || '';
        }
    });

    const avatarButton = element.querySelector('button[style*="background-image"]');
    let avatarUrl = null;
    if (avatarButton) {
        const style = window.getComputedStyle(avatarButton);
        const backgroundImage = style.backgroundImage;
        if (backgroundImage && backgroundImage !== 'none') {
            avatarUrl = backgroundImage.replace(/^url\(['"](.+)['"]\)$/, '$1');
        }
    }

    return {
        name: formData.name || '',
        lastName: formData.lastName || '',
        phone: formData.phoneNumber || '',
        email: formData.email || '',
        vk: formData.vk || '',
        education: formData.education || '',
        skills: formData.skills || '',
        experience: formData.experience || '',
        preferences: formData.preferences || '',
        avatar: avatarUrl
    };
};

const createHTMLFromData = (data) => {
    const container = document.createElement('div');
    container.style.width = '595px';
    container.style.padding = '40px';
    container.style.backgroundColor = 'white';
    container.style.fontFamily = 'Helvetica, Arial, sans-serif';
    container.style.boxSizing = 'border-box';
    container.style.minHeight = '842px';

    const style = document.createElement('style');
    style.textContent = `
        .page-break {
            break-before: page;
            margin-top: 20px;
        }
        @media print {
            .page-break {
                page-break-before: always;
            }
        }
    `;
    container.appendChild(style);

    const fullName = document.createElement('div');
    fullName.textContent = `${data.name || 'Имя'} ${data.lastName || 'Фамилия'}`;
    fullName.style.fontSize = '28px';
    fullName.style.color = '#666666';
    fullName.style.marginBottom = '20px';
    fullName.style.fontWeight = 'bold';
    container.appendChild(fullName);

    if (data.avatar) {
        const avatarImg = document.createElement('img');
        avatarImg.src = data.avatar;
        avatarImg.style.width = '200px';
        avatarImg.style.height = '200px';
        avatarImg.style.objectFit = 'cover';
        avatarImg.style.marginBottom = '40px';
        avatarImg.style.borderRadius = '4px';
        avatarImg.crossOrigin = 'anonymous';
        container.appendChild(avatarImg);
    }

    const createSectionHeader = (text) => {
        const header = document.createElement('h2');
        header.textContent = text;
        header.style.color = '#2688eb';
        header.style.fontSize = '32px';
        header.style.marginTop = '30px';
        header.style.marginBottom = '20px';
        header.style.fontWeight = 'bold';
        return header;
    };

    const createSectionContent = (content) => {
        const div = document.createElement('div');
        div.style.fontSize = '24px';
        div.style.marginBottom = '20px';
        div.style.lineHeight = '1.5';
        div.style.whiteSpace = 'pre-wrap';
        div.style.wordBreak = 'break-word';
        
        if (!content) {
            div.innerHTML = '<span style="color: #666666">Информация не указана</span>';
        } else {
            div.textContent = content;
        }
        return div;
    };

    container.appendChild(createSectionHeader('Контактные данные'));
    const contactsContent = document.createElement('div');
    contactsContent.style.fontSize = '24px';
    contactsContent.style.marginBottom = '20px';

    const contacts = [
        data.phone && `<span style="font-family: sans-serif; font-size: 24px">☎</span> Телефон: ${data.phone}`,
        data.email && `<span style="font-family: sans-serif; font-size: 24px">✉</span> Email: ${data.email}`,
        data.vk && `<span style="font-family: sans-serif; font-size: 24px">🌐</span> VK: ${data.vk}`
    ].filter(Boolean);

    if (contacts.length > 0) {
        contactsContent.innerHTML = contacts.join('<br>');
    } else {
        contactsContent.innerHTML = '<span style="color: #666666">Контактные данные не указаны</span>';
    }
    container.appendChild(contactsContent);

    const sections = [
        { title: 'Образование', content: data.education },
        { title: 'Навыки', content: data.skills },
        { title: 'Опыт работы', content: data.experience },
        { title: 'Предпочтения', content: data.preferences }
    ];

    const longSections = ['Опыт работы', 'Образование'];
    sections.forEach((section, index) => {
        const sectionContainer = document.createElement('div');
        if (index > 0 && longSections.includes(section.title)) {
            sectionContainer.className = 'page-break';
        }
        sectionContainer.appendChild(createSectionHeader(section.title));
        sectionContainer.appendChild(createSectionContent(section.content));
        container.appendChild(sectionContainer);
    });

    return container;
};

// Функция для определения платформы
const isVKMiniApp = () => {
    return window.location.href.includes('vk_platform=mobile_android') || 
           window.location.href.includes('vk_platform=mobile_iphone');
};

// Функция для скачивания файла через VK Bridge
const downloadWithVKBridge = async (blob, filename, mimeType) => {
    // Создаем новый blob с правильным MIME-типом
    const typedBlob = new Blob([blob], { type: mimeType });
    const tempUrl = URL.createObjectURL(typedBlob);
    
    try {
        const result = await bridge.send('VKWebAppDownloadFile', {
            url: tempUrl,
            filename: filename
        });
        if (!result.result) {
            throw new Error('Failed to download file through VK Bridge');
        }
        
        // Определяем платформу и путь сохранения
        const platform = window.location.href.includes('vk_platform=mobile_android') ? 'Android' : 'iOS';
        const saveLocation = platform === 'Android' 
            ? 'папку "Загрузки"' 
            : 'приложение "Файлы" в папку "Загрузки"';
        
        // Показываем сообщение об успешном сохранении
        alert(`Файл ${filename} успешно сохранен в ${saveLocation} вашего устройства`);
        
    } catch (error) {
        console.error('Error downloading through VK Bridge:', error);
        alert('Произошла ошибка при скачивании файла. Попробуйте позже.');
    } finally {
        setTimeout(() => URL.revokeObjectURL(tempUrl), 10000);
    }
};

export async function exportToPDF(elementId, filename = 'CV.pdf') {
    const mainPanel = document.getElementById('main');
    if (!mainPanel) {
        console.error('Не найдена основная панель');
        return;
    }

    try {
        const formData = getFormData(mainPanel);
        const container = createHTMLFromData(formData);
        
        const style = document.createElement('style');
        style.textContent = `
            @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');
            * {
                font-family: 'Roboto', Arial, sans-serif !important;
                box-sizing: border-box;
                color: #000000;
            }
            .pdf-container {
                background-color: white;
                padding: 40px;
                width: 210mm;
                min-height: 297mm;
            }
            .section {
                page-break-inside: avoid;
                margin-bottom: 20px;
            }
            h1 {
                font-size: 36px;
                margin-bottom: 20px;
                page-break-after: avoid;
            }
            h2 {
                font-size: 32px;
                margin-top: 30px;
                margin-bottom: 20px;
                page-break-after: avoid;
            }
            .name-section {
                color: #666666;
                font-size: 28px;
                font-weight: bold;
                margin-bottom: 20px;
            }
            p {
                font-size: 24px;
                line-height: 1.5;
                margin-bottom: 20px;
                white-space: pre-wrap;
                word-wrap: break-word;
            }
            img {
                page-break-inside: avoid;
            }
        `;
        container.appendChild(style);
        
        const nameElement = container.querySelector('div');
        if (nameElement && nameElement.textContent.includes(formData.name)) {
            nameElement.className = 'name-section';
        }
        
        const sections = container.children;
        Array.from(sections).forEach(section => {
            if (!section.classList.contains('pdf-container') && section.tagName !== 'STYLE') {
                section.classList.add('section');
            }
        });
        
        container.classList.add('pdf-container');
        
        document.body.appendChild(container);
        
        const opt = {
            margin: [15, 15, 15, 15],
            filename: filename,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: {
                scale: 2,
                useCORS: true,
                backgroundColor: '#FFFFFF'
            },
            jsPDF: {
                unit: 'mm',
                format: 'a4',
                orientation: 'portrait',
                putOnlyUsedFonts: true
            },
            pagebreak: {
                mode: 'avoid-all',
                avoid: ['.section', 'img', 'h1', 'h2']
            }
        };
        
        const pdfBlob = await html2pdf().set(opt).from(container).outputPdf('blob');
        
        if (isVKMiniApp()) {
            await downloadWithVKBridge(pdfBlob, filename, 'application/pdf');
        } else {
            const pdfUrl = URL.createObjectURL(new Blob([pdfBlob], { type: 'application/pdf' }));
            const downloadLink = document.createElement('a');
            downloadLink.href = pdfUrl;
            downloadLink.download = filename;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
            setTimeout(() => URL.revokeObjectURL(pdfUrl), 10000);
        }
        
        document.body.removeChild(container);
    } catch (err) {
        console.error('Ошибка генерации PDF:', err);
        alert('Произошла ошибка при создании PDF!');
    }
}

async function createDOCX(userData) {
    let imageBuffer;
    if (userData.avatar) {
        try {
            if (userData.avatar instanceof File) {
                imageBuffer = await new Response(userData.avatar).arrayBuffer();
            } else if (typeof userData.avatar === 'string') {
                const response = await fetch(userData.avatar);
                imageBuffer = await response.arrayBuffer();
            }
        } catch (error) {
            console.error('Ошибка загрузки изображения:', error);
        }
    }

    return new Document({
        styles: {
            default: {
                document: {
                    run: {
                        font: "Helvetica",
                        size: 24
                    }
                }
            }
        },
        sections: [{
            properties: {
                page: {
                    margin: {
                        top: convertInchesToTwip(1),
                        right: convertInchesToTwip(1),
                        bottom: convertInchesToTwip(1),
                        left: convertInchesToTwip(1),
                    },
                },
            },
            children: [
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                        new TextRun({
                            text: "Резюме",
                            bold: true,
                            size: 36,
                            color: "000000"
                        })
                    ],
                    spacing: { after: 400, before: 400 }
                }),

                new Paragraph({
                    alignment: AlignmentType.LEFT,
                    children: [
                        new TextRun({
                            text: (userData.name || "Имя") + " " + (userData.lastName || "Фамилия"),
                            bold: true,
                            size: 28,
                            color: "666666"
                        })
                    ],
                    spacing: { after: 200 }
                }),

                ...(imageBuffer ? [
                    new Paragraph({
                        alignment: AlignmentType.LEFT,
                        children: [
                            new ImageRun({
                                data: imageBuffer,
                                transformation: {
                                    width: 200,
                                    height: 200,
                                }
                            })
                        ],
                        spacing: { after: 400 }
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
}

function createSectionHeader(text) {
    return new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [
            new TextRun({
                text: text,
                bold: true,
                size: 32,
                color: "2688EB"
            })
        ],
        spacing: { before: 400, after: 200 },
    });
}

function createContentParagraph(text) {
    if (!text) {
        return new Paragraph({
            children: [
                new TextRun({
                    text: "Информация не указана",
                    size: 24,
                    color: "666666"
                })
            ],
            spacing: { line: 360, after: 200 },
        });
    }

    const lines = text.split('\n');

    return new Paragraph({
        children: lines.flatMap((line, index) => [
            new TextRun({
                text: line,
                size: 24
            }),
            ...(index < lines.length - 1 ? [new TextRun({ text: "", break: 1 })] : [])
        ]),
        spacing: { line: 360, after: 200 },
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
        : [new Paragraph({
            children: [
                new TextRun({
                    text: "Контактные данные не указаны",
                    size: 24,
                    color: "666666"
                })
            ],
            spacing: { after: 200 }
        })];
}

function createContactParagraph(icon, label, value) {
    return new Paragraph({
        children: [
            new TextRun({
                text: `${icon} ${label}: `,
                size: 24,
                bold: true
            }),
            new TextRun({
                text: value,
                size: 24
            })
        ],
        spacing: { after: 200 }
    });
}

export async function exportToDOCX(userData) {
    try {
        const doc = await createDOCX(userData);
        const blob = await Packer.toBlob(doc);
        const filename = `${userData.name || "Резюме"}.docx`;

        if (isVKMiniApp()) {
            await downloadWithVKBridge(
                blob, 
                filename, 
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            );
        } else {
            saveAs(new Blob([blob], { 
                type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
            }), filename);
        }
    } catch (error) {
        console.error("Ошибка генерации DOCX:", error);
        alert("Произошла ошибка при создании документа!");
    }
}

