module.exports = {
    env: {
        browser: true,
        es6: true,
        node: true
    },
    parser: "@typescript-eslint/parser",
    parserOptions: {
        project: "tsconfig.json",
        sourceType: "module"
    },
    plugins: [
        "@typescript-eslint"
    ],
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended"
    ],
    rules: {
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/no-use-before-define": "off",
        "no-throw-literal": "off",
        "@typescript-eslint/camelcase": "off",
        "require-atomic-updates": "off",
        "arrow-body-style": "error",
        "arrow-parens": [
            "off",
            "as-needed"
        ],
        "complexity": "off",
        "constructor-super": "error",
        "curly": "error",
        "default-case": "error",
        "dot-notation": "error",
        "eol-last": "error",
        "guard-for-in": "error",
        "max-classes-per-file": [
            "error",
            1
        ],
        "new-parens": "error",
        "no-bitwise": "error",
        "no-caller": "error",
        "no-cond-assign": "error",
        "no-console": [
            "error",
            {
                allow: [
                    "debug",
                    "info",
                    "time",
                    "timeEnd",
                    "trace"
                ]
            }
        ],
        "no-debugger": "error",
        "no-empty": "error",
        "no-fallthrough": "error",
        "no-invalid-this": "off",
        "no-multiple-empty-lines": "error",
        "no-new-wrappers": "error",
        "no-undef-init": "off",
        "no-unsafe-finally": "error",
        "no-unused-labels": "error",
        "no-var": "error",
        "object-shorthand": "error",
        "one-var": ["error", "never"],
        "prefer-const": "error",
        "quote-props": [
            "error",
            "consistent-as-needed"
        ],
        "radix": "error",
        "space-before-function-paren": "off",
        "use-isnan": "error",
        "valid-typeof": "off",
        /*"@typescript-eslint/config": [
            "error",
            {
                rules: {
                    "align": [
                        true,
                        "parameters"
                    ],
                    "comment-format": [
                        true,
                        "check-space"
                    ],
                    "import-spacing": true,
                    "jsdoc-format": true,
                    "max-line-length": [
                        true,
                        160
                    ],
                    "no-duplicate-variable": true,
                    "no-null-keyword": true,
                    "no-reference-import": true,
                    "no-shadowed-variable": true,
                    "no-trailing-whitespace": true,
                    "no-explicit-any": "off",
                    "explicit-function-return-type": "off",
                    "no-unused-expression": true,
                    "one-line": [
                        true,
                        "check-open-brace",
                        "check-catch",
                        "check-else",
                        "check-finally",
                        "check-whitespace"
                    ],
                    "only-arrow-functions": [
                        true,
                        "allow-declarations",
                        "allow-named-functions"
                    ],
                    "quotemark": [
                        true,
                        "single",
                        "avoid-escape"
                    ],
                    "semicolon": true,
                    "trailing-comma": [
                        true,
                        {
                            multiline: {
                                objects: "always",
                                arrays: "always",
                                functions: "never",
                                typeLiterals: "ignore"
                            },
                            singleline: "never"
                        }
                    ],
                    "triple-equals": [
                        true,
                        "allow-null-check"
                    ],
                    "typedef": [
                        true,
                        "call-signature",
                        "parameter"
                    ],
                    "whitespace": [
                        true,
                        "check-branch",
                        "check-decl",
                        "check-operator",
                        "check-separator",
                        "check-type"
                    ]
                }
            }
        ] */
    }
};
