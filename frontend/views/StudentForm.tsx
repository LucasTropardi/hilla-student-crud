import React, { useState, useEffect } from 'react';
import Student from 'Frontend/generated/com/ltsoftwaresupport/studentapplication/Student';
import { TextField } from '@hilla/react-components/TextField.js';
import { Button } from '@hilla/react-components/Button.js';

interface StudentFormProps {
    onSubmit: (studentData: Student) => void;
    selectedStudent?: Student; 
}

export default function StudentForm({ onSubmit, selectedStudent }: StudentFormProps) {
    const [name, setName] = useState('');
    const [lastname, setLastname] = useState('');
    const [grade, setGrade] = useState('');

    useEffect(() => {
        if (selectedStudent) {
            setName(selectedStudent.name || ''); 
            setLastname(selectedStudent.lastname || '');
            setGrade(selectedStudent.grade || ''); 
        } else {
            setName('');
            setLastname('');
            setGrade('');
        }
    }, [selectedStudent]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const updatedStudent: Student = {
            id: selectedStudent?.id || 0,
            name,
            lastname,
            grade,
        };
        if (selectedStudent && selectedStudent.id) {
            updateStudent(updatedStudent);
        } else {
            onSubmit(updatedStudent);
        }
    };

    async function updateStudent(updatedStudent: Student) {
        try {
            const response = await fetch('/api/student/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedStudent),
            });
            if (!response.ok) {
                throw new Error('Failed to update student');
            }
            onSubmit(updatedStudent); 
        } catch (error) {
            console.error('Error updating student:', error);
        }
    }

    return (
        <div className="form-container">
            <form onSubmit={handleSubmit}>
                <h2>{selectedStudent ? 'Edit Student' : 'Add Student'}</h2>
                <div className='espaco'>
                    <TextField className='form-item' value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
                    <TextField className='form-item' value={lastname} onChange={(e) => setLastname(e.target.value)} placeholder="Lastname" />
                    <TextField className='form-item' value={grade} onChange={(e) => setGrade(e.target.value)} placeholder="Grade" />
                </div>
                <div className='button'>
                    <Button className='form-button' theme="primary" onClick={handleSubmit}>{selectedStudent ? 'Update Student' : 'Add Student'}</Button>
                </div>
            </form>
        </div>
    );
}
