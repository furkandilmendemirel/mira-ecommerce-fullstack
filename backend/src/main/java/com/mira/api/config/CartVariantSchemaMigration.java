package com.mira.api.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.sql.Connection;
import java.util.List;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class CartVariantSchemaMigration implements CommandLineRunner {

    private final DataSource dataSource;
    private final JdbcTemplate jdbcTemplate;

    public CartVariantSchemaMigration(DataSource dataSource, JdbcTemplate jdbcTemplate) {
        this.dataSource = dataSource;
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void run(String... args) throws Exception {
        try (Connection connection = dataSource.getConnection()) {
            if (!"PostgreSQL".equalsIgnoreCase(connection.getMetaData().getDatabaseProductName())) return;
        }

        List<String> productOnlyConstraints = jdbcTemplate.queryForList("""
                SELECT tc.constraint_name
                FROM information_schema.table_constraints tc
                JOIN information_schema.key_column_usage kcu
                  ON tc.constraint_schema = kcu.constraint_schema
                 AND tc.constraint_name = kcu.constraint_name
                WHERE tc.table_schema = 'public'
                  AND tc.table_name = 'cart_items'
                  AND tc.constraint_type = 'UNIQUE'
                GROUP BY tc.constraint_name
                HAVING array_agg(kcu.column_name::text ORDER BY kcu.ordinal_position)
                       = ARRAY['user_id', 'product_id']::text[]
                """, String.class);

        for (String constraint : productOnlyConstraints) {
            String safeName = constraint.replace("\"", "\"\"");
            jdbcTemplate.execute("ALTER TABLE cart_items DROP CONSTRAINT IF EXISTS \"" + safeName + "\"");
        }

        jdbcTemplate.execute("""
                CREATE UNIQUE INDEX IF NOT EXISTS uk_cart_user_product_variant_idx
                ON cart_items (
                    user_id,
                    product_id,
                    COALESCE(selected_size, ''),
                    COALESCE(selected_color, '')
                )
                """);
    }
}
