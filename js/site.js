import { lang } from "./lang.js"
import { sample } from "./sample.js"
import { Loading } from "./loading.js"

const url = `https://estsoft-openai-api.jejucodingcamp.workers.dev/`
const $menu_cr = document.getElementsByName("menu_cr")
const $menu_fs = document.getElementsByName("menu_fs")
const $how_cr = document.getElementById('how_cr')
const $how_fs = document.getElementById('how_fs')
const $tta_code = document.getElementById("tta_code")
const $tta_lyrics = document.getElementById("tta_lyrics")
const $language = document.getElementsByName("language")
const $btn_lang = document.getElementsByName("btn_lang")
const initial_language = $language[3].getAttribute("value") // default language

// initialize sample code
$tta_code.value = sample.code

// initialize default language
$btn_lang.forEach(e => { e.setAttribute("value", initial_language); e.children[1].innerText = $language[3].innerText; })
$menu_cr.forEach(e => { e.innerText = lang.menu.menu1[initial_language] })
$menu_fs.forEach(e => { e.innerText = lang.menu.menu2[initial_language] })
$how_cr.innerText = lang.how_cr[initial_language]
$how_fs.innerText = lang.how_fs[initial_language]
$tta_lyrics.value = sample.lyrics[initial_language]


document.getElementById('btn_cr').addEventListener('click', e => {
    e.preventDefault()
    Loading.show()
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
            let str = data.choices[0].message.content
            str = str.replace(/(```[\s\S]*?```)|(\n)/g, (match, code, lineFeed) => {
                if (code) {
                    return code.replace(/```([\s\S]*?)```/g, "<pre><code>$1</code></pre>")
                } else {
                    return '<br>'
                }
            })
            document.getElementById('review').innerHTML = str
            hljs.highlightAll()
            Loading.hide()
        })
})

document.getElementById('btn_fs').addEventListener('click', e => {
    e.preventDefault()
    document.getElementById("song").classList.add("hidden")
    document.getElementById('singer-title').innerText = ""
    document.getElementById('youtubes').innerHTML = ""
    Loading.show()
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
            let str = data.choices[0].message.content
            const pattern1 = /{\s*"song_title"\s*:\s*".*",\s*"singer_name"\s*:\s*".*"\s*}/
            const pattern2 = /title\s*is\s*"(.*)"/
            let found1 = str.match(pattern1)
            let found2 = str.match(pattern2)
            if (found1) {
                let found = JSON.parse(found1[0])
                document.getElementById('singer-title').innerText = found["singer_name"] + " - " + found["song_title"]
                const q = found["singer_name"] + " " + found["song_title"] + " music video"
                youtubeSearch(q)
            } else {
                if (found2) {
                    let found = found2[1]
                    document.getElementById('singer-title').innerText = found["song_title"]
                    const q = "song " + found["song_title"]
                    youtubeSearch(q)
                } else {
                    document.getElementById("song").classList.remove("hidden")
                    document.getElementById('youtubes').innerHTML = "<p>" + str + "</p>"
                }
            }
            hljs.highlightAll()
            Loading.hide()
        })
})

// banner code review button click event
document.getElementsByName("menu_cr").forEach(element => {
    element.addEventListener("click", event => {
        event.preventDefault()
        reset_sub_menu()
        document.getElementById("main_title").classList.add("hidden")
        document.getElementById("cr_title").classList.add("hidden")
        document.getElementById("fs_title").classList.add("hidden")
        document.getElementById("ft_title").classList.add("hidden")
        document.getElementById("ctn_cr").classList.remove("hidden")
        document.getElementById("ctn_fs").classList.add("hidden")
        document.getElementById("ctn_github").classList.add("hidden")
    })
})
document.getElementById("try_cr").addEventListener("click", event => {
    event.preventDefault()
    reset_sub_menu()
    document.getElementById("main_title").classList.add("hidden")
    document.getElementById("cr_title").classList.add("hidden")
    document.getElementById("fs_title").classList.add("hidden")
    document.getElementById("ft_title").classList.add("hidden")
    document.getElementById("ctn_cr").classList.remove("hidden")
    document.getElementById("ctn_fs").classList.add("hidden")
    document.getElementById("ctn_github").classList.add("hidden")
})

// banner Title from Lyrics button click event
document.getElementsByName("menu_fs").forEach(element => {
    element.addEventListener("click", event => {
        event.preventDefault()
        reset_sub_menu()
        document.getElementById("main_title").classList.add("hidden")
        document.getElementById("cr_title").classList.add("hidden")
        document.getElementById("fs_title").classList.add("hidden")
        document.getElementById("ft_title").classList.add("hidden")
        document.getElementById("ctn_cr").classList.add("hidden")
        document.getElementById("ctn_fs").classList.remove("hidden")
        document.getElementById("ctn_github").classList.add("hidden")
    })
})
document.getElementById("try_fs").addEventListener("click", event => {
    event.preventDefault()
    reset_sub_menu()
    document.getElementById("main_title").classList.add("hidden")
    document.getElementById("cr_title").classList.add("hidden")
    document.getElementById("fs_title").classList.add("hidden")
    document.getElementById("ft_title").classList.add("hidden")
    document.getElementById("ctn_cr").classList.add("hidden")
    document.getElementById("ctn_fs").classList.remove("hidden")
    document.getElementById("ctn_github").classList.add("hidden")
})

// Github button click event
document.getElementsByName("btn_git").forEach(element => {
    element.addEventListener("click", event => {
        event.preventDefault()
        reset_sub_menu()
        document.getElementById("main_title").classList.add("hidden")
        document.getElementById("cr_title").classList.add("hidden")
        document.getElementById("fs_title").classList.add("hidden")
        document.getElementById("ft_title").classList.add("hidden")
        document.getElementById("ctn_cr").classList.add("hidden")
        document.getElementById("ctn_fs").classList.add("hidden")
        document.getElementById("ctn_github").classList.remove("hidden")
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
            document.getElementById("song").classList.remove("hidden")
            data.items.forEach(d => {
                document.getElementById('youtubes').innerHTML += '<iframe id="ytplayer" type="text/html" width="640" height="360" src="https://www.youtube.com/embed/' + d.id.videoId + '" frameborder="0"></iframe>'
            })
        }).catch(r => {

        })
}
