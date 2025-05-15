const LANGUAGE_TOOL_URL = 'https://api.languagetool.org/v2/check';

export const checkSpelling = async (text) => {
    try {
        const response = await fetch(LANGUAGE_TOOL_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                'text': text,
                'language': 'ru',
                'enabledOnly': 'false'
            })
        });
        
        const data = await response.json();
        return data.matches || [];
    } catch (error) {
        console.error('Ошибка проверки орфографии:', error);
        return [];
    }
};

export const getSpellingErrors = (text, errors) => {
    return errors.map(error => ({
        word: text.substring(error.offset, error.offset + error.length),
        suggestions: error.replacements.map(r => r.value),
        position: error.offset,
        length: error.length,
        message: error.message,
        type: error.rule.category.name
    }));
}; 