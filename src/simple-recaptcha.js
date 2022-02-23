window.SimpleRecaptcha = (() => {

    const LINK_GOOGLE = `https://www.google.com`
    const LINK_GSTATIC = `https://www.gstatic.com`

    const addScripts = (url) => {
        if (!document.querySelector(`link[href="${LINK_GOOGLE}"]`)) {
            let template = document.createElement('template')
            template.innerHTML = `<link rel="preconnect" href="${LINK_GOOGLE}">`
            document.head.appendChild(template.content.firstChild)
        }

        if (!document.querySelector(`link[href="${LINK_GSTATIC}"]`)) {
            let template = document.createElement('template')
            template.innerHTML = `<link rel="preconnect" href="${LINK_GSTATIC}" crossorigin>`
            document.head.appendChild(template.content.firstChild)
        }

        const head = document.getElementsByTagName('head')[0]
        const script = document.createElement('script')
        script.type = 'text/javascript'
        script.src = url
        script.defer = true

        head.appendChild(script)
    }

    const SimpleRecaptchaV2 = (() => {
        const elementMap = {}

        // Adapted from https://developers.google.com/recaptcha/docs/loading
        const registerOnloadCallback = (options) => {
            // How this code snippet works:
            // This logic overwrites the default behavior of `grecaptcha.ready()` to
            // ensure that it can be safely called at any time. When `grecaptcha.ready()`
            // is called before reCAPTCHA is loaded, the callback function that is passed
            // by `grecaptcha.ready()` is enqueued for execution after reCAPTCHA is
            // loaded.
            if (typeof window.grecaptcha === 'undefined') {
                window.grecaptcha = {}
            }

            window.grecaptcha.ready = (cb) => {
                if (typeof window.grecaptcha === 'undefined') {
                    // window.__grecaptcha_cfg is a global variable that stores reCAPTCHA's
                    // configuration. By default, any functions listed in its 'fns' property
                    // are automatically executed when reCAPTCHA loads.
                    const c = '___grecaptcha_cfg'
                    window[c] = window[c] || {}
                        (window[c]['fns'] = window[c]['fns'] || []).push(cb)
                } else {
                    cb()
                }
            }

            // Usage
            window.grecaptcha.ready(() => {
                options.forEach(({ id, renderOptions }) => {
                    const widgetId = window.grecaptcha.render(id, renderOptions)
                    elementMap[id] = widgetId
                })
            })
        }

        return {
            init(options) {
                addScripts(`https://www.google.com/recaptcha/api.js?onload=simpleRecaptchaV2OnloadCallback&render=explicit`)
                window.simpleRecaptchaV2OnloadCallback = registerOnloadCallback.bind(null, options)
            },
            getWidgetId(elementId) {
                return elementMap[elementId] ?? null
            },
            getResponseToken(widgetId) {
                return window.grecaptcha.getResponse(widgetId)
            }
        }
    })

    const SimpleRecaptchaV3 = (() => {
        return {
            init(siteKey) {
                addScripts(`https://www.google.com/recaptcha/api.js?render=${siteKey}`)
            },
            getResponseToken(siteKey) {
                return new Promise((resolve, reject) => {
                    window.grecaptcha.ready(() => {
                        window.grecaptcha.execute(siteKey, { action: 'submit' }).then((token) => {
                            resolve(token)
                        })
                    })
                })
            }
        }
    })

    return { simpleRecaptchaV2: SimpleRecaptchaV2(), simpleRecaptchaV3: SimpleRecaptchaV3() }
})
