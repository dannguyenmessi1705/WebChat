package com.didan.webchat.user.config;

import javax.sql.DataSource;
import lombok.extern.slf4j.Slf4j;
import org.flywaydb.core.Flyway;
import org.flywaydb.core.api.configuration.FluentConfiguration;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.DependsOn;

/**
 * Custom Flyway configuration to manually configure Flyway
 * since FlywayAutoConfiguration is excluded in UserApplication
 * 
 * @author dannd1
 * @since 6/2/2025
 */
@Slf4j
@Configuration
@ConditionalOnProperty(value = "app.flyway.enabled", havingValue = "true", matchIfMissing = false)
public class FlywayConfig {

    @Value("${app.flyway.locations:#{'classpath:db/migration'}}")
    private String[] locations;

    @Value("${app.flyway.baseline-on-migrate:#{true}}")
    private boolean baselineOnMigrate;

    @Value("${app.flyway.table:flyway_schema_history}")
    private String table;

    @Value("${app.flyway.baseline-version:#{'0'}}")
    private String baselineVersion;

    @Value("${app.flyway.schemas}")
    private String schemas;

    @Value("${app.flyway.clean-disabled:#{true}}")
    private boolean cleanDisabled;

    @Value("${app.flyway.validate-on-migrate:#{true}}")
    private boolean validateOnMigrate;

    @Bean(name = "flyway")
    @DependsOn("userDataSource")
    public Flyway flyway(@Qualifier("userDataSource") DataSource dataSource) {
        log.info("Configuring Flyway with locations: {}", String.join(", ", locations));

        FluentConfiguration configuration = Flyway.configure()
                .dataSource(dataSource)
                .locations(locations)
                .baselineOnMigrate(baselineOnMigrate)
                .baselineVersion(baselineVersion)
                .table(table)
                .schemas(schemas)
                .cleanDisabled(cleanDisabled)
                .validateOnMigrate(validateOnMigrate);

        Flyway flyway = new Flyway(configuration);

        try {
            flyway.migrate();
            log.info("Flyway migration completed successfully");
        } catch (Exception e) {
            log.error("Error during Flyway migration: {}", e.getMessage(), e);
            throw e;
        }

        return flyway;
    }
}
