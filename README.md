English | [简体中文](./README.zh-CN.md)

<div align="center">
<h1>site-status</h1>
<p>An online status panel based on UptimeRobot API</p>
<br />
<img src="https://img.shields.io/github/last-commit/imsyy/site-status" alt="last commit"/>
<img src="https://img.shields.io/github/languages/code-size/imsyy/site-status" alt="code size"/>
<img src="https://img.shields.io/github/stars/imsyy/site-status?style=full" alt="GitHub stars"/>
<img src="https://img.shields.io/github/forks/imsyy/site-status?style=full&color=orange" alt="GitHub followers"/>
<br />
<br />
<img src="https://s1.ax1x.com/2023/07/20/pCHnLLt.png" alt="demo"/>
</div>

## 👀 Demo

- [IMSYY-Site Monitoring](https://status.imsyy.top/)

## 🎉 Features

- 🌍 Multi-platform deployment support
- ✨ Elegant and smooth browsing experience
- 🔐 Supports site password encryption (JWT + Hash)
- 👀 Overall site status preview
- ⏲️ Data auto-refresh
- 📱 Mobile-friendly design

## Prerequisites

- You need to first add site monitors on [UptimeRobot](https://uptimerobot.com/dashboard) and get the `Read-Only API Key` from the `My Settings` or [API Management](https://dashboard.uptimerobot.com/integrations) page (Do not use the `Main API key`).
- You can also use `Monitor-specific API keys` for individual monitors.

## Deployment

### Cloudflare

This project is deployed by default using [Cloudflare Pages](https://pages.cloudflare.com/).

- `star` and `fork` this project 😘
- You can use the new [NuxtHub](https://hub.nuxt.com/) to quickly deploy this project. If you have experience deploying on Vercel, the process is quite similar. Alternatively, you can use [Cloudflare Pages](https://pages.cloudflare.com/) for deployment.
- Before moving on, make sure to configure the environment variables as detailed in the `.env.example` file. The `API_KEY` is a required field.
- If everything goes smoothly, you should be able to see the project’s main page.

### Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/imsyy/site-status)

- Click the button above to deploy.
- Add the following environment variables (important):

  | **Variable Name**   | **Value** |
  | ------------------- | --------- |
  | DEPLOYMENT_PLATFORM | auto      |
  | API_KEY             |           |

- All set!

### Other Hosting Platforms

For deployment guides, refer to the official documentation: [Deploying Nuxt Apps](https://nuxtjs.org.cn/deploy)

## Q & A

### How to Enable Site Encryption

Add the following environment variables: `SITE_PASSWORD` and `SITE_SECRET_KEY`. Both are required. The `SITE_PASSWORD` is the site password, and the `SITE_SECRET_KEY` is the encryption key, which you can choose freely.

## Thanks

- [uptime-status](https://github.com/yb/uptime-status) inspired this project
