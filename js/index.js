let url = `https://estsoft-openai-api.jejucodingcamp.workers.dev/`
let $how_cr = document.getElementById('how_cr')
let $how_tfl = document.getElementById('how_tfl')
let $ttaCode = document.getElementById("txtareaCode")
let $ttaLyrics = document.getElementById("txtareaLyrics")
const lang = {
    howto_codereview: {
        "English": "Please send the source code and wait while the AI writes the code review. It takes about 20 to 30 seconds.",
        "Spanish": "Envíe el código fuente y espere mientras la IA escribe la revisión del código. Se tarda unos 20 a 30 segundos.",
        "French": "Veuillez envoyer le code source et patienter pendant que l'IA écrit la révision du code. Cela prend environ 20 à 30 secondes.",
        "Korean": "소스 코드를 전송하고 AI가 코드리뷰를 작성하는 동안 기다려주세요. 약 20초 ~ 30초 정도가 소요됩니다.",
        "Japannese": "ソースコードを送信し、AI がコードレビューを作成するまでお待ちください。 20～30秒ほどかかります。"
    },
    howto_titlefromlyrics: {
        "English": "Please send the lyrics and wait while the AI search the song title. It takes about 20 to 30 seconds.",
        "Spanish": "Envíe la letra y espere mientras la IA busca el título de la canción. Se tarda unos 20 a 30 segundos.",
        "French": "Veuillez envoyer les paroles et patienter pendant que l'IA recherche le titre de la chanson. Cela prend environ 20 à 30 secondes.",
        "Korean": "가사를 전송하고 AI가 노래 제목을 검색하는 동안 기다려주세요. 약 20초 ~ 30초 정도가 소요됩니다.",
        "Japannese": "歌詞を送信し、AIが曲名を検索するまでお待ちください。 20～30秒ほどかかります。"
    }
}
const sample = {
    code: `using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.Extensions.Options;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();

builder.Services.AddAuthentication(options =>
{
    options.DefaultScheme = CookieScheme.Name;
    //options.DefaultAuthenticateScheme = CookieScheme.Name; // 인증 스키마
    //options.DefaultChallengeScheme = CookieScheme.Name; // 도전 스키마
}).AddCookie(CookieScheme.Name, options =>
{
    options.AccessDeniedPath = "/account/denied";
    options.LoginPath = "/account/login";
});

builder.Services.AddSingleton<IConfigureOptions<CookieAuthenticationOptions>, CookieLogin.ConfigureMyCookie>();
builder.Services.AddSingleton<MyService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();`,
    lyrics: {
        "English": "Fiesta nae maeume taeyangeul kkuk samginchae yeongwontorok",
        "Spanish": `I’m your man I’m your man
geudaeyeo ddaradadda oneuldo
naneun oneuldo geudaeman saenggakhae`,
        "French": `neon sugar free ije neon sugar free naegeman sugar free modeunge sugar free neoneun galsurok wae ireoke gaseumeul apeuge haeyo ireoke apeugeman hae dalkomhameul ireobeorin`,
        "Korean": `이렇게 난 또 (fiction in fiction)
잊지 못하고 (fiction in fiction)
내 가슴 속에 끝나지 않을 이야길 쓰고 있어`,
        "Japannese": ``
    }
}
$how_cr.innerText = lang.howto_codereview[document.getElementsByName("btn_language")[0].getAttribute("value")]
$how_tfl.innerText = lang.howto_titlefromlyrics[document.getElementsByName("btn_language")[0].getAttribute("value")]
$ttaCode.value = sample.code
$ttaLyrics.value = sample.lyrics[document.getElementsByName("btn_language")[0].getAttribute("value")]
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

document.getElementById('buttonSend').addEventListener('click', e => {
    e.preventDefault()
    $Loading.show()
    let code = $ttaCode.value
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
            document.getElementById('review').innerHTML = str
            hljs.highlightAll()
            $Loading.hide()
        })
})

document.getElementById('btnTfL').addEventListener('click', e => {
    e.preventDefault()
    document.getElementById("song").classList.add("hidden")
    $Loading.show()
    let lyrics = $ttaLyrics.value
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
                document.getElementById('singer-title').innerText = ""
                document.getElementById('youtubes').innerHTML = ""
                let found = JSON.parse(found1[0])
                console.log(found)
                document.getElementById('singer-title').innerText = found["singer_name"] + " - " + found["song_title"]

                // 1. Load the JavaScript client library.
                const q = found["singer_name"] + " " + found["song_title"]
                gapi.load('client', () => start(q));
            } else {
                if (found2) {
                    document.getElementById('singer-title').innerText = ""
                    document.getElementById('youtubes').innerHTML = ""
                    let found = found2[1]
                    console.log(found)
                    document.getElementById('singer-title').innerText = found["song_title"]

                    // 1. Load the JavaScript client library.
                    const q = "song " + found["song_title"]
                    gapi.load('client', () => start(q));
                } else {
                    document.getElementById('song').innerHTML = "<p>" + str + "</p>"
                }
            }
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
        document.getElementById("containerTitlefromLyrics").classList.add("hidden")
        document.getElementById("containerGithub").classList.add("hidden")
    })
})

// banner Title from Lyrics button click event
document.getElementsByName("menuTitleFromLyrics").forEach(element => {
    element.addEventListener("click", event => {
        event.preventDefault()
        reset_banner()
        document.getElementById("containerCodeReview").classList.add("hidden")
        document.getElementById("containerTitlefromLyrics").classList.remove("hidden")
        document.getElementById("containerGithub").classList.add("hidden")
    })
})

// Github button click event
document.getElementsByName("menuGithub").forEach(element => {
    element.addEventListener("click", event => {
        event.preventDefault()
        reset_banner()
        document.getElementById("containerCodeReview").classList.add("hidden")
        document.getElementById("containerTitlefromLyrics").classList.add("hidden")
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
        $how_cr.innerText = lang.howto_codereview[element.getAttribute("value")]
        $how_tfl.innerText = lang.howto_titlefromlyrics[element.getAttribute("value")]
        $ttaLyrics.value = sample.lyrics[element.getAttribute("value")]
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
function reset_banner() {
    document.getElementById("banner_menu").classList.add("hidden")
    document.getElementById("banner_language").classList.add("hidden")
}

function start(q) {
    console.log("start.q", q)
    // 2. Initialize the JavaScript client library.
    gapi.client.init({
        'apiKey': 'AIzaSyCngJ3dYg5z4nBH8vjmpopmjl7EWCv2bdM',
        part: 'snippet',
    }).then(function () {
        // 3. Initialize and make the API request.
        return gapi.client.request({
            'path': 'https://www.googleapis.com/youtube/v3/search?q=' + q,
        })
    }).then(function (response) {
        console.log(response.result);
        const data = response.result
        document.getElementById("song").classList.remove("hidden")
        data.items.forEach(d => {
            document.getElementById('youtubes').innerHTML += '<iframe id="ytplayer" type="text/html" width="640" height="360" src="https://www.youtube.com/embed/' + d.id.videoId + '" frameborder="0"></iframe>'
        })
    }, function (reason) {
        $Loading.hide()
        console.log('Error: ' + reason.result.error.message);
        alert("No data found on Youtube. Try again.");
    });
};
