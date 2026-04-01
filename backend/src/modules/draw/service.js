const repo = require('./repository');
const Score = require('../score/schema');
const { Winner } = require('./schema');

class DrawService {
    generateDrawNumbers() {
        const numbers = new Set();
        while (numbers.size < 5) {
            const randomNum = Math.floor(Math.random() * 45) + 1;
            numbers.add(randomNum);
        }
        return Array.from(numbers);
    }

    async executeMonthlyDraw() {
        const month = new Date().toISOString().slice(0, 7);

        const existing = await repo.getDrawByMonth(month);
        if (existing && existing.status === 'completed') {
            throw new Error('Draw already executed for this month.');
        }

        const totalPrizePool = 50000;

        let draw = existing;
        if (!draw) {
            draw = await repo.createDraw(month, totalPrizePool);
        }

        const drawnNumbers = this.generateDrawNumbers();

        const usersWithScores = await Score.aggregate([
            { $group: { _id: '$userId', scores: { $push: '$value' }, count: { $sum: 1 } } },
            { $match: { count: 5 } }
        ]);

        const drawRes = await repo.updateDraw(draw._id, {
            drawnNumbers,
            status: 'completed'
        });

        const matchTiers = { match5: [], match4: [], match3: [] };

        for (const user of usersWithScores) {
            let matchCount = 0;
            user.scores.forEach(s => {
                if (drawnNumbers.includes(s)) matchCount++;
            });

            if (matchCount === 5)      matchTiers.match5.push(user._id);
            else if (matchCount === 4) matchTiers.match4.push(user._id);
            else if (matchCount === 3) matchTiers.match3.push(user._id);
        }

        const calculatePrize = (percentage, count) => {
            if (count === 0) return 0;
            return ((totalPrizePool * percentage) / count).toFixed(2);
        };

        const prizes = {
            match5: calculatePrize(0.40, matchTiers.match5.length),
            match4: calculatePrize(0.35, matchTiers.match4.length),
            match3: calculatePrize(0.25, matchTiers.match3.length)
        };

        for (const uid of matchTiers.match5) {
            await repo.createWinner({ userId: uid, drawId: drawRes._id, matchCount: 5, prizeAmount: prizes.match5 });
        }
        for (const uid of matchTiers.match4) {
            await repo.createWinner({ userId: uid, drawId: drawRes._id, matchCount: 4, prizeAmount: prizes.match4 });
        }
        for (const uid of matchTiers.match3) {
            await repo.createWinner({ userId: uid, drawId: drawRes._id, matchCount: 3, prizeAmount: prizes.match3 });
        }

        return {
            drawId: drawRes._id,
            numbers: drawnNumbers,
            winnersCount: matchTiers.match5.length + matchTiers.match4.length + matchTiers.match3.length
        };
    }

    async getLatestDrawResults() {
        const month = new Date().toISOString().slice(0, 7);
        const draw = await repo.getDrawByMonth(month);
        if (!draw) return null;

        const winners = await repo.getWinnersByDraw(draw._id);
        return { draw, winners };
    }

    async submitWinnerProof(userId, drawId, proofUrl) {
        const winner = await Winner.findOne({ userId, drawId });

        if (!winner) throw new Error('No winning record found for this user in this draw.');

        winner.proofUrl = proofUrl;
        winner.status = 'pending';
        await winner.save();

        return winner;
    }
}

module.exports = new DrawService();
