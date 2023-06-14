const Loading = {
    show : () => document.getElementById("loadingscreen").classList.remove("hidden"),
    hide : () => document.getElementById("loadingscreen").classList.add("hidden")
}

export { Loading }