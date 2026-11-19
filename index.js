const mineflayer = require('mineflayer');
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder');
const express = require('express');

const app = express();
app.get('/', (req, res) => res.send('Smart Bot is Online 24/7!'));
app.listen(process.env.PORT || 3000);

const CONFIG = {
  host: '91.197.6.134',
  port: 26776,
  username: 'ProPlayer99',
  version: '1.20.4',
  password: 'Password123'
};

function startSmartBot() {
  const bot = mineflayer.createBot({
    host: CONFIG.host,
    port: CONFIG.port,
    username: CONFIG.username,
    version: CONFIG.version
  });

  bot.loadPlugin(pathfinder);

  bot.once('spawn', () => {
    console.log('✅ دخل البوت الذكي إلى السيرفر بنجاح!');

    setTimeout(() => {
      bot.chat(`/register ${CONFIG.password} ${CONFIG.password}`);
      bot.chat(`/login ${CONFIG.password}`);
    }, 3000);

    const movements = new Movements(bot);
    movements.canDig = false;
    bot.pathfinder.setMovements(movements);

    setInterval(() => {
      if (!bot.entity) return;
      const dx = (Math.random() * 12) - 6;
      const dz = (Math.random() * 12) - 6;
      const targetX = bot.entity.position.x + dx;
      const targetZ = bot.entity.position.z + dz;

      bot.pathfinder.setGoal(new goals.GoalNear(targetX, bot.entity.position.y, targetZ, 1));
      bot.look(Math.random() * Math.PI * 2, (Math.random() - 0.5) * 0.5);
      if (Math.random() > 0.5) bot.swingArm();
      if (Math.random() > 0.6) {
        bot.setControlState('jump', true);
        setTimeout(() => bot.setControlState('jump', false), 400);
      }
    }, 12000);
  });

  bot.on('chat', (username, message) => {
    if (username === bot.username) return;
    const msg = message.toLowerCase();

    if (msg.includes('سلام') || msg.includes('هلا') || msg.includes('hi')) {
      setTimeout(() => bot.chat(`وعليكم السلام هلا ${username}!`), 2000);
    } else if (msg.includes(CONFIG.username.toLowerCase())) {
      setTimeout(() => bot.chat(`نعم ${username}؟ أنا موجود بالسيرفر!`), 2000);
    }
  });

  bot.on('end', () => {
    console.log('⚠️ انقطع الاتصال، جاري العودة خلال 10 ثوانٍ...');
    setTimeout(startSmartBot, 10000);
  });

  bot.on('error', (err) => console.log('❌ خطأ:', err.message));
}

startSmartBot();
