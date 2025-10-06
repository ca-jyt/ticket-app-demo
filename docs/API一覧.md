## API一覧（Server Actions / API Routes 想定）

見積り向けに、Next.js Server Actions / API Routes 単位で処理を列挙します。
各項目は目的・主要引数・戻り値・認可・補足を記載（実装詳細は別紙）。

---

### 認証/Auth

#### Server Actions（推奨: フォーム直結）

| Action名 | 目的 | 主な引数 | 戻り値 | 認可 | 補足 |
| --- | --- | --- | --- | --- | --- |
| registerUserAction | 会員登録 | email, password | { ok, userId } | Public | 重複メール/強度バリデーション |
| loginAction | ログイン | email, password | { ok } | Public | セッション発行/クッキー設定 |
| logoutAction | ログアウト | なし | { ok } | Auth | セッションクリア |

#### API Routes（必要に応じて）

| Method/Path | 目的 | 主なパラメータ | 戻り値 | 認可 | 補足 |
| --- | --- | --- | --- | --- | --- |
| POST /api/auth/register | 会員登録 | body: { email, password } | { userId } | Public | バリデーション/重複チェック |
| POST /api/auth/login | ログイン | body: { email, password } | { ok } | Public | セッションCookie設定 |
| POST /api/auth/logout | ログアウト | - | { ok } | Auth | Cookie無効化 |

---

### 上映/スケジュール

#### API Routes（キャッシュ/ISR考慮）

| Method/Path | 目的 | 主なパラメータ | 戻り値 | 認可 | 補足 |
| --- | --- | --- | --- | --- | --- |
| GET /api/movies | 作品一覧 | query: page, q | Movie[] | Public | 作品メタ/ポスター等 |
| GET /api/movies/[movieId] | 作品詳細 | path: movieId | Movie | Public | シノプシス等 |
| GET /api/showtimes | 上映回一覧 | query: movieId, date | Showtime[] | Public | 価格/残席含む |
| GET /api/showtimes/[id] | 上映回詳細 | path: id | Showtime | Public | 残席・ステータス |

---

### 座席/予約（ホールド→決済→確定）

#### Server Actions（UX重視: 画面遷移と連携）

| Action名 | 目的 | 主な引数 | 戻り値 | 認可 | 補足 |
| --- | --- | --- | --- | --- | --- |
| holdSeatsAction | 座席ホールド開始 | showtimeId, seatIds | { holdId, expiresAt } | Auth | 二重取り防止/在庫排他 |
| releaseHoldAction | ホールド解除 | holdId | { ok } | Auth | タイムアウト/取消時 |
| checkoutAction | 決済実行 | holdId, paymentToken | { paymentId } | Auth | ゲートウェイ連携 |
| createReservationAction | 予約確定 | holdId, paymentId | { reservationId } | Auth | 座席=reserved化 |

#### API Routes（SPA/外部連携想定）

| Method/Path | 目的 | 主なパラメータ | 戻り値 | 認可 | 補足 |
| --- | --- | --- | --- | --- | --- |
| POST /api/holds | ホールド作成 | body: { showtimeId, seatIds } | { holdId, expiresAt } | Auth | 競合チェック/TTL |
| DELETE /api/holds/[holdId] | ホールド解除 | path: holdId | { ok } | Auth | 期限/整合性 |
| POST /api/checkout | 決済 | body: { holdId, method } | { paymentId, amount } | Auth | オーソリ/キャプチャ |
| POST /api/reservations | 予約確定 | body: { holdId, paymentId } | { reservationId } | Auth | 冪等性キー推奨 |

---

### 予約履歴/キャンセル

#### Server Actions

| Action名 | 目的 | 主な引数 | 戻り値 | 認可 | 補足 |
| --- | --- | --- | --- | --- | --- |
| listMyReservationsAction | 自分の予約一覧 | paging | { items, total } | Auth | 並び替え/期間絞り込み |
| getReservationDetailAction | 予約詳細取得 | reservationId | Reservation | Auth | 明細/座席/支払履歴 |
| cancelReservationAction | 予約キャンセル | reservationId | { refundId?, status } | Auth | 期限/手数料ロジック |

#### API Routes

| Method/Path | 目的 | 主なパラメータ | 戻り値 | 認可 | 補足 |
| --- | --- | --- | --- | --- | --- |
| GET /api/me/reservations | 自分の予約一覧 | query: page, from, to | { items, total } | Auth | cursor/page選択 |
| GET /api/me/reservations/[id] | 予約詳細 | path: id | Reservation | Auth | |
| POST /api/me/reservations/[id]/cancel | キャンセル | path: id, body: reason | { refundAmount, status } | Auth | 規定/返金連携 |

---

### 管理者（作品/上映回/在庫/予約）

#### Server Actions（管理UI直結）

| Action名 | 目的 | 主な引数 | 戻り値 | 認可 | 補足 |
| --- | --- | --- | --- | --- | --- |
| upsertMovieAction | 作品登録/更新 | movie payload | { movieId } | Admin | スラッグ重複等 |
| upsertShowtimeAction | 上映回登録/更新 | showtime payload | { showtimeId } | Admin | 座席数整合 |
| adjustInventoryAction | 座席ブロック/開放 | showtimeId, seats | { ok } | Admin | 事前販売/団体確保 |
| adminCancelReservationAction | 代行キャンセル | reservationId | { refundId } | Admin | 返金種別/監査ログ |
| setPolicyAction | ポリシー設定 | policy payload | { ok } | Admin | キャンセル期限/手数料 |
| upsertTemplateAction | 通知テンプレ設定 | template payload | { templateId } | Admin | プレビューあり |

#### API Routes（外部/運用ツール用）

| Method/Path | 目的 | 主なパラメータ | 戻り値 | 認可 | 補足 |
| --- | --- | --- | --- | --- | --- |
| GET /api/admin/movies | 作品一覧 | query | { items } | Admin | |
| POST /api/admin/movies | 作品登録 | body | { movieId } | Admin | |
| PATCH /api/admin/movies/[id] | 作品更新 | path, body | { ok } | Admin | |
| GET /api/admin/showtimes | 上映回一覧 | query | { items } | Admin | |
| POST /api/admin/showtimes | 上映回登録 | body | { showtimeId } | Admin | |
| PATCH /api/admin/showtimes/[id] | 上映回更新 | path, body | { ok } | Admin | |
| POST /api/admin/inventory/adjust | 在庫調整 | body: { showtimeId, seats, op } | { ok } | Admin | block/unblock |
| POST /api/admin/reservations/[id]/cancel | 代行キャンセル | path, body | { refundId } | Admin | 監査ログ必須 |
| PUT /api/admin/policies | ポリシー保存 | body | { ok } | Admin | 反映時刻 |
| PUT /api/admin/templates/[type] | テンプレ保存 | path, body | { ok } | Admin | type=register/confirm/cancel |

---

### 通知/メール

#### Server Actions

| Action名 | 目的 | 主な引数 | 戻り値 | 認可 | 補足 |
| --- | --- | --- | --- | --- | --- |
| previewTemplateAction | メールプレビュー | type, sample payload | { html } | Admin | 画面内プレビュー |
| sendTestEmailAction | テスト送信 | to, type | { messageId } | Admin | サンドボックス |

#### API Routes

| Method/Path | 目的 | 主なパラメータ | 戻り値 | 認可 | 補足 |
| --- | --- | --- | --- | --- | --- |
| POST /api/notify/test | テスト送信 | body: { to, type } | { messageId } | Admin | |

---

### 技術的注意点（見積り観点）

- 認可/認証: セッションCookie/CSRF/ロールに伴う共通ミドルウェア実装
- 冪等性: 予約/決済/キャンセル系は冪等キー必須（重複実行防止）
- 在庫排他: 座席ホールド/確定での行ロック or 楽観ロック設計
- 監査ログ: 管理操作/返金は操作ログ・相関IDを保存
- エラー設計: ビジネスエラー（期限超過/在庫なし）とシステムエラーの区別
- SLA/リトライ: 決済/メール外部連携のリトライ/バックオフ/サーキットブレーカー


