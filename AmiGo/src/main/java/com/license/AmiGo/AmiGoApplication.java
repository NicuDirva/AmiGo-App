package com.license.AmiGo;

import com.license.AmiGo.model.Account;
import com.license.AmiGo.model.Person;
import com.license.AmiGo.repository.PersonRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.data.neo4j.repository.config.EnableNeo4jRepositories;

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

@SpringBootApplication
public class AmiGoApplication {

	private final static Logger log = LoggerFactory.getLogger(AmiGoApplication.class);
	public static void main(String[] args) {

		SpringApplication.run(AmiGoApplication.class, args);
	}

}
