# COVID-19 Data Visualization 📊

日本国内の COVID-19 感染状況を可視化する Web サイトです。都道府県別のデータや時系列データをグラフで分かりやすく表示します。

## 🌐 デモ

ライブサイト: [COVID-19 Data Visualization](https://covid19.teraren.com/)

<img width="1248" height="615" alt="image" src="https://github.com/user-attachments/assets/a258f634-c609-4d93-b10a-9c373289eba0" />

<img width="1131" height="742" alt="image" src="https://github.com/user-attachments/assets/462f54a0-b48f-4121-a97a-3f15bb9c10da" />


## 🚀 セットアップ

### リポジトリのクローン

```bash
git clone https://github.com/matsubo/covid19.git
cd covid19
```

### 依存関係のインストール

```bash
bun install
```

### 開発サーバーの起動

```bash
bun run dev
```

### ビルド

```bash
bun run build
```

## ✨ 機能

### 実装済み機能

- **都道府県別データ表示** - 各都道府県の COVID-19 感染状況を可視化
- **時系列データのグラフ化** - 感染者数の推移をチャートで表示
- **歴史的データアーカイブ** - 2020 年から 2022 年までの記事とデータ
- **レスポンシブデザイン** - モバイル・タブレット・デスクトップ対応
- **ダークモード** - ライト/ダークテーマの切り替え
- **検索機能** - データや記事の検索
- **SEO 最適化** - サイトマップ、RSS フィード対応

### データソース

- 都道府県別感染者データ（JSON 形式）
- 歴史的記事とデータ（Markdown 形式）
- グラフ画像とビジュアライゼーション

## 💻 技術スタック

- [Astro V5](https://astro.build) - 静的サイトジェネレーター
- [Tailwind CSS](https://tailwindcss.com) - CSS フレームワーク
- [DaisyUI](https://daisyui.com/) - Tailwind CSS コンポーネントライブラリ
- [TypeScript](https://typescriptlang.org) - 型付き JavaScript
- [Astro Icon](https://github.com/natemoo-re/astro-icon) - MDI アイコン
- [Bun](https://bun.sh) - 高速な JavaScript ランタイム＆パッケージマネージャー

## 📁 プロジェクト構造

```
covid19/
├── src/
│   ├── content/
│   │   ├── covid19/          # COVID-19関連記事（年/月別）
│   │   ├── prefectures/      # 都道府県別データ（JSON）
│   │   └── views/            # ページコンテンツ
│   ├── components/
│   │   ├── covid19/          # COVID-19専用コンポーネント
│   │   ├── cards/            # カードコンポーネント
│   │   └── shared/           # 共有コンポーネント
│   ├── pages/
│   │   ├── prefecture/       # 都道府県別ページ
│   │   ├── [year]/           # 年別アーカイブ
│   │   └── archives/         # 記事一覧
│   └── lib/
│       ├── handlers/         # データ処理
│       └── utils/            # ユーティリティ関数
└── public/
    └── images/               # グラフ画像とアセット
```

## 📄 ライセンス

このプロジェクトは[MIT ライセンス](LICENSE.md)の下でオープンソース化されています。

- オリジナルテンプレート: Copyright (c) 2024 [Mohammad Rahmani](https://github.com/Mrahmani71/astro-news)
- COVID-19 データ可視化の実装と改変: Copyright (c) 2025 matsubo

## 🤝 コントリビューション

バグ報告、機能リクエスト、プルリクエストを歓迎します！

## 📝 注意事項

このサイトで提供されるデータは情報提供を目的としています。最新の正確な情報については、公式の保健当局の発表をご確認ください。
