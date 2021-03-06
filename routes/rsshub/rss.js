const axios = require('axios');
const cheerio = require('cheerio');
const config = require('../../config');

module.exports = async (ctx) => {
    const response = await axios({
        method: 'get',
        url: 'https://github.com/DIYgod/RSSHub/releases.atom',
        headers: {
            'User-Agent': config.ua,
            Referer: 'https://github.com/DIYgod/RSSHub',
        },
    });

    const data = response.data;

    const $ = cheerio.load(data, {
        xmlMode: true,
    });
    const list = $('entry');

    ctx.state.data = {
        title: 'RSSHub 有新的 RSS 支持',
        link: 'https://github.com/DIYgod/RSSHub',
        description: '使用 RSS 连接全世界',
        item:
            list &&
            list
                .map((index, item) => {
                    item = $(item);
                    return {
                        title: item.find('title').text(),
                        description: item.find('content').text(),
                        pubDate: item.find('updated').text(),
                        link: item.find('link').attr('href'),
                    };
                })
                .get(),
    };
};
