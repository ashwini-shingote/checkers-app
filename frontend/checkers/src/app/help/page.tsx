export default function Rules() {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4 text-center">Checkers Game Rules 🤔</h1>
        <p className="mb-4">Checkers is a classic board game that requires strategy and tactics. Here are the basic rules:</p>
        <ul className="list-disc list-inside space-y-3 mb-10">
          <li>The game is played on an 8x8 board with each player starting with 12 pieces.</li>
          <li>Black moves first, and players alternate turns.</li>
          <li>Players take turns to move their pieces diagonally forward to an adjacent unoccupied black tile.</li>
          <li>If an opponent's piece can be captured by jumping over it to an empty square beyond, the jump must be made.</li>
          <li>When a piece reaches the farthest row from the player controlling that piece, it is crowned and becomes a king.</li>
          <li>Kings can move both forward and backward diagonally and may combine jumps in several directions–forward and backward–on the same turn.</li>
        </ul>
        <h1 className="text-3xl font-bold mb-4 text-center">Win Conditions 👑</h1>
        <ul className="list-disc list-inside space-y-3">
          <li>The player who captures all of the opponent's pieces wins the game.</li>
          <li>If a player cannot make a move, they lose the game.</li>
        </ul>
      </div>
    );
}