# Are You a Robot?

A fake CAPTCHA that starts like boring identity verification and slowly becomes a suspicious little internet game.

![Are You a Robot gameplay](public/readme-hero.png)

## Play

**[Launch the live demo](https://are-you-a-robot-six.vercel.app)**

No account, backend, or setup required. Open the page, check the box, and try not to lose all five hearts.

## What You Do

Are You a Robot? is a 34-level browser game inspired by the bureaucratic confidence of CAPTCHA widgets and the playful escalation of Neal.fun-style projects. Each screen asks for one small proof of humanity, but the proofs get less reasonable as the test continues.

## Features

- 34 handcrafted mini-games, not a generic quiz template
- reCAPTCHA-style image selection, timing, memory, drawing, parking, hidden-button, and text puzzles
- A five-heart health bar that takes damage on every wrong answer
- A game-over scene where the verification robot points you toward the exit
- LocalStorage progress, health, and error persistence
- A final copyable “Provisional Humanity Notice”
- Secret Konami-code skip button for testing and chaos

## Quick Start

For most people:

```text
Open https://are-you-a-robot-six.vercel.app
```

For local development:

```bash
npm install
npm run dev
```

Then open `http://127.0.0.1:5173`.

## Verify Locally

Requires Node.js 20 or newer.

```bash
npm run build
npm run lint
```

## How It Works

The game is built as a collection of self-contained React level components. Each level owns its own interaction model: pointer tracking, keyboard movement, canvas drawing, timers, memory, and puzzle-specific failure logic all live inside the level that needs them.

The app is frontend-only. Saves are stored in `localStorage`; Vercel serves the static build. Framer Motion handles screen transitions, while the more physical moments, like the health bar, blackout flashlight, and ejection scene, are CSS-driven.

## Project Structure

```text
src/App.tsx       Progression, health, persistence, certificate, and game-over flow
src/levels.tsx    The 34 level components and level registry
src/App.css       CAPTCHA styling, level visuals, and animation work
public/levels/    Photos, sprites, generated puzzle images, and other assets
```

## Credits

- Built with [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), and [Framer Motion](https://motion.dev/)
- Inspired by [Neal.fun](https://neal.fun/) and the familiar shape of CAPTCHA widgets
- Traffic, bicycle, bus, hydrant, bench, and duck photos from [LoremFlickr](https://loremflickr.com/)
- Fruit and chair illustrations from [OpenMoji](https://openmoji.org/)
- Eye illustration from [Openclipart](https://openclipart.org/)
- reCAPTCHA-style badge from [Wikimedia Commons](https://commons.wikimedia.org/)

## Disclaimer

This is a parody project. It is not affiliated with Google, reCAPTCHA, Neal.fun, or any department legally authorized to determine whether you are a person.
