## 画面遷移図（Screen Flow）

本システムの画面遷移を mermaid 形式で整理します。

---

### 全体画面遷移図

```mermaid
flowchart TD
  subgraph Public[公開エリア]
    Home[ホーム<br/>A-006] --> Movies[Movies一覧<br/>B-001]
    Home --> Register[会員登録<br/>A-002]
    Home --> Login[ログイン<br/>A-004]
    Home --> Reservations[予約履歴<br/>D-001]
  end

  subgraph Auth[認証フロー]
    Register --> Registered[登録完了<br/>A-003]
    Registered --> Login
    Login --> Home
  end

  subgraph Movie[映画閲覧フロー]
    Movies --> MovieDetail[作品詳細<br/>B-002]
    MovieDetail --> Showtime[上映回詳細<br/>B-004]
    Showtime --> SeatSelect[座席選択<br/>C-001]
  end

  subgraph Booking[予約フロー]
    SeatSelect --> Checkout[予約確認<br/>C-003]
    Checkout --> Confirm[予約完了<br/>C-005]
    Confirm --> Home
    Confirm --> MovieDetail
  end

  subgraph Reservation[予約管理フロー]
    Reservations --> ReservationDetail[予約詳細<br/>D-002]
    ReservationDetail --> CancelConfirm[キャンセル確認<br/>D-004]
    CancelConfirm --> Cancelled[キャンセル完了<br/>D-006]
    Cancelled --> Home
  end

  subgraph Admin[管理エリア]
    AdminLogin[管理ログイン<br/>M-001] --> AdminHome[管理ホーム]
    AdminHome --> MovieMgmt[作品管理<br/>M-002]
    AdminHome --> ShowtimeMgmt[上映回管理<br/>M-003]
    AdminHome --> Inventory[在庫監視<br/>M-004]
    AdminHome --> ReservationMgmt[予約管理<br/>M-006]
    AdminHome --> PolicyMgmt[ポリシー設定<br/>M-007]
    AdminHome --> TemplateMgmt[テンプレ管理<br/>M-008]
  end

  classDef public fill:#e1f5fe
  classDef auth fill:#f3e5f5
  classDef movie fill:#e8f5e8
  classDef booking fill:#fff3e0
  classDef reservation fill:#fce4ec
  classDef admin fill:#f1f8e9

  class Home,Movies,MovieDetail,Showtime public
  class Register,Registered,Login auth
  class SeatSelect,Checkout,Confirm booking
  class Reservations,ReservationDetail,CancelConfirm,Cancelled reservation
  class AdminLogin,AdminHome,MovieMgmt,ShowtimeMgmt,Inventory,ReservationMgmt,PolicyMgmt,TemplateMgmt admin
```

---

### 顧客向け詳細フロー

```mermaid
flowchart TD
  Start([開始]) --> Home[ホーム<br/>A-006]
  
  Home -->|映画を見る| Movies[Movies一覧<br/>B-001]
  Movies -->|作品選択| MovieDetail[作品詳細<br/>B-002]
  MovieDetail -->|上映回選択| Showtime[上映回詳細<br/>B-004]
  Showtime -->|座席を選ぶ| SeatSelect[座席選択<br/>C-001]
  
  SeatSelect -->|確認へ| Checkout[予約確認<br/>C-003]
  Checkout -->|決済実行| Confirm[予約完了<br/>C-005]
  
  Home -->|会員登録| Register[会員登録<br/>A-002]
  Register -->|登録完了| Registered[登録完了<br/>A-003]
  Registered -->|ログインへ| Login[ログイン<br/>A-004]
  
  Home -->|ログイン| Login
  Login -->|成功| Home
  
  Home -->|予約履歴| Reservations[予約履歴<br/>D-001]
  Reservations -->|予約選択| ReservationDetail[予約詳細<br/>D-002]
  ReservationDetail -->|キャンセル| CancelConfirm[キャンセル確認<br/>D-004]
  CancelConfirm -->|確定| Cancelled[キャンセル完了<br/>D-006]
  
  Confirm -->|映画一覧へ| Movies
  Confirm -->|ホームへ| Home
  Cancelled -->|ホームへ| Home
  
  classDef start fill:#ffeb3b
  classDef screen fill:#e3f2fd
  classDef action fill:#f1f8e9
  
  class Start start
  class Home,Movies,MovieDetail,Showtime,SeatSelect,Checkout,Confirm,Register,Registered,Login,Reservations,ReservationDetail,CancelConfirm,Cancelled screen
```

---

### 管理者向け詳細フロー

```mermaid
flowchart TD
  AdminStart([管理開始]) --> AdminLogin[管理ログイン<br/>M-001]
  AdminLogin -->|認証成功| AdminHome[管理ホーム]
  
  AdminHome -->|作品管理| MovieMgmt[作品管理<br/>M-002]
  AdminHome -->|上映回管理| ShowtimeMgmt[上映回管理<br/>M-003]
  AdminHome -->|在庫監視| Inventory[在庫監視<br/>M-004]
  AdminHome -->|予約管理| ReservationMgmt[予約管理<br/>M-006]
  AdminHome -->|ポリシー設定| PolicyMgmt[ポリシー設定<br/>M-007]
  AdminHome -->|テンプレ管理| TemplateMgmt[テンプレ管理<br/>M-008]
  
  MovieMgmt -->|作品登録/編集| MovieForm[作品フォーム]
  ShowtimeMgmt -->|上映回登録/編集| ShowtimeForm[上映回フォーム]
  ReservationMgmt -->|予約検索| ReservationList[予約一覧]
  ReservationList -->|予約詳細| ReservationDetail[予約詳細]
  ReservationDetail -->|代行キャンセル| AdminCancel[代行キャンセル]
  
  classDef adminStart fill:#ffeb3b
  classDef adminScreen fill:#e8f5e8
  classDef adminAction fill:#f3e5f5
  
  class AdminStart adminStart
  class AdminLogin,AdminHome,MovieMgmt,ShowtimeMgmt,Inventory,ReservationMgmt,PolicyMgmt,TemplateMgmt adminScreen
  class MovieForm,ShowtimeForm,ReservationList,ReservationDetail,AdminCancel adminAction
```

---

### エラーフロー・代替パス

```mermaid
flowchart TD
  subgraph Error[エラー・代替フロー]
    LoginFail[ログイン失敗<br/>A-004] -->|再入力| Login[ログイン<br/>A-004]
    RegisterFail[登録失敗<br/>A-002] -->|再入力| Register[会員登録<br/>A-002]
    SeatLimit[座席上限超過<br/>C-001] -->|警告表示| SeatSelect[座席選択<br/>C-001]
    HoldExpired[仮予約失効<br/>C-003] -->|再選択| SeatSelect
    SoldOut[完売<br/>B-004] -->|案内表示| Showtime[上映回詳細<br/>B-004]
    CancelExpired[キャンセル期限超過<br/>D-002] -->|不可案内| ReservationDetail[予約詳細<br/>D-002]
  end
  
  classDef error fill:#ffcdd2
  classDef normal fill:#e3f2fd
  
  class LoginFail,RegisterFail,SeatLimit,HoldExpired,SoldOut,CancelExpired error
  class Login,Register,SeatSelect,Showtime,ReservationDetail normal
```

---

### 画面遷移のルール

- **認証必須画面**: 座席選択以降、予約履歴、管理画面
- **条件分岐**: 完売時は座席選択不可、期限超過時はキャンセル不可
- **タイマー制御**: 仮予約は2分で失効、失効時は再選択へ
- **上限制御**: 座席選択は最大5席まで
- **戻る操作**: 各画面から適切な前画面への戻りリンク
