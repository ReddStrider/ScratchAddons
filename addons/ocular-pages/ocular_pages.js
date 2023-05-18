export default async function ({ addon, console, msg }) {
    await addon.tab.loadScript(addon.self.lib + "/thirdparty/cs/tinycolor-min.js")

    //stolen and modified from another addon
    var username = document.querySelector("#profile-data > div.box-head > div > h2").innerText?.split("#")[0];

    var pageColor = ""
    var bottomColor = ""
    var linkColor = ""
    var hue = ""

    let comments;
    const page = document.getElementById("pagewrapper")

    //Thanks ChatGPT!
    const h4Elements = document.querySelectorAll('h4')

    for (const element of h4Elements) {
        if (element.innerText === 'Comments') {
            comments = element.parentNode.parentNode
            break
        }
    }

    async function OcularColor(username) {
        const response = await fetch(`https://my-ocular.jeffalo.net/api/user/${username}`)
        const data = await response.json()
        //console.log(data.color)
        return (data.color)
    }


    OcularColor(username)
        .then(color => {
            const hue = tinycolor(color).toHsl().h

            pageColor = tinycolor("#174082").toHsl()
            bottomColor = tinycolor("#12233d").toHsl()
            linkColor = tinycolor("#69a5ff").toHsl()

            pageColor.h = hue;
            bottomColor.h = hue - 10


            const pageColorHex = tinycolor(pageColor).toHexString()
            const bottomColorHex = tinycolor(bottomColor).toHexString()

            linkColor.h = (hue + 180) % 360

            const linkColorHex = tinycolor(linkColor).toHexString()

            if (color != undefined) {
                page.style.backgroundColor = pageColorHex
                comments.style.backgroundColor = bottomColorHex
                if (addon.settings.get("comp-link") == true) {
                    const linkStyle = document.createElement('style');
                    linkStyle.innerHTML = "a:not(:has(*)) { color: " + linkColorHex + " !important; } .button a { color: initial !important; } footer * { color: initial !important; }";
                    console.log(linkStyle);
                    document.head.appendChild(linkStyle);
                }
                console.log(addon.settings.get("comp-link"));
            }
        })
}