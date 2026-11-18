# Changelog

All notable changes to FridgeChef. Versions match the git tags; each tagged release on GitHub
carries the Android APK.

## [1.2.0] - 2026-11-18

### Added
- "Indian food first" switch on the Fridge tab. When it is on, about three quarters of the
  suggestions are Indian dishes that suit your ingredients, listed first, followed by a few from
  other cuisines. Cloud AI gets the same instruction. A cuisine chosen in the filters still wins.
- 116 regional Indian dishes (927 recipes in total, 386 Indian). Every one of the 25 Indian
  cuisines now has at least ten dishes, with the biggest additions for Awadhi, Mughlai, Kashmiri,
  Bihari, Odia, Northeast Indian, Rajasthani, Sindhi, Parsi, Mangalorean, Chettinad, Andhra,
  Hyderabadi, Goan and Karnataka cooking. On-device model retrained.

## [1.1.0] - 2026-11-18

### Added
- Taste questions after sign-up: diet, favourite cuisines, how spicy, foods you love, foods to
  skip, cooking skill and time, goals, and a stack of real dishes to like or pass. The answers
  shape every recipe ranking and can be changed in Settings.
- The account survives a reinstall on the same phone: the Android app keeps a copy of the account
  and its data in Android backup and signs you straight back in.
- 99 everyday dishes (811 in total): breakfasts, quick lunches, simple dinners, snacks, sweets
  and drinks.
- Greeting with your cooking streak, dishes cooked and recipes saved on the Fridge tab.
- A celebration when you finish a dish, with a quick "how was it?" that teaches the taste model.
- Live demo on GitHub Pages, a Dockerfile, and this changelog.
- MIT license.

### Changed
- Every Android build is signed with the same key and has a higher version number, so updates
  install over the old app and keep your data. Remove an app installed from 1.0.0 once.
- Ripple and haptic feedback on every button, sliding tab transitions, frosted bars.

### Fixed
- The diet chosen in your profile was not applied to the recipe list after setup, and
  "Reset filters" dropped it.

## [1.0.0] - 2026-11-10

First release of the redesigned app.

### Added
- Material 3 (Material You) interface for Android and the web, with a colour picker that re-tints
  the whole app.
- Android app built with Capacitor; a debug APK is built on every push.
- On-device recipe model trained on 712 recipes from 82 Indian and world cuisines. Works offline
  and composes recipes for pantries the corpus does not cover.
- Bring your own AI key (Gemini, OpenAI, Anthropic, Groq, OpenRouter and others). Keys stay on
  the device.
- On-device account, kept until you sign out.
- Camera or gallery fridge photo, kept until you replace it.
- Detailed beginner-friendly cooking steps with heat levels, timers and "done when" cues.
- Kitchen basics (salt, oil, common spices) assumed at home, with a way to report one missing.

### Fixed
- Gemini errors with a valid key: the app now falls back to another model on the same key,
  no longer cuts answers off, and shows plain-language errors.

[1.2.0]: https://github.com/theflighttechofficial/FridgeChef-AI/releases/tag/v1.2.0
[1.1.0]: https://github.com/theflighttechofficial/FridgeChef-AI/releases/tag/v1.1.0
[1.0.0]: https://github.com/theflighttechofficial/FridgeChef-AI/tree/52cbf7234ca95dfe6256e887928b995f815a14ef
