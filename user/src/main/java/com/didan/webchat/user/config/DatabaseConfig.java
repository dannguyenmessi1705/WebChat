package com.didan.webchat.user.config;

import com.google.gson.Gson;
import com.zaxxer.hikari.HikariDataSource;
import jakarta.persistence.EntityManagerFactory;
import java.util.HashMap;
import java.util.Map;
import javax.sql.DataSource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.orm.jpa.EntityManagerFactoryBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;

/**
 * @author dannd1
 * @since 6/2/2025
 */
@Slf4j
@Configuration
@ConditionalOnProperty(
    value = "app.datasource.default.enabled",
    havingValue = "true",
    matchIfMissing = true
)
@EnableTransactionManagement
@EnableJpaRepositories(
    entityManagerFactoryRef = "userEntityManagerFactory",
    transactionManagerRef = "userTransactionManager",
    basePackages = {"com.didan.webchat.user.repository"}
)
public class DatabaseConfig {

  @Value("${app.datasource.default.url:#{null}}")
  private String urlForLog;

  @Primary
  @Bean(name = "userDataSourceProperties")
  @ConfigurationProperties("app.datasource.default")
  public DataSourceProperties dataSourceProperties() {
    return new DataSourceProperties();
  }

  @Primary
  @Bean(name = "userDataSource")
  @ConfigurationProperties(prefix = "app.datasource.default.configuration")
  public DataSource dataSource() {
    return dataSourceProperties().initializeDataSourceBuilder().type(HikariDataSource.class).build();
  }

  @Bean(name = "userPropertiesHibernate")
  @ConfigurationProperties(prefix = "app.datasource.default.properties")
  public Map<String, String> dataProperties() {
    return new HashMap<>();
  }

  @Primary
  @Bean(name = "userEntityManagerFactory")
  public LocalContainerEntityManagerFactoryBean entityManagerFactory(
      EntityManagerFactoryBuilder builder) {
    log.info("DB config userDataSource: " + urlForLog);
    return builder
        .dataSource(dataSource())
        .packages("com.didan.webchat.user.entity")
        .properties(dataProperties())
        .build();
  }

  @Primary
  @Bean(name = "userTransactionManager")
  public PlatformTransactionManager transactionManager(
      @Qualifier("userEntityManagerFactory") EntityManagerFactory entityManagerFactory) {
    return new JpaTransactionManager(entityManagerFactory);
  }

  @Bean
  public Gson gson() {
    return new Gson();
  }

}