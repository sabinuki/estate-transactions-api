# 不動産取引価格検索API

## 動作確認

### APIサーバーの起動
- `cd api && npm run start:dev`を実行して、APIサーバーを起動してください。

### エンドポイント
- `GET: http://localhost:3000/api/v1/townPlanning/estateTransaction/bar`

### クエリパラメータ
- year（2009〜2021）
- prefCode（関東のみ：8〜14）
- type（1:住宅地、2：商業地）

- 例）`GET: http://localhost:3000/api/v1/townPlanning/estateTransaction/bar?year=2015&prefCode=10&type=1`

## 実装内容

### アーキテクチャ
`Controller > UseCase > Repository > Infrastructure`の構成で実装しています。

各レイヤーは隣のレイヤーにのみ参照を行うことで、依存関係を階層化することで、変更の影響を最小限にしています。

#### Controller
- Controllerでは、リクエストパラメータを受け取りUseCaseの関数をコールしてレスポンス返却しています。
- Controllerはロジックを持たず、ビジネスロジックはUseCaseが処理します。
- リクエストとレスポンスの形式やバリデーションはDTOで実装しています。

**クエリバリデーション**
|year|
|---|
|@IsNumber()
@Min(2009, { message: 'Year must be after 2008' })
@Max(2021, { message: 'Year must be before 2022' })
@IsNotEmpty({ message: 'Year is required' })
|

|prefCode|
|---|
|@IsNumber()
@IsIn(KANTO_PREFECTURES_CODES, { message: 'Prefecture code must be a valid Kanto prefecture code' })
@IsNotEmpty({ message: 'Prefecture code is required' })
|

|type|
|---|
|@IsNumber()
@IsIn(Object.values(TYPE), { message: `Type must be a valid type (${Object.values(TYPE).join(', ')})` })
@IsNotEmpty({ message: 'Type is required' })
|

#### UseCase
- UseCaseでは、ビジネスロジックレベルのバリデーションとデータ整形を行なっています。
- データの取得はRepositoryをコールしています。

**バリデーション**
- `private validateBizRules`にビジネスバリデーションを実装しています。
- パラメータの必須条件は型指定で対応しています。

|year|
|---|
|2015-2018年の値であること|

|prefectureCode|
|---|
|関東のみのコードであること|

|type|
|---|
|1-2の値であること|

#### Repository
- 実装は持たず、Interfaceの定義のみです。
- Infrastructureに実装を持たせることで、ビジネスロジックがデータストアの変更に依存しない設計にしています。

#### Infrastructure
- データアクセスの実装をしています。
- 今回はDBではなくJsonファイルの読み込みを行なっています。

## 品質・テスト

### 静的解析
- `cd api && npm run lint`により静的コード解析を行います。
- `cd api && npm run format`で自動コード整形を実行することができます。

### Unitテスト
- Controller・リクエストDTOとUseCaseにUnitテストを実装しています。
- `cd api && npm test`でテスト実行ができます。
