# Taktivent

リアルタイムイベントフィードバックプラットフォーム

演奏者がコンサートやイベントを開催する際の課題を解決するアプリです。紙のフライヤーの代わりにイベントページを作成でき、イベント開始時にはプログラム表示に切り替わります。観客からの評価やデータを集計できます。

## 技術スタック

| 項目 | 技術 |
|------|------|
| バックエンド | Rails 7 API + Ruby 3.1.2 |
| フロントエンド | React 19 + TypeScript + Vite |
| 状態管理 | TanStack Query + Zustand |
| スタイリング | Tailwind CSS |
| 認証 | Devise + JWT |
| データベース | PostgreSQL |

## プロジェクト構造

```
taktivent/
├── api/          # Rails 7 API
└── frontend/     # React アプリ
```

## 機能一覧

- ユーザー登録・ログイン (JWT 認証)
- イベント CRUD
- 曲 CRUD
- カスタム質問作成
- 匿名レビュー投稿
- 分析ダッシュボード (評価分布、感情分析)
- QR コード生成
- カウントダウンタイマー

## セットアップ

### 必要なもの

- Ruby 3.1.2+
- Node.js 20+
- PostgreSQL 14+

### バックエンド

```bash
cd api
bundle install
rails db:create db:migrate
rails s -p 3001
```

### フロントエンド

```bash
cd frontend
npm install
npm run dev
```

## 環境変数

### api/.env

```env
DATABASE_URL=postgres://localhost/taktivent_dev
CLOUDINARY_URL=cloudinary://...
DEVISE_JWT_SECRET_KEY=your-secret-key
FRONTEND_URL=http://localhost:5173
```

### frontend/.env

```env
VITE_API_URL=http://localhost:3001/api/v1
```

## テスト

```bash
# バックエンド
cd api && bundle exec rspec

# フロントエンド
cd frontend && npm test
```
