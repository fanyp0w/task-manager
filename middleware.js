// ЗАМЫКАНИЕ: createRateLimiter возвращает функцию.
// Переменная clients живёт внутри и не исчезает — она "замкнута".
const createRateLimiter = (maxRequests, windowMs) => {
  const clients = new Map(); // замкнута здесь

  return (req, res, next) => {
    const ip = req.ip;
    const now = Date.now();
    const client = clients.get(ip) ?? { count: 0, start: now };

    if (now - client.start > windowMs) {
      clients.set(ip, { count: 1, start: now });
      return next();
    }

    if (client.count >= maxRequests) {
      return res.status(429).json({ error: 'Слишком много запросов. Подождите.' });
    }

    client.count++;
    clients.set(ip, client);
    next();
  };
};

// ЗАМЫКАНИЕ: prefix захвачен для каждого логгера отдельно
const createLogger = (prefix) => {
  return (req, res, next) => {
    const time = new Date().toLocaleTimeString('ru-RU');
    console.log(`[${time}] [${prefix}] ${req.method} ${req.url}`);
    next();
  };
};

module.exports = { createRateLimiter, createLogger };
