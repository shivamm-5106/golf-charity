const cron = require('node-cron');
const drawService = require('../src/modules/draw/service');

const initDrawJob = () => {
    // Run on the 1st of every month at midnight
    cron.schedule('0 0 1 * *', async () => {
        console.log('[Cron] Executing Monthly Draw...');
        try {
            const res = await drawService.executeMonthlyDraw();
            console.log(`[Cron] Draw executed successfully. Winners: ${res.winnersCount}`);
        } catch (error) {
            console.error('[Cron] Monthly Draw failed:', error.message);
        }
    });
    console.log('[Cron] Monthly draw background job registered.');
};

module.exports = initDrawJob;
