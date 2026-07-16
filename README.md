# Ибрагим Курайши — сайт-резюме

Одностраничный сайт-резюме: Project Manager · Performance Marketing.
Чистый HTML/CSS/JS без сборки — открывается напрямую, хостится на GitHub Pages.

## Как включить GitHub Pages

1. Откройте репозиторий на GitHub → **Settings** → **Pages**
2. В блоке **Build and deployment** выберите Source: **Deploy from a branch**
3. Branch: `main` (после мержа этой ветки), папка `/ (root)` → **Save**
4. Через 1–2 минуты сайт будет доступен по адресу
   `https://ibrakyraishi-art.github.io/rezume/`

## Как заменить/добавить фотографию

Положите файл с фото в `assets/photo.jpg` (JPEG, лучше вертикальное 4:5,
от 800px по ширине). Сайт подхватит его автоматически:
появится halftone-эффект, а при наведении — цветное фото.
Пока файла нет, показывается процедурная halftone-заглушка.

## Структура

```
index.html   — вся страница
css/style.css — стили (швейцарская типографика, адаптив)
js/main.js    — эффекты: прелоадер, reveal, счётчики, halftone, дашборд
assets/       — PDF резюме и фото
```
