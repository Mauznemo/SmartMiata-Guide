// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import { themes as prismThemes } from "prism-react-renderer";

/** @type {import('@docusaurus/types').Config} */
const config = {
    title: "Smart Miata Preview",
    tagline: "A Miata as modern as any new car!",
    favicon: "img/favicon.ico",

    // Set the production url of your site here
    url: "https://miata.smartify-os.com",
    // Set the /<baseUrl>/ pathname under which your site is served
    // For GitHub pages deployment, it is often '/<projectName>/'
    baseUrl: "/",

    // GitHub pages deployment config.
    // If you aren't using GitHub pages, you don't need these.
    organizationName: "Mauznemo", // Usually your GitHub org/user name.
    projectName: "SmartMiata-Guide", // Usually your repo name.

    onBrokenLinks: "throw",
    onBrokenMarkdownLinks: "warn",

    // Even if you don't use internationalization, you can use this field to set
    // useful metadata like html lang. For example, if your site is Chinese, you
    // may want to replace "en" with "zh-Hans".
    i18n: {
        defaultLocale: "en",
        locales: ["en"],
    },

    plugins: ["plugin-image-zoom"],

    presets: [
        [
            "classic",
            /** @type {import('@docusaurus/preset-classic').Options} */
            ({
                docs: {
                    sidebarPath: "./sidebars.js",
                    // Please change this to your repo.
                    // Remove this to remove the "edit this page" links.
                    editUrl:
                        "https://github.com/Mauznemo/SmartMiata-Guide/tree/main/",
                },
                /*blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },*/
                theme: {
                    customCss: "./src/css/custom.css",
                },
            }),
        ],
    ],

    themeConfig:
        /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
        ({
            metadata: [{ name: "darkreader-lock" }],
            imageZoom: {
                // CSS selector to apply the plugin to, defaults to '.markdown img'
                selector: ".markdown :not(em) > img",
                // Optional medium-zoom options
                // see: https://www.npmjs.com/package/medium-zoom#options
                options: {
                    margin: 80,
                    background: "#383838",
                    scrollOffset: 250,
                },
            },
            colorMode: {
                defaultMode: "dark",
                disableSwitch: true,
                respectPrefersColorScheme: false,
            },
            // Replace with your project's social card
            image: "img/docusaurus-social-card.jpg",
            navbar: {
                title: "Smart Miata Guide (Preview)",
                logo: {
                    alt: "Smart Miata Logo",
                    src: "img/logo.png",
                },
                items: [
                    {
                        type: "docSidebar",
                        sidebarId: "tutorialSidebar",
                        position: "left",
                        label: "Intro",
                    },
                    //{to: '/blog', label: 'Blog', position: 'left'},
                    {
                        href: "https://www.paypal.com/donate/?hosted_button_id=BSPF2HUZRP7AN",
                        label: "Support Me",
                        position: "right",
                    },
                ],
            },
            footer: {
                style: "dark",
                links: [
                    {
                        title: "Docs",
                        items: [
                            {
                                label: "Intro",
                                to: "/docs/intro",
                            },
                        ],
                    },
                    {
                        title: "Community",
                        items: [
                            {
                                label: "Discord",
                                href: "https://discord.gg/dYf8zrVUHt",
                            },
                            {
                                label: "Instagram",
                                href: "https://www.instagram.com/smart_miata/",
                            },
                        ],
                    },
                    {
                        title: "More",
                        items: [
                            {
                                label: "Donate",
                                href: "https://www.paypal.com/donate/?hosted_button_id=BSPF2HUZRP7AN",
                            },
                            {
                                label: "GitHub Sponsor",
                                href: "https://github.com/sponsors/Mauznemo",
                            },
                        ],
                    },
                ],
                copyright: `Copyright © ${new Date().getFullYear()} Smart Miata, smartify-os.com`,
            },
            prism: {
                theme: prismThemes.github,
                darkTheme: prismThemes.dracula,
                additionalLanguages: ["csharp"],
            },
        }),
};

export default config;
