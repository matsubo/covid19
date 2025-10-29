# Large File and Data Handling Rules

## Overview

This document provides guidelines for working with large files and datasets in Cline to ensure optimal performance and avoid memory issues.

---

## File Size Thresholds

### Small Files (< 100KB)

- **Action**: Read and process directly
- **Tools**: Use `read_file` without restrictions
- **Processing**: Full content analysis is acceptable

### Medium Files (100KB - 1MB)

- **Action**: Read with caution
- **Tools**: Use `read_file` but consider targeted analysis
- **Processing**: Focus on specific sections when possible
- **Tip**: Use `search_files` to locate relevant sections first

### Large Files (1MB - 10MB)

- **Action**: Avoid full reads when possible
- **Tools**:
  - Prefer `search_files` with specific regex patterns
  - Use command-line tools (`head`, `tail`, `grep`, `fd`)
  - Consider line-by-line processing with scripts
- **Processing**: Extract and analyze only necessary portions
- **Warning**: Full content analysis may be slow

### Very Large Files (> 10MB)

- **Action**: DO NOT read entire file into memory
- **Required Approach**:
  - Use streaming tools (`grep`, `awk`, `sed`)
  - Process in chunks via scripts
  - Create summaries or indexes first
  - Use `head` or `tail` for sampling
- **Forbidden**: Using `read_file` on the entire file

---

## Data Processing Guidelines

### CSV/TSV Files

```bash
# Count rows (fast)
wc -l data.csv

# Preview first/last rows
head -n 10 data.csv
tail -n 10 data.csv

# Search for specific data
grep "keyword" data.csv

# Column analysis (using awk)
awk -F',' '{print $1}' data.csv | sort | uniq -c
```

### JSON Files

```bash
# Large JSON: Use jq for streaming
cat large.json | jq -c '.[] | select(.condition)'

# Extract specific fields
jq '.items[] | {id, name}' data.json

# Count elements
jq 'length' array.json
```

### Log Files

```bash
# Tail for recent entries
tail -f -n 100 application.log

# Search with context
grep -C 5 "ERROR" application.log

# Time-based filtering
awk '/2025-10-30/ {print}' application.log
```

---

## Memory-Efficient Strategies

### 1. **Progressive Analysis**

Instead of reading the entire file:

1. Use `head` to analyze structure
2. Use `search_files` to locate relevant sections
3. Read only necessary portions
4. Build understanding incrementally

### 2. **Sampling Approach**

For statistical or representative data:

```bash
# Random sampling (every Nth line)
awk 'NR % 100 == 0' large_file.csv

# First N lines
head -n 1000 large_file.csv > sample.csv
```

### 3. **Indexing and Summarization**

Create smaller metadata files:

```bash
# Create line count index
wc -l *.csv > file_sizes.txt

# Extract headers only
head -n 1 *.csv > headers_summary.txt

# Create file listing with sizes
fd -t f -x du -h {} \; > file_inventory.txt
```

### 4. **Chunked Processing**

For transformation tasks:

```bash
# Process file in chunks
split -l 10000 large_file.csv chunk_

# Process each chunk
for chunk in chunk_*; do
  # Your processing here
  process_data.sh "$chunk"
done
```

---

## Project-Specific Rules (COVID-19 Data)

### Working with COVID-19 Datasets

1. **Historical Data Files**

   - Large time-series data should be queried, not fully loaded
   - Use date ranges to filter relevant data
   - Aggregate statistics before full analysis

2. **Prefecture Data**

   - JSON files in `src/content/prefectures/` are small, safe to read
   - Output data in `output/posts/` may be large, use search instead

3. **Image Files**

   - Always check file size before processing
   - Use ImageMagick for thumbnails (see `image.md` rules)
   - Don't load images larger than 5MB without resizing

4. **Migration Data**
   - WordPress XML export files can be very large
   - Use `grep` or `awk` to extract specific entries
   - Parse incrementally rather than loading entire DOM

---

## Tool Selection Guide

| Task              | File Size | Recommended Tool          |
| ----------------- | --------- | ------------------------- |
| Read entire file  | < 1MB     | `read_file`               |
| Search content    | Any       | `search_files` with regex |
| Count lines       | Any       | `wc -l`                   |
| Extract range     | Any       | `head`, `tail`, `sed`     |
| Filter data       | Any       | `grep`, `awk`             |
| Parse JSON        | < 10MB    | `jq` with filters         |
| Parse JSON        | > 10MB    | `jq -c` streaming         |
| Find files        | Any       | `fd` (fast) or `find`     |
| Preview structure | Any       | `head -n 20`              |

---

## Warning Signs

🚨 **Stop and reconsider if you encounter:**

- File operations taking > 10 seconds
- Memory usage warnings
- Frozen or unresponsive terminals
- Files with millions of lines
- Binary files > 1MB without specific tools

**Instead:** Use streaming tools, process in chunks, or ask for guidance.

---

## Best Practices Checklist

- [ ] Check file size before reading (`ls -lh`, `du -h`)
- [ ] Use appropriate tool for file size
- [ ] Prefer targeted queries over full reads
- [ ] Process data incrementally when possible
- [ ] Create indexes or summaries for large datasets
- [ ] Use command-line tools for efficiency
- [ ] Monitor performance and adjust approach
- [ ] Document data sources and sizes

---

## Examples

### Example 1: Analyzing Large CSV

```bash
# DON'T: read_file on 50MB CSV
# DO: Progressive analysis

# 1. Check structure
head -n 5 large_data.csv

# 2. Count rows
wc -l large_data.csv

# 3. Find specific records
grep "Tokyo" large_data.csv | head -n 10

# 4. Get column summary
awk -F',' '{print $2}' large_data.csv | sort | uniq -c | sort -rn | head -n 10
```

### Example 2: Processing Multiple Files

```bash
# DON'T: Read all files one by one
# DO: Batch analysis

# Find all relevant files
fd -e csv -x grep -l "pattern" {}

# Get summary statistics
fd -e csv -x wc -l {} \; | awk '{sum+=$1} END {print sum}'

# Process matching files only
fd -e csv -x grep -h "specific_date" {} \; > filtered_results.txt
```

---

# 大きなファイルとデータの取り扱いルール（日本語版）

## 概要

Cline で大きなファイルやデータセットを扱う際の最適なパフォーマンスとメモリ問題を回避するためのガイドラインです。

---

## ファイルサイズの閾値

### 小さいファイル（100KB 未満）

- **対応**: 直接読み込みと処理が可能
- **ツール**: `read_file`を制限なく使用可能
- **処理**: 全内容の分析が可能

### 中程度のファイル（100KB - 1MB）

- **対応**: 注意して読み込み
- **ツール**: `read_file`を使用するが、ターゲットを絞った分析を検討
- **処理**: 可能な限り特定のセクションに焦点を当てる
- **ヒント**: まず`search_files`で関連セクションを特定

### 大きいファイル（1MB - 10MB）

- **対応**: 可能な限り全体読み込みを避ける
- **ツール**:
  - 特定の正規表現パターンで`search_files`を優先
  - コマンドラインツール（`head`、`tail`、`grep`、`fd`）を使用
  - スクリプトによる行単位の処理を検討
- **処理**: 必要な部分のみを抽出・分析
- **警告**: 全内容の分析は遅くなる可能性あり

### 非常に大きいファイル（10MB 超）

- **対応**: ファイル全体をメモリに読み込まない
- **必須アプローチ**:
  - ストリーミングツール（`grep`、`awk`、`sed`）を使用
  - スクリプトによるチャンク処理
  - まず要約やインデックスを作成
  - サンプリングには`head`や`tail`を使用
- **禁止**: ファイル全体に対する`read_file`の使用

---

## データ処理のガイドライン

### CSV/TSV ファイル

```bash
# 行数カウント（高速）
wc -l data.csv

# 最初/最後の行をプレビュー
head -n 10 data.csv
tail -n 10 data.csv

# 特定のデータを検索
grep "キーワード" data.csv

# カラム分析（awkを使用）
awk -F',' '{print $1}' data.csv | sort | uniq -c
```

### JSON ファイル

```bash
# 大きなJSON：jqでストリーミング処理
cat large.json | jq -c '.[] | select(.condition)'

# 特定のフィールドを抽出
jq '.items[] | {id, name}' data.json

# 要素数をカウント
jq 'length' array.json
```

---

## プロジェクト固有のルール（COVID-19 データ）

### COVID-19 データセットの取り扱い

1. **履歴データファイル**

   - 大きな時系列データは全ロードではなくクエリで取得
   - 日付範囲で関連データをフィルタリング
   - 完全分析の前に統計を集約

2. **都道府県データ**

   - `src/content/prefectures/`の JSON ファイルは小さく、安全に読み込み可能
   - `output/posts/`の出力データは大きい可能性があり、検索を使用

3. **画像ファイル**

   - 処理前に必ずファイルサイズを確認
   - サムネイルには ImageMagick を使用（`image.md`ルール参照）
   - リサイズなしで 5MB 以上の画像を読み込まない

4. **移行データ**
   - WordPress の XML エクスポートファイルは非常に大きくなる可能性
   - 特定のエントリ抽出には`grep`や`awk`を使用
   - DOM 全体をロードするのではなく段階的に解析

---

## ベストプラクティス チェックリスト

- [ ] 読み込み前にファイルサイズを確認（`ls -lh`、`du -h`）
- [ ] ファイルサイズに適したツールを使用
- [ ] 全体読み込みよりターゲットを絞ったクエリを優先
- [ ] 可能な限りデータを段階的に処理
- [ ] 大規模データセットのインデックスや要約を作成
- [ ] 効率のためコマンドラインツールを使用
- [ ] パフォーマンスを監視しアプローチを調整
- [ ] データソースとサイズを文書化

---

## 重要な注意事項

🚨 **以下に遭遇したら停止して再考：**

- ファイル操作に 10 秒以上かかる
- メモリ使用量の警告
- フリーズまたは応答しないターミナル
- 数百万行のファイル
- 専用ツールなしで 1MB 超のバイナリファイル

**代わりに：** ストリーミングツールを使用、チャンク処理、またはガイダンスを求める

---

## まとめ

大きなファイルとデータを扱う際は：

1. **常にファイルサイズを確認**
2. **適切なツールを選択**
3. **段階的にアプローチ**
4. **メモリ効率を意識**
5. **パフォーマンスを監視**

これらのルールに従うことで、Cline での大規模データ処理が効率的かつ安全になります。
