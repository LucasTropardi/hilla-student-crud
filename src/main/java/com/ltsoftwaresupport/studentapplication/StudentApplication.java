package com.ltsoftwaresupport.studentapplication;

import com.vaadin.flow.component.page.AppShellConfigurator;
import com.vaadin.flow.theme.Theme;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * The entry point of the Spring Boot studentapplication.
 *
 * Use the @PWA annotation make the studentapplication installable on phones, tablets
 * and some desktop browsers.
 *
 */
@SpringBootApplication
@Theme(value = "student")
public class StudentApplication implements AppShellConfigurator {

    public static void main(String[] args) {
        SpringApplication.run(StudentApplication.class, args);
    }

}
