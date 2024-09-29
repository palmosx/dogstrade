const TelegramBot = require('node-telegram-bot-api');

// Создаем бота с токеном
const bot = new TelegramBot('7761005309:AAF_fOW8cc-5S5QtaBk4U0kIOODoxP2LtdA', { polling: true });

// Адрес твоего Telegram Wallet
const walletAddress = "UQDmdSJTY1U-Ms9HSr9zHeIGCCuaoR96RmpVUe1kQFDtTPlG";

// URL WebApp (замени на свой URL, который ты получил на Replit)
const webAppUrl = 'https://palmosx.github.io/dogstrade/';

// Отправляем кнопку с WebApp, когда пользователь вводит команду /start
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;

    bot.sendMessage(chatId, 'Welcome! Click the button below to open WebApp:', {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Open WebApp', web_app: { url: webAppUrl } }
                ]
            ]
        }
    });
});

// Обработка данных, полученных из WebApp
bot.on('message', (msg) => {
    const chatId = msg.chat.id;

    // Проверяем, если сообщение содержит данные от WebApp
    if (msg.web_app_data) {
        const data = JSON.parse(msg.web_app_data.data);
        const amount = data.amount;

        if (amount <= 0) {
            bot.sendMessage(chatId, "Please enter a valid amount of DOGS.");
            return;
        }

        // Генерируем ссылку для оплаты в Telegram Wallet
        const walletLink = `https://t.me/wallet?send=${walletAddress}&amount=${amount}&currency=DOGS`;

        // Отправляем пользователю сообщение с ссылкой на оплату
        bot.sendMessage(chatId, `Please complete the payment by following the link: [Pay DOGS](${walletLink})`, { parse_mode: 'Markdown' });
    }
});

// Обрабатываем успешные платежи (если Telegram предоставляет такую информацию)
bot.on('successful_payment', (msg) => {
    const chatId = msg.chat.id;
    const fromWallet = msg.successful_payment.order_info.name || msg.successful_payment.order_info.phone_number;

    // Отправляем тебе сообщение с номером кошелька пользователя
    bot.sendMessage('YOUR_CHAT_ID', `Payment received from wallet: ${fromWallet}`);
});

// Обрабатываем команды /help
bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id;

    // Отправляем сообщение с информацией о том, как использовать бота
    bot.sendMessage(chatId, "To sell DOGS, please enter the amount you want to sell.");
});
