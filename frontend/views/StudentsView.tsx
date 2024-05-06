import React, { useState, useEffect } from 'react';
import { StudentEndpoint } from 'Frontend/generated/endpoints';
import Student from 'Frontend/generated/com/ltsoftwaresupport/studentapplication/Student';
import { Grid } from '@hilla/react-components/Grid.js'; 
import { GridColumn } from '@hilla/react-components/GridColumn.js';
import StudentForm from './StudentForm';
import { ConfirmDialog, ConfirmDialogOpenedChangedEvent } from '@hilla/react-components/ConfirmDialog.js';
import { Button } from '@hilla/react-components/Button.js';

export default function StudentsView() {
    const [students, setStudents] = useState<Student[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
    const [dialogOpened, setDialogOpened] = useState(false);
    const [selectedStudentForEdit, setSelectedStudentForEdit] = useState<Student | undefined>();

    useEffect(() => {
        fetchStudents();
    }, []);

    async function fetchStudents() {
        try {
            const students = await StudentEndpoint.findAll();
            setStudents(students);
        } catch (error) {
            console.error('Error fetching students:', error);
        }
    }

    async function addStudent(studentData: Student) {
        try {
            if (studentData.id !== 0) {
                await updateStudent(studentData);
            } else if (studentData.name && studentData.lastname && studentData.grade) {
                const saved = await StudentEndpoint.add(studentData.name, studentData.lastname, studentData.grade);
                if (saved) {
                    setStudents([...students, saved]);
                    setShowForm(false);
                }
            } else {
                console.error('Error adding student: Missing required fields');
            }
        } catch (error) {
            console.error('Error adding student:', error);
        }
    }

    function confirmDelete(student: Student) {
        setStudentToDelete(student);
        setDialogOpened(true);
    }

    async function deleteStudent() {
        if (studentToDelete) {
            try {
                await StudentEndpoint.delete(studentToDelete);
                const updatedStudents = students.filter(s => s.id !== studentToDelete.id);
                setStudents(updatedStudents);
                setStudentToDelete(null);
                setDialogOpened(false);
            } catch (error) {
                console.error('Error deleting student:', error);
            }
        }
    }

    function handleDialogOpenedChanged(event: ConfirmDialogOpenedChangedEvent) {
        setDialogOpened(event.detail.value);
    }

    async function editStudent(student: Student) {
        setSelectedStudentForEdit(student);
        setShowForm(true);
    }
    
    async function updateStudent(updatedStudent: Student) {
        try {
            const response = await StudentEndpoint.update(updatedStudent);
            if (!response) {
                throw new Error('Failed to update student');
            }
            const updatedStudentIndex = students.findIndex(s => s.id === updatedStudent.id);
            const updatedStudents = [...students];
            updatedStudents[updatedStudentIndex] = updatedStudent;
            setStudents(updatedStudents);
            setShowForm(false);
        } catch (error) {
            console.error('Error updating student:', error);
        }
    }

    return (
        <div className='form-view'>
                <Button className='form-button1' onClick={() => setShowForm(!showForm)}>{showForm ? 'Show Students' : 'Add Student'}</Button>
            {showForm ? (
                <StudentForm onSubmit={addStudent} selectedStudent={selectedStudentForEdit} />
            ) : (
                <div>
                    <Grid items={students as Student[]}> 
                        <GridColumn path="name" header="Name" />
                        <GridColumn path="lastname" header="Lastname" />
                        <GridColumn path="grade" header="Grade" />
                        <GridColumn header="Actions" renderer={({ item }) => (
                            <div>
                                <button className='edit' onClick={() => editStudent(item)}>Edit</button>
                                <button className='delete' onClick={() => confirmDelete(item)}>Delete</button>
                            </div>
                        )} />
                    </Grid>
                    <ConfirmDialog
                        header={`Delete "${studentToDelete?.name}"?`}
                        cancelButtonVisible
                        confirmText="Delete"
                        confirmTheme="error primary"
                        opened={dialogOpened}
                        onOpenedChanged={handleDialogOpenedChanged}
                        onCancel={() => {
                            setStudentToDelete(null);
                            setDialogOpened(false); 
                        }}
                        onConfirm={deleteStudent}
                    >
                        Are you sure you want to permanently delete this item?
                    </ConfirmDialog>
                </div>
            )}
        </div>
    );
}
