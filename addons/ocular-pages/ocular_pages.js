export default async function ({ addon, console, msg }) {
    await addon.tab.loadScript(addon.self.lib + "/thirdparty/cs/tinycolor-min.js");

    //stolen and modified from another addon
    var username = document.querySelector("#profile-data > div.box-head > div > h2").innerText?.split("#")[0];

    var pageColor = "";
    var bottomColor = "";
    var linkColor = "";
    var replyColor = "";
    var hue = "";

    let comments;
    const page = document.getElementById("pagewrapper");

    //Thanks ChatGPT!
    const h4Elements = document.querySelectorAll('h4');

    for (const element of h4Elements) {
        if (element.innerText === 'Comments') {
            comments = element.parentNode.parentNode;
            break;
        }
    }

    async function OcularColor(username) {
        const response = await fetch(`https://my-ocular.jeffalo.net/api/user/${username}`);
        const data = await response.json();
        //console.log(data.color)
        return (data.color);
    }


    OcularColor(username)
        .then(color => {
            const color = tinycolor(color).toHsl();

            //pageColor = tinycolor("#0d3e8c").toHsl();
            //bottomColor = tinycolor("#153463").toHsl();
            //replyColor = tinycolor("#114799").toHsl();
            //linkColor = tinycolor("#3b79db").toHsl();

            pageColor = color;
            replyColor = color;
            bottomColor = color - 8;

            replyColor = tinycolor(replyColor).spin(5).toHexString();
            pageColor = tinycolor(pageColor).toHexString();
            bottomColor = tinycolor(bottomColor).toHexString();

            //linkColor.h = (hue + 180) % 360;

            linkColor.h = linkColor.spin(360)

            linkColor = tinycolor(linkColor).toHexString();

            if (color != undefined) {

                if (addon.settings.get("gradient") == false) {
                    page.style.backgroundColor = pageColor;
                    comments.style.backgroundColor = bottomColor;
                } else{
                    page.style= "background-image: linear-gradient("+pageColor+", "+tinycolor(pageColor).darken(20).spin(-5).toHexString()+");";
                    comments.style= "background-image: linear-gradient("+bottomColor+", "+tinycolor(bottomColor).darken(20).spin(10).toHexString()+");";
                }


                const moreRepStyle = document.createElement('style');
                moreRepStyle.innerHTML = " .more-replies{ background-color: " + bottomColor + " !important; box-shadow:  0px -20px 40px 50px " + bottomColor + " !important; } .more-replies span{ background-color: " + bottomColor + " !important; } .highlighted{ background-color:" + replyColor + " !important; box-shadow: none !important; padding: 5px !important; margin: 10px !important;}";
                document.head.appendChild(moreRepStyle);

                if (addon.settings.get("comp-link") == true) {
                    const linkStyle = document.createElement('style');
                    linkStyle.innerHTML = ".title a { color: " + linkColor + " !important; } .name a { color: " + linkColor + " !important; } .activity-stream li div a { color: " + linkColor + " !important; }";
                    //console.log(linkStyle);
                    document.head.appendChild(linkStyle);
                }
                //console.log(addon.settings.get("comp-link"));
            }
        })
}