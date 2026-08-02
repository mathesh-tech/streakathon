import { LeaderboardService } from "./server/services/leaderboard.service";

async function main() {
  try {
    const res = await LeaderboardService.getTimeframeLeaderboard(new Date("2020-01-01"), new Date(), 10);
    console.log(res);
  } catch (err) {
    console.error("ERROR:");
    console.error(err);
  }
}
main();
