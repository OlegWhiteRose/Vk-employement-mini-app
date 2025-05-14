import { useState } from 'react';
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

    return (
        <Div style={{ maxWidth: '1000px' }}>
        <Header>Обо мне</Header>
        <FormLayoutGroup mode="vertical">
            <FormItem top="Образование">
            <Textarea
                id="education"
                value={education}
                onChange={(e) => handleChange('education', e.target.value)}
                placeholder="Перечислите учебные заведения, курсы и другие места, где вы обучались"
            />
            </FormItem>
            <FormItem top="Навыки">
            <Textarea
                id="skills"
                value={skills}
                onChange={(e) => handleChange('skills', e.target.value)}
                placeholder="Ваши основные навыки"
            />
            </FormItem>
            <FormItem top="Опыт работы">
            <Textarea
                id="experience"
                value={experience}
                onChange={(e) => handleChange('experience', e.target.value)}
                placeholder="Ваш опыт работы"
            />
            </FormItem>
            <FormItem top="Предпочтения">
            <Textarea
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


