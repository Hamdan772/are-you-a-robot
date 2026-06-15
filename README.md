# Are You a Robot?

A deadpan browser game where a routine CAPTCHA slowly becomes an unreasonable investigation into whether you are human enough.

![Are You a Robot gameplay](public/readme-hero.png)

## [Play the live game](https://are-you-a-robot-six.vercel.app)

Open the link, check the box, and follow the instructions. Mostly.

## Features

- 32 handcrafted verification challenges with unique interaction mechanics
- Image CAPTCHAs, memory tests, keyboard parking, drawing, timing, and visual puzzles
- A five-heart verification health bar that loses health on wrong answers
- A full game-over scene when the verification system asks you to leave
- Local progress and health persistence with no account or backend
- A secret Konami-code skip button
- A copyable provisional humanity certificate for anyone who survives

## Run Locally

Requires Node.js 20 or newer.

```bash
npm install
npm run dev
```

Open `http://127.0.0.1:5173`.

To verify a production build:

```bash
npm run build
npm run lint
```

## How It Works

Each challenge is its own React component rather than a question rendered
through a shared quiz template. That lets individual levels own their timing,
pointer behavior, keyboard controls, canvas drawing, and failure conditions.

The app has no backend. Progress, remaining health, and error count are stored
in `localStorage`. Framer Motion handles screen transitions, while the puzzle
interactions and game-over animation use React state and CSS.

## Project Structure

```text
src/App.tsx       Progression, health, persistence, ending, and game-over flow
src/levels.tsx    The 32 self-contained challenge components
src/App.css       CAPTCHA interface, puzzle styling, and animations
public/levels/    Photos, illustrations, and puzzle-specific visual assets
```

## Credits

- Built with [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), and [Framer Motion](https://motion.dev/)
- Inspired by the clean absurdity of [Neal.fun](https://neal.fun/) and the familiar language of CAPTCHA widgets
- Traffic, bicycle, bus, hydrant, bench, and duck photos from [LoremFlickr](https://loremflickr.com/)
- Fruit and chair illustrations from [OpenMoji](https://openmoji.org/)
- Eye illustration from [Openclipart](https://openclipart.org/)
- reCAPTCHA-style badge from [Wikimedia Commons](https://commons.wikimedia.org/)

This is a parody project. It is not affiliated with or endorsed by Google,
reCAPTCHA, Neal.fun, or any department qualified to determine humanity.
