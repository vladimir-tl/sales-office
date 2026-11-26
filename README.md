# sales-office

## Скрипты

| Команда                | Что делает                                                                          |
| ---------------------- | ----------------------------------------------------------------------------------- |
| `npm run dev`          | Dev-сервер Astro для разработки                                                     |
| `npm run test:server`  | Запускает приложение локально на `http://localhost:4322` для тестов (так делает CI) |
| `npm run test:install` | Ставит Chromium для Playwright                                                      |
| `npm run test:login`   | Тесты страницы логина (`@login`)                                                    |
| `npm test`             | Все Playwright-тесты                                                                |
| `npm run format:check` | Проверка форматирования Prettier                                                    |

## Тесты локально, как в CI

CI (`.github/workflows/testing-pipeline.yml`) поднимает приложение командой `npm run test:server` и прогоняет тесты на `localhost:4322`. Чтобы повторить у себя:

```sh
npm run test:install   # один раз
npm run test:server    # терминал 1: приложение на порту 4322
npm run test:login     # терминал 2: тесты
```

Порт фиксированный (`--strictPort`): если 4322 занят, сервер не запустится, а не переедет на другой порт.
