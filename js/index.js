let url = `https://estsoft-openai-api.jejucodingcamp.workers.dev/`
let $txtareaCode = document.getElementById('txtareaCode')
let $buttonSend = document.getElementById('buttonSend')
let $review = document.getElementById('review')
let $info = document.getElementById('info')
let info = {
    "English": "Please send the source code and wait while the AI writes the code review. It takes about 20 to 30 seconds.",
    "Spanish": "Envíe el código fuente y espere mientras la IA escribe la revisión del código. Se tarda unos 20 a 30 segundos.",
    "French": "Veuillez envoyer le code source et patienter pendant que l'IA écrit la révision du code. Cela prend environ 20 à 30 secondes.",
    "Korean": "소스 코드를 전송하고 AI가 코드리뷰를 작성하는 동안 기다려주세요. 약 20초 ~ 30초 정도가 소요됩니다.",
    "Japannese": "ソースコードを送信し、AI がコードレビューを作成するまでお待ちください。 20～30秒ほどかかります。"
}
$info.innerText = info[document.getElementsByName("btn_language")[0].getAttribute("value")]
let $Loading = (function() {
    let $loadingscreen = document.getElementById("loadingscreen")
    this.show = function() {
        $loadingscreen.classList.remove("hidden")
    }
    this.hide = function() {
        $loadingscreen.classList.add("hidden")
    }
    return this
})()

$buttonSend.addEventListener('click', e => {
    e.preventDefault()
    $Loading.show()
    let code = $txtareaCode.value
    let data = [
        { "role": "system", "content": "The assistant is a code review expert." },
        { "role": "user", "content": "Please do a code review. Put the source code inside triple backticks." }
    ];
    data.push({
        "role": "user",
        "content": "Please do code reviews in " + document.getElementsByName("btn_language")[0].getAttribute("value") + "."
    })
    data.push({
        "role": "user",
        "content": code
    })
    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        redirect: "follow",
    })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            let str = data.choices[0].message.content
            str = str.replace(/(```[\s\S]*?```)|(\n)/g, (match, code, lineFeed) => {
                if (code) {
                    return code.replace(/```([\s\S]*?)```/g, "<pre><code>$1</code></pre>")
                } else {
                    return '<br>'
                }
            })
            console.log(str)
            $review.innerHTML = str
            hljs.highlightAll()
            $Loading.hide()
        })
})

// banner code review button click event
document.getElementsByName("menuCodeReview").forEach(element => {
    element.addEventListener("click", event => {
        event.preventDefault()
        reset_banner()
        document.getElementById("containerCodeReview").classList.remove("hidden")
        document.getElementById("containerGithub").classList.add("hidden")
    })
})

// Github button click event
document.getElementsByName("menuGithub").forEach(element => {
    element.addEventListener("click", event => {
        event.preventDefault()
        reset_banner()
        document.getElementById("containerCodeReview").classList.add("hidden")
        document.getElementById("containerGithub").classList.remove("hidden")
    })
})

// (not lg screen) menu button click event
document.getElementById("btn_banner_menu").addEventListener("click", event => {
    event.preventDefault()
    reset_banner()
    document.getElementById("banner_menu").classList.remove("hidden")
})

// banner language button click event
document.getElementsByName("btn_language").forEach(element => {
    element.addEventListener("click", event => {
        event.preventDefault()
        reset_banner()
        document.getElementById("banner_language").classList.remove("hidden")
    })
})

// language click event : set a language
document.getElementsByName("language").forEach(element => {
    element.addEventListener("click", event => {
        event.preventDefault()
        reset_banner()
        document.getElementsByName("btn_language").forEach(e => { e.setAttribute("value", element.getAttribute("value")); e.children[1].innerText = element.innerText; })
        $info.innerText = info[element.getAttribute("value")]
    })
})

// background of menu click event : hide the menu
document.getElementsByName("menu_bg").forEach(element => {
    element.addEventListener("click", event => {
        event.preventDefault()
        element.parentNode.classList.add("hidden")
    })
})

// textarea highlighting : focus
document.getElementById("txtareaCode").addEventListener("focus", event => {
    document.getElementById("wrapper-txtareaCode").classList.add("ring-2")
})

// textarea highlighting : blur
document.getElementById("txtareaCode").addEventListener("blur", event => {
    document.getElementById("wrapper-txtareaCode").classList.remove("ring-2")
})

/**
 * (not lg screen) hide a banner menu and language menu
 */
function reset_banner() {
    document.getElementById("banner_menu").classList.add("hidden")
    document.getElementById("banner_language").classList.add("hidden")
}