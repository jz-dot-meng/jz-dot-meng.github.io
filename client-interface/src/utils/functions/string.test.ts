import { describe, expect, it } from "vitest";
import { debugRustPrettify } from "./string";

describe("debugRustPrettify", () => {
    it("should format a simple struct correctly", () => {
        const input = 'ServiceConfig { name: "analytics-service" }';
        const result = debugRustPrettify(input);

        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data).toEqual(["ServiceConfig {", '    name: "analytics-service"', "}"]);
        }
    });

    it("should format a nested struct correctly", () => {
        const input =
            'AppConfig { service: ServiceConfig { name: "analytics-service", environment: RequiredEnvValue("development") } }';
        const result = debugRustPrettify(input);

        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data).toEqual([
                "AppConfig {",
                "    service: ServiceConfig {",
                '        name: "analytics-service",',
                '        environment: RequiredEnvValue("development")',
                "    }",
                "}",
            ]);
        }
    });

    it("should handle empty structs", () => {
        const input = "EmptyConfig { }";
        const result = debugRustPrettify(input);

        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data).toEqual(["EmptyConfig {", "}"]);
        }
    });

    it("should handle enums with values", () => {
        const input = "Result::Ok(42)";
        const result = debugRustPrettify(input);

        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data).toEqual(["Result::Ok(42)"]);
        }
    });

    it("should handle complex nested structures", () => {
        const input =
            'Config { database: DatabaseConfig { url: "postgres://localhost:5432", pool_size: 10, timeout: Duration { secs: 30, nanos: 0 } }, features: Features { logging: true, metrics: false } }';
        const result = debugRustPrettify(input);

        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data).toEqual([
                "Config {",
                "    database: DatabaseConfig {",
                '        url: "postgres://localhost:5432",',
                "        pool_size: 10,",
                "        timeout: Duration {",
                "            secs: 30,",
                "            nanos: 0",
                "        }",
                "    },",
                "    features: Features {",
                "        logging: true,",
                "        metrics: false",
                "    }",
                "}",
            ]);
        }
    });

    it("should return an error for invalid input", () => {
        const input = "This is not a valid Rust debug output";
        const result = debugRustPrettify(input);

        expect(result.success).toBe(false);
        if (result.success === false) {
            expect(result.error).toBeTruthy();
        }
    });

    it("should handle unbalanced braces gracefully", () => {
        const input = 'Config { missing: "closing brace"';
        const result = debugRustPrettify(input);

        expect(result.success).toBe(false);
        if (result.success === false) {
            expect(result.error).toBeTruthy();
        }
    });
});
