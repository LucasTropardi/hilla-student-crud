package com.ltsoftwaresupport.studentapplication.endpoints;

import com.ltsoftwaresupport.studentapplication.Student;
import com.ltsoftwaresupport.studentapplication.StudentRepository;
import com.vaadin.flow.server.auth.AnonymousAllowed;

import dev.hilla.Endpoint;

import java.util.List;

@Endpoint
@AnonymousAllowed
public class StudentEndpoint {
    private StudentRepository repository;

    StudentEndpoint(StudentRepository repository) {
        this.repository = repository;
    }

    public List<Student> findAll() {
        return repository.findAll();
    }

    public Student add(String name, String lastname, String grade) {
        return repository.save(new Student(name, lastname, grade));
    }

    public Student update(Student student) {
        return repository.save(student);
    }

    public void delete(Student student) {
        repository.delete(student);
    }
}
