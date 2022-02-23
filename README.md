# Simple Recaptcha

A simple wrapper around Google's Recaptcha that makes it easy to use programmatically for forms in JavaScript frameworks such as React, Vue, or Alpine JS without the need to add attributes in the templates.

## Features
- Handles both Google Recaptcha V2 and V3
- Allows options to be set programmatically instead of through HTML attributes
- Uses promises in favour of callbacks
- Reduces complexity by including all the necessary script and link tags and abstracting away `window` calls

## Usage

Initialize the plugin:

```js
const {simpleRecaptchaV2, simpleRecaptchaV3} = SimpleRecaptcha()
const id1 = 'recaptcha-wrapper-1'
const id2 = 'recaptcha-wrapper-2'

function exampleInit() {
    simpleRecaptchaV2.init([
        { id: id1, renderOptions: { sitekey: v2Key } },
        { id: id2, renderOptions: { sitekey: v2Key, theme: 'dark' } }
    ])

    simpleRecaptchaV3.init(v3Key)
}
```

While submitting a form via AJAX, grab the token and add it with the rest of the form data:

```js
// V2: Get token immediately
const token1 = simpleRecaptchaV2.getResponseToken(simpleRecaptchaV2.getWidgetId(id1))
console.log(token1)

const token2 = simpleRecaptchaV2.getResponseToken(simpleRecaptchaV2.getWidgetId(id2))
console.log(token2)

// Submit form via AJAX + token to backend

// V3: Get token from promise
simpleRecaptchaV3.getResponseToken(v3Key).then((token3) => {
    console.log(token3)
    
    // Submit form via AJAX + token to backend
})
```
