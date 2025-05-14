import { useState, useEffect } from 'react';
import {
    Header,
    Div,
    FormLayoutGroup,
    Textarea,
    FormItem
} from '@vkontakte/vkui';

const AboutMe = ({ onDataChange, initialData }) => {
    const [education, setEducation] = useState(initialData.education || '');
    const [skills, setSkills] = useState(initialData.skills || '');
    const [experience, setExperience] = useState(initialData.experience || '');
    const [preferences, setPreferences] = useState(initialData.preferences || '');
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.matchMedia('(max-width: 600px)').matches);
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const handleChange = (field, value) => {
        const newData = { [field]: value };
        onDataChange(newData);
        
        switch(field) {
            case 'education': setEducation(value); break;
            case 'skills': setSkills(value); break;
            case 'experience': setExperience(value); break;
            case 'preferences': setPreferences(value); break;
        }
    };

    const textareaStyle = {
        fontSize: isMobile ? '14px' : '16px',
        padding: '12px',
        width: '100%',
        boxSizing: 'border-box',
        minHeight: '120px',
        lineHeight: '1.5'
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
                <FormItem top="Образование" style={{
                    marginBottom: isMobile ? '16px' : '24px'
                }}>
                    <Textarea
                        id="education"
                        value={education}
                        onChange={(e) => handleChange('education', e.target.value)}
                        placeholder="Перечислите учебные заведения, курсы и другие места, где вы обучались"
                        style={textareaStyle}
                    />
                </FormItem>
                <FormItem top="Навыки" style={{
                    marginBottom: isMobile ? '16px' : '24px'
                }}>
                    <Textarea
                        id="skills"
                        value={skills}
                        onChange={(e) => handleChange('skills', e.target.value)}
                        placeholder="Ваши основные навыки"
                        style={textareaStyle}
                    />
                </FormItem>
                <FormItem top="Опыт работы" style={{
                    marginBottom: isMobile ? '16px' : '24px'
                }}>
                    <Textarea
                        id="experience"
                        value={experience}
                        onChange={(e) => handleChange('experience', e.target.value)}
                        placeholder="Ваш опыт работы"
                        style={textareaStyle}
                    />
                </FormItem>
                <FormItem top="Предпочтения" style={{
                    marginBottom: isMobile ? '16px' : '24px'
                }}>
                    <Textarea
                        id="preferences"
                        value={preferences}
                        onChange={(e) => handleChange('preferences', e.target.value)}
                        placeholder="Ваши ожидания от работы"
                        style={textareaStyle}
                    />
                </FormItem>
            </FormLayoutGroup>
        </Div>
    );
};

export default AboutMe;


