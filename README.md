# 📦 [Qv2ray](https://github.com/Qv2ray) release bot

Source code for Telegram bot [@Qvreleasebot](https://t.me/Qvreleasebot), which can fetch the latest release asset URL for Qv2ray related resources.

This is a highly opinionated project, still it can be configured for general use, especially for projects which make multi-platform releases.

## Setup

The following environment variables should be provided:

- `BOT_TOKEN`: Telegram bot token. [Click here](http://t.me/BotFather) to create a bot.
- `GH_TOKEN`: GitHub token with any scope (**you should grant none for security**). [Click here](https://github.com/settings/tokens/new?description=release-bot) to create one.

The following code should be modified to suit your needs:

- [Command regex](https://github.com/kidonng/qvrelease-bot/blob/2171714e5bec01ab854268be9891760d9fe21959/src/release.ts#L47)
- [Help text](https://github.com/kidonng/qvrelease-bot/blob/master/src/help.ts)
- [Assets data](https://github.com/kidonng/qvrelease-bot/blob/master/src/data.ts)

### Using [Vercel](http://vercel.com/) and Webhooks (recommended)

1. Configure the environment variables in [`vercel.json`](vercel.json).
2. [Deploy to Vercel](https://vercel.com/import/project?template=http://github.com/kidonng/qvrelease-bot).
3. [Set up the Webhook](https://core.telegram.org/bots/api#setwebhook): `https://api.telegram.org/bot<token>/setWebhook?url=<url>` (**Make sure to use a private URL!**)

### Using polling

1. Configure the environment variables.
2. Run `src/index.ts` to launch the bot.
