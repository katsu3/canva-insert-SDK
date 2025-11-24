# Canva Insert SDK - AI Context

## プロジェクト概要
Google DriveからCanvaへ画像を一括挿入するCanva Appの開発プロジェクト。

## 技術スタック
- **Frontend**: Vanilla JavaScript (ES6+)
- **Server**: Python 3 (カスタムHTTPサーバー with CORS)
- **APIs**: 
  - Canva Apps SDK
  - Google Drive API v3

## ファイル構成
```
.
├── index.html       # エントリーポイント（Canva iframe内で読み込まれる）
├── app.js           # Canva SDK連携ロジック
├── drive.js         # Google Drive API呼び出し
├── server.py        # CORS対応ローカルサーバー
├── manifest.json    # Canva App設定
├── version.json     # キャッシュバスター用バージョン番号
└── .ai/             # AI/LLM向けドキュメント
```

## アーキテクチャ

### フロントエンド
- `index.html`: Canva iframeに埋め込まれるUI
- `app.js`: Canva.createImage(), Canva.addElements() でCanvaに画像配置
- `drive.js`: Google Drive Files APIから画像リスト取得

### バックエンド
- `server.py`: 
  - Python標準ライブラリのみ使用（依存なし）
  - CORS ヘッダ付与（`Access-Control-Allow-Origin: https://www.canva.com`）
  - ポート8080でホスト

## 開発環境セットアップ

### サーバー起動
```bash
python3 server.py
```
→ `http://localhost:8080` で起動

### Canva Developer設定
- Dev URL: `http://localhost:8080`
- manifest.json の entry: `index.html`

## 重要な技術的制約

### 1. スクリプトパスは絶対URL必須
❌ NG:
```html
<script src="./app.js"></script>
```

✅ OK:
```html
<script src="http://localhost:8080/app.js?v=1"></script>
```

**理由**: Canva iframe内から相対パスが正しく解決されないため

### 2. CORS設定必須
レスポンスヘッダに以下が必要:
```
Access-Control-Allow-Origin: https://www.canva.com
Access-Control-Allow-Credentials: true
```

`server.py` で実装済み。

### 3. キャッシュバスター必須
Canvaのiframeがスクリプトを強くキャッシュするため、更新時は:
```html
<!-- v=1 → v=2 → v=3 と increment -->
<script src="http://localhost:8080/app.js?v=2"></script>
```

## 開発ワークフロー

### コード修正時の手順
1. `app.js` または `drive.js` を編集
2. `version.json` の `version` を increment（例: `"1"` → `"2"`）
3. Canvaプレビューをリロード

**バージョン管理の仕組み:**
- `version.json` でバージョンを一元管理
- `index.html` が起動時に自動的にバージョンを読み込んでスクリプトURLを生成

### デバッグ
- ブラウザ直接アクセス: `http://localhost:8080` で動作確認
- Canva Developer Console でエラー確認
- ブラウザDevTools の Network タブでCORSエラー確認

## よくある問題と解決策

### 問題: Canvaプレビューで更新が反映されない
**原因**: iframeのキャッシュ  
**解決**: `index.html` の `?v=N` をインクリメント

### 問題: "couldn't load the app's JavaScript bundle"
**原因**: 
- CORSヘッダ不足
- スクリプトパスが相対パス

**解決**:
- `server.py` が起動しているか確認
- `index.html` のscript srcが絶対URLか確認

### 問題: Google Drive画像が読み込めない
**原因**: Drive APIの認証/権限  
**解決**: フォルダが「リンクを知っている全員」で共有されているか確認

## 今後の拡張案
- [ ] 画像の配置位置を自動計算（グリッドレイアウト）
- [ ] ページ自動追加機能
- [ ] OAuth 2.0 による Drive API認証
- [ ] 画像サイズ・回転のカスタマイズUI
