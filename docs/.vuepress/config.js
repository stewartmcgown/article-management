module.exports = {
    dest: 'vuepress',
    locales: {
        '/': {
            lang: 'en-US',
            title: 'Article Management',
            description: 'Powerful article submission and editing workflow'
        }
    },
    head: [
        ['link', {
            rel: 'icon',
            href: `/logo.png`
        }],
        ['link', {
            rel: 'manifest',
            href: '/manifest.json'
        }],
        ['meta', {
            name: 'theme-color',
            content: '#3eaf7c'
        }],
        ['meta', {
            name: 'apple-mobile-web-app-capable',
            content: 'yes'
        }],
        ['meta', {
            name: 'apple-mobile-web-app-status-bar-style',
            content: 'black'
        }]
    ],
    serviceWorker: true,
    themeConfig: {
        repo: 'stewartmcgown/article-management',
        editLinks: true,
        docsDir: 'docs',
        docsBranch: '0.x',
        sidebarDepth: 3,
        displayAllHeaders: true,
        sidebar: 'auto',
        locales: {
            '/': {
                label: 'English',
                selectText: 'Languages',
                editLinkText: 'Edit this page on GitHub',
                lastUpdated: 'Last Updated',
                serviceWorker: {
                    updatePopup: {
                        message: "New content is available.",
                        buttonText: "Refresh"
                    }
                },
                nav: [{
                    text: 'Guide',
                    link: '/guide/',
                }],
                sidebar: [{
                        title: 'Guide',
                        collapsable: false,
                        children: [
                            '/guide/getting-started',
                            '/guide/authenticating',
                            '/guide/working-with-articles'
                        ]
                    },

                ],
            },
        }
    }
}

function genSidebarConfig(title) {
    return [{
        title,
        collapsable: false,
        children: [
            '',
            'getting-started',
            'basic-config',
            'assets',
            'markdown',
            'using-vue',
            'custom-themes',
            'i18n',
            'deploy'
        ]
    }]
}
