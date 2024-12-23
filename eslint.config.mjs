// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs";

export default withNuxt({
  rules: {
    "vue/html-self-closing": 0,
    "vue/max-attributes-per-line": "off",
    "vue/singleline-html-element-content-newline": "off",
    "@stylistic/brace-style": "off",
    "vue/operator-linebreak": "off",
    "@stylistic/indent": "off",
    "@stylistic/indent-binary-ops": "off",
    "vue/html-indent": "off",
    "@stylistic/operator-linebreak": "off",
    "@stylistic/arrow-parens": "off",
    "@stylistic/quote-props": "off",
  },
});
