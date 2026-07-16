# Ибрагим Курайши — сайт-резюме

Одностраничный сайт-резюме: Project Buyer (performance-маркетинг).
Собран по дизайн-макету (handoff): тёплый молочный фон `#f2f0ea`, чернила `#141414`,
рамки 1.5px, шрифты Oswald / JetBrains Mono / Manrope.
Чистый HTML/CSS/JS без сборки — открывается напрямую, хостится на GitHub Pages или Vercel.

## Как включить GitHub Pages

1. Откройте репозиторий на GitHub → **Settings** → **Pages**
2. В блоке **Build and deployment** выберите Source: **Deploy from a branch**
3. Branch: `main` (после мержа этой ветки), папка `/ (root)` → **Save**
4. Через 1–2 минуты сайт будет доступен по адресу
   `https://ibrakyraishi-art.github.io/rezume/`

## Как добавить фотографию

Положите файл с фото в `assets/photo.jpg` (JPEG, квадратное или близкое к 1:1,
от 800px). Сайт подхватит его автоматически и покажет в ч/б.
Пока файла нет, показывается заглушка с монограммой «ИК».

## Структура

```
index.html    — вся страница (10 секций по макету)
css/style.css — стили (токены макета, адаптив, reduced-motion)
js/main.js    — эффекты: по-буквенная анимация имени, reveal, счётчики,
                магнитная кнопка PDF, fallback фото
assets/       — resume.pdf (кнопка скачивания), photo.jpg (фото), icons/ (SVG брендов)
```
