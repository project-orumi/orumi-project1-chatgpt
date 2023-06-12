const lang = {
    menu: {
        menu1: {
            "English": "Ai Code Review",
            "Spanish": "Ai Revisión de código",
            "French": "Ai Révision des codes",
            "Korean": "Ai 코드 리뷰",
            "Japannese": "Ai コードレビュー"
        },
        menu2: {
            "English": "Ai Find Song",
            "Spanish": "Ai Buscar canción",
            "French": "Ai Trouver la chanson",
            "Korean": "Ai 노래 찾기",
            "Japannese": "Ai 曲を探す"
        }
    },
    how_cr: {
        "English": "Please send the source code and wait while the AI writes the code review. It takes about 20 to 30 seconds.",
        "Spanish": "Envíe el código fuente y espere mientras la IA escribe la revisión del código. Se tarda unos 20 a 30 segundos.",
        "French": "Veuillez envoyer le code source et patienter pendant que l'IA écrit la révision du code. Cela prend environ 20 à 30 secondes.",
        "Korean": "소스 코드를 전송하고 AI가 코드리뷰를 작성하는 동안 기다려주세요. 약 20초 ~ 30초 정도가 소요됩니다.",
        "Japannese": "ソースコードを送信し、AI がコードレビューを作成するまでお待ちください。 20～30秒ほどかかります。"
    },
    how_fs: {
        "English": "Please send the lyrics and wait while the AI search the song title. It takes about 20 to 30 seconds.",
        "Spanish": "Envíe la letra y espere mientras la IA busca el título de la canción. Se tarda unos 20 a 30 segundos.",
        "French": "Veuillez envoyer les paroles et patienter pendant que l'IA recherche le titre de la chanson. Cela prend environ 20 à 30 secondes.",
        "Korean": "가사를 전송하고 AI가 노래 제목을 검색하는 동안 기다려주세요. 약 20초 ~ 30초 정도가 소요됩니다.",
        "Japannese": "歌詞を送信し、AIが曲名を検索するまでお待ちください。 20～30秒ほどかかります。"
    }
}
const sample = {
    code: `lst = []
lst.append(1)
lst.append(lst)
print(lst)`,
    lyrics: {
        "English": "Fiesta nae maeume taeyangeul kkuk samginchae yeongwontorok",
        "Spanish": `I’m your man I’m your man
geudaeyeo ddaradadda oneuldo
naneun oneuldo geudaeman saenggakhae`,
        "French": `neon sugar free ije neon sugar free naegeman sugar free modeunge sugar free neoneun galsurok wae ireoke gaseumeul apeuge haeyo ireoke apeugeman hae dalkomhameul ireobeorin`,
        "Korean": `이렇게 난 또 (fiction in fiction)
잊지 못하고 (fiction in fiction)
내 가슴 속에 끝나지 않을 이야길 쓰고 있어`,
        "Japannese": `Cause I know what you like boy (ah-ah)
You're my chemical hype boy (ah-ah)
ナイ ジナンナルデュルエン ヌン ッツメオン イツヌン ッツム
Hype Boy ネマン オンヘ
Hype Boy ナガ ゼンヘ`
    }
}
let $Loading = (function () {
    let $loadingscreen = document.getElementById("loadingscreen")
    this.show = function () {
        $loadingscreen.classList.remove("hidden")
    }
    this.hide = function () {
        $loadingscreen.classList.add("hidden")
    }
    return this
})()
let url = `https://estsoft-openai-api.jejucodingcamp.workers.dev/`
let $menu_cr = document.getElementsByName("menu_cr")
let $menu_fs = document.getElementsByName("menu_fs")
let $how_cr = document.getElementById('how_cr')
let $how_fs = document.getElementById('how_fs')
let $tta_code = document.getElementById("tta_code")
let $tta_lyrics = document.getElementById("tta_lyrics")
let $language = document.getElementsByName("language")
const initial_language = $language[3].getAttribute("value") // initialize default language
document.getElementsByName("btn_lang").forEach(e => { e.setAttribute("value", initial_language); e.children[1].innerText = $language[3].innerText; })
$menu_cr.forEach(e => { e.innerText = lang.menu.menu1[initial_language] })
$menu_fs.forEach(e => { e.innerText = lang.menu.menu2[initial_language] })
$how_cr.innerText = lang.how_cr[initial_language]
$how_fs.innerText = lang.how_fs[initial_language]
$tta_code.value = sample.code
$tta_lyrics.value = sample.lyrics[initial_language]

document.getElementById('btn_cr').addEventListener('click', e => {
    e.preventDefault()
    $Loading.show()
    let code = $tta_code.value
    let data = [
        { "role": "system", "content": "The assistant is a code review expert." },
        { "role": "user", "content": "Please do a code review. Put the source code inside triple backticks." }
    ];
    data.push({
        "role": "user",
        "content": "Please do code reviews in " + document.getElementsByName("btn_lang")[0].getAttribute("value") + "."
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
            document.getElementById('review').innerHTML = str
            hljs.highlightAll()
            $Loading.hide()
        })
})

document.getElementById('btn_fs').addEventListener('click', e => {
    e.preventDefault()
    document.getElementById("song").classList.add("hidden")
    document.getElementById('singer-title').innerText = ""
    document.getElementById('youtubes').innerHTML = ""
    $Loading.show()
    let lyrics = $tta_lyrics.value
    let data = [
        { "role": "system", "content": "Assistant finds song titles by song lyrics." },
        { "role": "user", "content": 'Find the song title from lyrics. Additionally Let me know the song title and singer name or group name as a json object. {"song_title":"title", "singer_name":"name"}' }
    ];
    data.push({
        "role": "user",
        "content": lyrics
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
            console.log("data", data)
            let str = data.choices[0].message.content
            // If the g flag is not used, only the first complete match and its related capturing groups are returned.
            const pattern1 = /{\s*"song_title"\s*:\s*".*",\s*"singer_name"\s*:\s*".*"\s*}/
            const pattern2 = /title\s*is\s*"(.*)"/
            let found1 = str.match(pattern1)
            let found2 = str.match(pattern2)
            console.log("found1", found1)
            console.log("found2", found2)
            if (found1) {
                let found = JSON.parse(found1[0])
                console.log(found)
                document.getElementById('singer-title').innerText = found["singer_name"] + " - " + found["song_title"]
                const q = found["singer_name"] + " " + found["song_title"] + " music video"
                youtubeSearch(q)
            } else {
                if (found2) {
                    let found = found2[1]
                    console.log(found)
                    document.getElementById('singer-title').innerText = found["song_title"]
                    const q = "song " + found["song_title"]
                    youtubeSearch(q)
                } else {
                    document.getElementById('song').innerHTML = "<p>" + str + "</p>"
                }
            }
            hljs.highlightAll()
            $Loading.hide()
        })
})

// banner code review button click event
document.getElementsByName("menu_cr").forEach(element => {
    element.addEventListener("click", event => {
        event.preventDefault()
        reset_sub_menu()
        document.getElementById("ctn_cr").classList.remove("hidden")
        document.getElementById("ctn_fs").classList.add("hidden")
        document.getElementById("containerGithub").classList.add("hidden")
    })
})

// banner Title from Lyrics button click event
document.getElementsByName("menu_fs").forEach(element => {
    element.addEventListener("click", event => {
        event.preventDefault()
        reset_sub_menu()
        document.getElementById("ctn_cr").classList.add("hidden")
        document.getElementById("ctn_fs").classList.remove("hidden")
        document.getElementById("containerGithub").classList.add("hidden")
    })
})

// Github button click event
document.getElementsByName("btn_git").forEach(element => {
    element.addEventListener("click", event => {
        event.preventDefault()
        reset_sub_menu()
        document.getElementById("ctn_cr").classList.add("hidden")
        document.getElementById("ctn_fs").classList.add("hidden")
        document.getElementById("containerGithub").classList.remove("hidden")
    })
})

// (not lg screen) menu button click event
document.getElementById("btn_banner_menu").addEventListener("click", event => {
    event.preventDefault()
    reset_sub_menu()
    document.getElementById("sub_menu").classList.remove("hidden")
    document.getElementById("banner_menu").classList.remove("hidden")
})

// banner language button click event
document.getElementsByName("btn_lang").forEach(element => {
    element.addEventListener("click", event => {
        event.preventDefault()
        reset_sub_menu()
        document.getElementById("sub_menu").classList.remove("hidden")
        document.getElementById("banner_language").classList.remove("hidden")
    })
})

// language click event : set a language
document.getElementsByName("language").forEach(element => {
    element.addEventListener("click", event => {
        event.preventDefault()
        reset_sub_menu()
        const selected = element.getAttribute("value")
        document.getElementsByName("btn_lang").forEach(e => { e.setAttribute("value", selected); e.children[1].innerText = element.innerText; })
        $how_cr.innerText = lang.how_cr[selected]
        $how_fs.innerText = lang.how_fs[selected]
        $tta_lyrics.value = sample.lyrics[selected]
        $menu_cr.forEach(e => { e.innerText = lang.menu.menu1[selected] })
        $menu_fs.forEach(e => { e.innerText = lang.menu.menu2[selected] })
    })
})

// blacklayer click event : hide the menu
document.getElementById("blacklayer").addEventListener("click", event => {
    event.preventDefault()
    reset_sub_menu()
})

// textarea highlighting : focus
Array.from(document.getElementsByClassName("tta")).forEach(element => {
    element.addEventListener("focus", event => {
        element.parentNode.parentNode.classList.add("ring-2")
    })
})

// textarea highlighting : blur
Array.from(document.getElementsByClassName("tta")).forEach(element => {
    element.addEventListener("blur", event => {
        element.parentNode.parentNode.classList.remove("ring-2")
    })
})

/**
 * (not lg screen) hide a banner menu and language menu
 */
function reset_sub_menu() {
    document.getElementById("sub_menu").classList.add("hidden")
    document.getElementById("banner_menu").classList.add("hidden")
    document.getElementById("banner_language").classList.add("hidden")
}

/**
 * Youtube Data API Search
 * @param {string} q search query
 */
function youtubeSearch(q) {
    const url = `https://www.googleapis.com/youtube/v3/search?q=${q}&part=snippet&safeSearch=strict&type=video&key=AIzaSyBWD9JEt64rtpayZ6JBtnYrGqx0PZaa9J4`
    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            document.getElementById("song").classList.remove("hidden")
            data.items.forEach(d => {
                document.getElementById('youtubes').innerHTML += '<iframe id="ytplayer" type="text/html" width="640" height="360" src="https://www.youtube.com/embed/' + d.id.videoId + '" frameborder="0"></iframe>'
            })
        }).catch(r => {
            console.log(r)
        })
}
