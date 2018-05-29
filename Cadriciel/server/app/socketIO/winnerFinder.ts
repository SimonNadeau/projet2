interface Player {
    name: string;
    score: number;
}

export class WinnerFinder {

    public findWinner(players: Array<Player>): Player {
      let winner: Player = {
        name : "unkown",
        score: 0
      };

      for (const player of players) {

        if (player.score > winner.score) {
          winner = player;
        }

      }

      return winner;
    }
}
