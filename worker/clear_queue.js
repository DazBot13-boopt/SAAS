const { Queue } = require('bullmq');
const IORedis = require('ioredis');

async function clearQueue() {
    const redis = new IORedis('redis://127.0.0.1:6379', { maxRetriesPerRequest: null });
    const queue = new Queue('twitter-actions', { connection: redis });
    
    try {
        await queue.obliterate({ force: true });
        console.log('✅ File d\'attente vidée avec succès!');
        console.log('Les nouveaux jobs utiliseront la configuration OnlyFans/Adulte.');
    } catch (error) {
        console.error('❌ Erreur:', error.message);
    } finally {
        await redis.quit();
    }
}

clearQueue();
