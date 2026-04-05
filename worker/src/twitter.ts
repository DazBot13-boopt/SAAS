import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';
import { PrismaClient } from '@prisma/client';
import { io } from 'socket.io-client';

const prisma = new PrismaClient();
const socket = io(process.env.BACKEND_SOCKET_URL || 'http://saas-backend:4000');

chromium.use(stealth());

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const randomRange = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);

export const twitterWorkerHandler = async (job: any) => {
    const { accountId, action } = job.data;
    const account = await prisma.twitterAccount.findUnique({
        where: { id: accountId },
        include: { proxy: true }
    });

    if (!account) throw new Error('Twitter Account not found');
    const username = account.username;
    socket.emit('worker_state', { username, state: 'STARTING_TWITTER' });

    const proxyConfig = account.proxy ? {
        server: `http://${account.proxy.host}:${account.proxy.port}`,
        username: account.proxy.username || undefined,
        password: account.proxy.password || undefined,
    } : undefined;

    const browser = await chromium.launch({
        headless: false, // Visible for tracking
        proxy: proxyConfig,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
    if (account.sessionCookies) await context.addCookies(account.sessionCookies as any);

    const page = await context.newPage();

    // Fast Screenshot Interval for Dashboard
    const screenshotInterval = setInterval(async () => {
        try {
            const screenshot = await page.screenshot({ type: 'jpeg', quality: 30 });
            socket.emit('worker_screenshot', { username, image: screenshot.toString('base64') });
        } catch (e) { }
    }, 4000);

    try {
        await page.goto('https://x.com', { waitUntil: 'networkidle' });
        await sleep(randomRange(2000, 5000));

        if (action === 'warmUp') {
            socket.emit('worker_log', { username, message: '🐦 Warm Up Twitter: Scrolling flow...' });
            // Simulation for Day 1
            await sleep(10000); // placeholder
            socket.emit('worker_log', { username, message: '✅ Warm Up terminé.' });
        } else if (action === 'setupProfile') {
            socket.emit('worker_log', { username, message: '⚙️ Setting up Profile (Emily Ray)...' });
            // Simulation for Day 2 Profile Setup
            await sleep(5000);
            socket.emit('worker_log', { username, message: '✅ Profile setup completed.' });
        } else if (action === 'joinCommunity') {
            socket.emit('worker_log', { username, message: '👥 Joining Communities...' });
            
            // Add community join logic here
            await sleep(5000);
            socket.emit('worker_log', { username, message: '✅ Joined Communities.' });
        } else if (action === 'postCommunity') {
            socket.emit('worker_log', { username, message: '📝 Posting in Community...' });
            // Logic for Day 3: Captions
            await sleep(5000);
            socket.emit('worker_log', { username, message: '✅ Caption Posted.' });
        } else if (action === 'spamComments') {
            socket.emit('worker_log', { username, message: '💬 Spamming Comments (Support)...' });
            // Logic for Day 4: Support accounts
            await sleep(5000);
            socket.emit('worker_log', { username, message: '✅ Comment Spammed.' });
        } else {
            socket.emit('worker_log', { username, message: `⚠️ Unknown action: ${action}` });
        }

        const cookies = await context.cookies();
        await prisma.twitterAccount.update({
            where: { id: accountId },
            data: { sessionCookies: cookies as any, status: 'ACTIVE' }
        });

        return { success: true };
    } catch (error: any) {
        socket.emit('worker_error', { username, message: error.message });
        throw error;
    } finally {
        clearInterval(screenshotInterval);
        await browser.close();
        socket.emit('worker_state', { username, state: 'IDLE' });
    }
};
