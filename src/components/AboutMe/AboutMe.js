import { useState, useEffect } from 'react';
import {
    Header,
    Div,
    FormLayoutGroup,
    Textarea,
    FormItem,
    Tooltip,
    IconButton
} from '@vkontakte/vkui';
import { Icon16Cancel } from '@vkontakte/icons';
import { checkSpelling, getSpellingErrors } from '../../utils/spellcheck';

const AboutMe = ({ onDataChange, initialData }) => {
    const [education, setEducation] = useState(initialData.education || '');
    const [skills, setSkills] = useState(initialData.skills || '');
    const [experience, setExperience] = useState(initialData.experience || '');
    const [preferences, setPreferences] = useState(initialData.preferences || '');
    const [isMobile, setIsMobile] = useState(false);
    const [spellingErrors, setSpellingErrors] = useState({
        education: [],
        skills: [],
        experience: [],
        preferences: []
    });
    const [hiddenErrors, setHiddenErrors] = useState({
        education: new Set(),
        skills: new Set(),
        experience: new Set(),
        preferences: new Set()
    });
    const [activeTooltip, setActiveTooltip] = useState(null);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.matchMedia('(max-width: 600px)').matches);
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const checkFieldSpelling = async (field, value) => {
        if (!value.trim()) {
            setSpellingErrors(prev => ({
                ...prev,
                [field]: []
            }));
            return;
        }

        const currentErrors = spellingErrors[field];
        if (currentErrors.length > 0) {
            const remainingErrors = currentErrors.filter(error => {
                const wordInText = value.substring(error.position, error.position + error.length);
                return wordInText === error.word; 
            });

            if (remainingErrors.length !== currentErrors.length) {
                setSpellingErrors(prev => ({
                    ...prev,
                    [field]: remainingErrors
                }));

                if (remainingErrors.length === 0) return;
            }
        }
        
        try {
            const errors = await checkSpelling(value);
            if (errors.length > 0) {
                const processedErrors = getSpellingErrors(value, errors);
                setSpellingErrors(prev => ({
                    ...prev,
                    [field]: processedErrors
                }));
            } else {
                setSpellingErrors(prev => ({
                    ...prev,
                    [field]: []
                }));
            }
        } catch (error) {
            console.error('Ошибка при проверке орфографии:', error);
        }
    };

    const timeDelay = 500;

    useEffect(() => {
        const timer = setTimeout(() => checkFieldSpelling('education', education), timeDelay);
        return () => clearTimeout(timer);
    }, [education]);

    useEffect(() => {
        const timer = setTimeout(() => checkFieldSpelling('skills', skills), timeDelay);
        return () => clearTimeout(timer);
    }, [skills]);

    useEffect(() => {
        const timer = setTimeout(() => checkFieldSpelling('experience', experience), timeDelay);
        return () => clearTimeout(timer);
    }, [experience]);

    useEffect(() => {
        const timer = setTimeout(() => checkFieldSpelling('preferences', preferences), timeDelay);
        return () => clearTimeout(timer);
    }, [preferences]);

    const handleChange = (field, value) => {
        const newData = { [field]: value };
        onDataChange(newData);
        
        switch(field) {
            case 'education': setEducation(value); break;
            case 'skills': setSkills(value); break;
            case 'experience': setExperience(value); break;
            case 'preferences': setPreferences(value); break;
            default: break;
        }
    };

    const handleHideError = (field, errorIndex) => {
        setHiddenErrors(prev => {
            const newHidden = new Set(prev[field]);
            newHidden.add(errorIndex);
            return {
                ...prev,
                [field]: newHidden
            };
        });
    };

    const textareaStyle = {
        fontSize: isMobile ? '14px' : '16px',
        padding: '12px',
        width: '100%',
        boxSizing: 'border-box',
        minHeight: '120px',
        lineHeight: '1.5',
        position: 'relative'
    };

    const renderSpellingSuggestions = (field) => {
        if (!spellingErrors[field] || spellingErrors[field].length === 0) return null;

        return (
            <div style={{ 
                marginTop: '8px', 
                fontSize: '14px'
            }}>
                {spellingErrors[field].map((error, index) => {
                    if (hiddenErrors[field].has(index)) return null;
                    
                    return (
                        <div key={index} style={{ 
                            marginTop: '8px',
                            padding: '8px',
                            backgroundColor: '#FFF5F5',
                            borderRadius: '8px',
                            border: '1px solid #FFE1E1',
                            position: 'relative'
                        }}>
                            <IconButton
                                style={{
                                    position: 'absolute',
                                    top: '4px',
                                    right: '4px',
                                    padding: '4px'
                                }}
                                onClick={() => handleHideError(field, index)}
                            >
                                <Icon16Cancel fill="#E64646" />
                            </IconButton>
                            <div style={{ color: '#E64646', marginBottom: '4px', paddingRight: '24px' }}>
                                {error.type}: {error.message}
                            </div>
                            <div style={{ marginBottom: '4px' }}>
                                <span style={{ textDecoration: 'line-through', color: '#E64646' }}>
                                    {error.word}
                                </span>
                            </div>
                            {error.suggestions.length > 0 && (
                                <div style={{ color: '#2688eb' }}>
                                    Варианты замены: {error.suggestions.join(', ')}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <Div style={{ 
            maxWidth: '1000px',
            margin: '0 auto',
            padding: isMobile ? '12px' : '20px'
        }}>
            <Header style={{
                marginBottom: isMobile ? '16px' : '24px',
                fontSize: isMobile ? '20px' : '24px'
            }}>
                Обо мне
            </Header>
            <FormLayoutGroup mode="vertical" style={{
                gap: '20px',
                display: 'flex',
                flexDirection: 'column'
            }}>
                <FormItem 
                    top="Образование" 
                    style={{
                        marginBottom: isMobile ? '16px' : '24px'
                    }}
                    bottom={renderSpellingSuggestions('education')}
                >
                    <Textarea
                        style={textareaStyle}
                        id="education"
                        value={education}
                        onChange={(e) => handleChange('education', e.target.value)}
                        placeholder="Перечислите учебные заведения, курсы и другие места, где вы обучались"
                    />
                </FormItem>
                <FormItem 
                    top="Навыки" 
                    style={{
                        marginBottom: isMobile ? '16px' : '24px'
                    }}
                    bottom={renderSpellingSuggestions('skills')}
                >
                    <Textarea
                        style={textareaStyle}
                        id="skills"
                        value={skills}
                        onChange={(e) => handleChange('skills', e.target.value)}
                        placeholder="Ваши основные навыки"
                    />
                </FormItem>
                <FormItem 
                    top="Опыт работы" 
                    style={{
                        marginBottom: isMobile ? '16px' : '24px'
                    }}
                    bottom={renderSpellingSuggestions('experience')}
                >
                    <Textarea
                        style={textareaStyle}
                        id="experience"
                        value={experience}
                        onChange={(e) => handleChange('experience', e.target.value)}
                        placeholder="Ваш опыт работы"
                    />
                </FormItem>
                <FormItem 
                    top="Предпочтения" 
                    style={{
                        marginBottom: isMobile ? '16px' : '24px'
                    }}
                    bottom={renderSpellingSuggestions('preferences')}
                >
                    <Textarea
                        style={textareaStyle}
                        id="preferences"
                        value={preferences}
                        onChange={(e) => handleChange('preferences', e.target.value)}
                        placeholder="Ваши ожидания от работы"
                    />
                </FormItem>
            </FormLayoutGroup>
        </Div>
    );
};

export default AboutMe;


