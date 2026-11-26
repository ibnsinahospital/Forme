# Forshizu (Shizu)

A two-person couples app: quiz games (normal + spicy), Ludo, Watch Together, private chat with pop-up messages.
Static files + Firebase Firestore. Open `index.html` from any web host (needs https).

## Files
- `index.html` – login, pairing, lobby, quiz games, chat page
- `ludo.html` – Ludo with built-in mini chat
- `games.html` – game hub (cards for every game, join banner when your partner opens one)
- `play.html` + `games.js` – shared engine + the games: 22 games: Tic-Tac-Toe, Connect Four, Rock Paper Scissors, Memory Match, Snakes & Ladders, Truth or Dare (normal + spicy), How Well Do You Know Me?, Draw & Guess, Dots & Boxes, Mancala, Reversi, Checkers, Battleship, Wordle Duel, Hangman, 20 Questions, Gomoku, Would You Rather, Love Dice, Date Roulette, Pig Dice, Mastermind
- `watch.html` – Watch Together with built-in mini chat
- `chat.js` – shared message pop-ups + compact chat panel
- `questions.js` – built-in question bank: normal (60), spicy (120) and extra spicy (90)
- `firestore.rules` – database rules (replace test mode)

## Setup
1. In `index.html` set `ALLOWED_USERS = ['name1','name2']` (lowercase) so only the two of you can sign up.
2. Firebase console > Firestore > Rules: paste `firestore.rules`, replace `REPLACE_USER1/2` with the same names, Publish.
3. Sign up both accounts, then pair them with each other's username or code (tap your code to copy it).
4. Questions: `QUESTION_SOURCE` in `index.html` is `'builtin'` (default). Use `'auto'` to try your Apps Script first, `'server'` for Apps Script only.

## Watch Together
Either of you pastes a link and taps Load; the other phone follows. Play, pause and seek stay in sync.
Works with YouTube, Vimeo, direct video / stream links (.mp4 .webm .m3u8) and your own file (📁, both pick the same file).
Netflix, Prime, Disney+ and similar sites cannot be embedded by any web app: open the page on both phones and use the shared countdown.

## Adding a game
Add an entry to `GAMES` in `games.js`: `{title, emoji, desc, init(first) -> state, view(state, A) -> status text}`. Use `A.act(fn)` for every move (it runs as a safe transaction), set `state.winner` to `'a'`, `'b'` or `'draw'` to show the winner screen. The hub, chat, popups and rematch come for free.

## Spice levels
Quiz games: tick **Enable Spicy Mode**, then optionally **🔥 Extra spicy (18+)**. Your partner is asked to confirm before joining.
Truth or Dare, Would You Rather and Love Dice have a Normal / Spicy / Extra switch that either of you can turn down at any time.
Extra spicy means very flirty and steamy, never explicit. Edit `questions.js` / `games.js` to change the content.
