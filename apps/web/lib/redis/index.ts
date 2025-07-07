import { createClient, RedisClientType } from 'redis';

export const redisClient: RedisClientType = createClient({
    username: 'default',
    password: process.env.REDIS_PASSWORD || 'ocKFSBeLq79FoplCncwAOAS9qrBsk0Ns',
    socket: {
        host: process.env.REDIS_HOST || 'redis-13110.c89.us-east-1-3.ec2.redns.redis-cloud.com',
        port: Number(process.env.REDIS_PORT) || 13110
    }
});

redisClient.on('error', err => console.log('Redis Client Error', err));
redisClient.on('end', () => console.log('Redis connection closed'));

if (!redisClient.isOpen) {
    try {
        await redisClient.connect();
        console.log('Connected to Redis');
    } catch (error) {
        console.error('Failed to connect to Redis:', error);
    }
}

process.on('SIGINT', async () => {
    await redisClient.disconnect();
    process.exit(0);
});