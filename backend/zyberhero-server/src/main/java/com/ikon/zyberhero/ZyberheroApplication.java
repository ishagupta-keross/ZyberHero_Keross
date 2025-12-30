package com.ikon.zyberhero;

import jakarta.annotation.PostConstruct;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.TimeZone;

@SpringBootApplication
public class ZyberheroApplication {

    public static void main(String[] args) {
        // Ensure the JVM and default timezone are the modern IANA name
        // Set both system property and default TimeZone before Spring starts so
        // datasource / Hibernate connections inherit it and won't send legacy names.
        System.setProperty("user.timezone", "Asia/Kolkata");
        java.util.TimeZone.setDefault(java.util.TimeZone.getTimeZone("Asia/Kolkata"));

        SpringApplication.run(ZyberheroApplication.class, args);
    }

    @PostConstruct
    public void init() {
        // Fixes the "Asia/Calcutta" error by forcing the modern timezone   
        TimeZone.setDefault(TimeZone.getTimeZone("Asia/Kolkata"));
    }

}