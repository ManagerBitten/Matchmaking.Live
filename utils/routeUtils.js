const DOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const window = new JSDOM('').window;
const dompurify = DOMPurify(window);
const puppeteer = require('puppeteer');

exports.createLabelHTMLContent = async (receiver, shippingInfo, barcodeImage) => {
    const cssStyles = await fs.readFile(path.join(__dirname, '..', 'public', 'styles', 'label-styles.css'), 'utf8');
    let templateStr = await fs.readFile(path.join(__dirname, '..', 'public', 'label-template.html'), 'utf8');

    templateStr = templateStr.replace('${style}', `<style>${cssStyles}</style>`);

    const senderInfo = await getSenderInformation();

    const data = {
        sender: senderInfo,
        receiver: receiver.toObject(),
        shippingInfo: shippingInfo.toObject(), 
        barcodeImage: barcodeImage.toString('base64')
    };

    let htmlWithStyles = interpolate(templateStr, data);
    return sanitizeHTML(htmlWithStyles);
};

exports.createPDF = async (htmlContent) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(htmlContent);
    const pdfBuffer = await page.pdf({ format: 'A4' });
    await browser.close();
    return pdfBuffer;
};

exports.fetchDiscord = async (discordId) => {
    const res = await fetch(`https://canary.discord.com/api/v10/users/${discordId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bot ${process.env.TOKEN}`,
        },
    });
    
    const account = await res.json()

    if (account.message) return json;
    
    let publicFlags = [];

    let premiumTypes = {
        0: "None",
        1: "Nitro Classic",
        2: "Nitro",
        3: "Nitro Basic"
    }

    exports.USER_FLAGS.forEach((flag) => {
        if (account.public_flags & flag.bitwise) publicFlags.push(flag.flag);
    });

    let avatarLink = null;
    if (account.avatar)
        avatarLink = `https://cdn.discordapp.com/avatars/${account.id}/${account.avatar}`;

    let bannerLink = null;
    if (account.banner)
        bannerLink = `https://cdn.discordapp.com/banners/${account.id}/${account.banner}?size=480`;

    let output = {
        id: account.id,
        created_at: snowflakeToDate(account.id),
        username: account.username,
        avatar: {
            id: account.avatar,
            link: avatarLink,
            is_animated: account.avatar != null && account.avatar.startsWith("a_") ? true : false,
        },
        avatar_decoration: account.avatar_decoration_data,
        badges: publicFlags,
        premium_type: premiumTypes[account.premium_type],
        accent_color: account.accent_color,
        global_name: account.global_name,
        banner: {
            id: account.banner,
            link: bannerLink,
            is_animated: account.banner != null && account.banner.startsWith("a_") ? true : false,
            color: account.banner_color,
        },
        raw: account
    }

    return output;
}

exports.USER_FLAGS = [{
    flag: "DISCORD_EMPLOYEE",
    bitwise: 1 << 0
},
{
    flag: "PARTNERED_SERVER_OWNER",
    bitwise: 1 << 1
},
{
    flag: "HYPESQUAD_EVENTS",
    bitwise: 1 << 2
},
{
    flag: "BUGHUNTER_LEVEL_1",
    bitwise: 1 << 3
},
{
    flag: "HOUSE_BRAVERY",
    bitwise: 1 << 6
},
{
    flag: "HOUSE_BRILLIANCE",
    bitwise: 1 << 7
},
{
    flag: "HOUSE_BALANCE",
    bitwise: 1 << 8
},
{
    flag: "EARLY_SUPPORTER",
    bitwise: 1 << 9
},
{
    flag: "TEAM_USER",
    bitwise: 1 << 10
},
{
    flag: "BUGHUNTER_LEVEL_2",
    bitwise: 1 << 14
},
{
    flag: "VERIFIED_BOT",
    bitwise: 1 << 16
},
{
    flag: "EARLY_VERIFIED_BOT_DEVELOPER",
    bitwise: 1 << 17
},
{
    flag: "DISCORD_CERTIFIED_MODERATOR",
    bitwise: 1 << 18
},
{
    flag: "BOT_HTTP_INTERACTIONS",
    bitwise: 1 << 19
},
{
    flag: "SPAMMER",
    bitwise: 1 << 20
},
{
    flag: "ACTIVE_DEVELOPER",
    bitwise: 1 << 22
},
{
    flag: "QUARANTINED",
    bitwise: 17592186044416
}];

function interpolate(templateStr, dataObj) {
    return templateStr.replace(/\$\{([^}]+)\}/g, (match, propName) => {
        const properties = propName.split('.');
        let currentObject = dataObj;
        for (let property of properties) {
            currentObject = currentObject[property] || '';
        }
        return currentObject;
    });
}

function sanitizeHTML(content) {
    return dompurify.sanitize(content);
}

async function getSenderInformation() {
    const senderData = await fs.readFile('../JSON/sender.json', 'utf8');
    return JSON.parse(senderData);
}

function snowflakeToDate(id) {
    let temp = parseInt(id).toString(2);
    let length = 64 - temp.length;

    if (length > 0)
        for (let i = 0; i < length; i++)
            temp = "0" + temp;
    
    temp = temp.substring(0, 42)
    date = new Date(parseInt(temp, 2) + 1420070400000)

    return date;
}