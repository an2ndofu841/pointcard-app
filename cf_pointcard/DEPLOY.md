# デプロイ手順 (Vercel)

このアプリをインターネット上に公開し、スマホでテストするための手順です。

## 1. GitHubへプッシュ
現在、ローカルでコミットまで完了しています。
以下のコマンドでGitHub等のリモートリポジトリにプッシュしてください。
（リポジトリがまだない場合は、GitHubで新規リポジトリを作成し、連携させてください）

```bash
git push origin main
```

## 2. Vercelでインポート
1. [Vercelのダッシュボード](https://vercel.com/dashboard)にアクセスします。
2. **"Add New..."** -> **"Project"** をクリック。
3. GitHubリポジトリを選択し、**"Import"** をクリック。

## 3. 設定 (重要！)
インポート時の設定画面で以下を確認・変更してください。

- **Root Directory (ルートディレクトリ)**:
  - `Edit` を押し、**`cf_pointcard`** を選択してください。（リポジトリのルートではなく、このプロジェクトのフォルダを指定）

- **Framework Preset**:
  - `Vite` が自動選択されているはずです。

- **Build Command**:
  - `npm run build` (自動設定のままでOK)

- **Output Directory**:
  - `dist` (自動設定のままでOK)

## 4. Deploy
**"Deploy"** ボタンを押します。
1分ほどでビルドが完了し、URLが発行されます。

そのURLをスマホで開けば、カメラ機能も含めてテストできます！

