import { config, collection, fields } from "@keystatic/core";

export default config({
  storage: {
    kind: "local",
  },

  collections: {
    covid19: collection({
      label: "COVID-19 記事",
      slugField: "title",
      path: "src/content/covid19/*/*/*/",
      format: { contentField: "content" },
      schema: {
        title: fields.slug({
          name: {
            label: "タイトル",
            description: "記事のタイトル",
          },
        }),
        description: fields.text({
          label: "説明",
          description: "記事の説明文",
        }),
        publishedTime: fields.datetime({
          label: "公開日時",
          description: "記事の公開日時",
          defaultValue: { kind: "now" },
        }),
        prefecture: fields.select({
          label: "都道府県",
          description: "対象の都道府県",
          options: [
            { label: "北海道", value: "hokkaido" },
            { label: "青森県", value: "aomori" },
            { label: "山形県", value: "yamagata" },
            { label: "埼玉県", value: "saitama" },
            { label: "東京都", value: "tokyo" },
            { label: "神奈川県", value: "kanagawa" },
            { label: "富山県", value: "toyama" },
            { label: "石川県", value: "ishikawa" },
            { label: "福井県", value: "fukui" },
            { label: "長野県", value: "nagano" },
            { label: "岐阜県", value: "gifu" },
            { label: "三重県", value: "mie" },
            { label: "岡山県", value: "okayama" },
            { label: "山口県", value: "yamaguchi" },
            { label: "愛媛県", value: "ehime" },
            { label: "高知県", value: "kouchi" },
            { label: "福岡県", value: "fukuoka" },
            { label: "熊本県", value: "kumamoto" },
            { label: "群馬県", value: "gunma" },
          ],
          defaultValue: "tokyo",
        }),
        coverImage: fields.text({
          label: "カバー画像",
          description: "画像のパス（例: /images/2022/09/filename.png）",
          validation: {
            isRequired: true,
          },
        }),
        content: fields.mdx({
          label: "コンテンツ",
          description: "記事の本文",
        }),
      },
    }),

    prefectures: collection({
      label: "都道府県",
      slugField: "slug",
      path: "src/content/prefectures/*",
      format: { data: "json" },
      schema: {
        title: fields.text({
          label: "タイトル",
          description: "都道府県名（日本語）",
          validation: {
            isRequired: true,
          },
        }),
        slug: fields.slug({
          name: {
            label: "スラッグ",
            description: "URL用のスラッグ（例: tokyo, kanagawa）",
          },
        }),
        count: fields.number({
          label: "記事数",
          description: "この都道府県の記事数（統計用）",
          validation: {
            isRequired: false,
          },
        }),
      },
    }),

    views: collection({
      label: "ビュー（ページメタデータ）",
      slugField: "title",
      path: "src/content/views/*",
      format: { data: "json" },
      schema: {
        title: fields.text({
          label: "タイトル",
          description: "ページのタイトル",
          validation: {
            isRequired: true,
          },
        }),
        description: fields.text({
          label: "説明",
          description: "ページの説明文",
          validation: {
            isRequired: true,
          },
        }),
        blocks: fields.array(
          fields.object({
            type: fields.text({ label: "タイプ" }),
            content: fields.text({ label: "コンテンツ", multiline: true }),
          }),
          {
            label: "ブロック",
            description: "ページのコンテンツブロック",
            itemLabel: (props) => props.fields.type.value || "新しいブロック",
          }
        ),
      },
    }),
  },
});
