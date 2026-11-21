---
title: "Cisco Expressway に root 権限でコマンドを実行される脆弱性（CVE-2026-76466）、悪用を確認"
category: vulnerability
priority: now
summary: "ビデオ会議・通話の中継に使われる Cisco Expressway シリーズに、認証なしで root 権限のコマンドを実行される脆弱性。10月に公表済みだったが、米CISAが11月20日に悪用を確認した一覧へ追加した。"
insight: "公表から約1か月後に「悪用確認」へ格上げされた例だ。公表時点で悪用がなかったから後回し、という判断は1か月で覆る。Web会議や外線の中継装置はインターネットに面しているのに、情報システム部門ではなく設備・通信の担当が持っていて更新が漏れやすい。持ち主の確認から始めたい。"
publishedAt: 2026-11-21
tags: [Cisco, ビデオ会議, KEV]
facts:
  - { label: "CVE", value: "CVE-2026-76466" }
  - { label: "影響を受ける製品", value: "Cisco Expressway シリーズ（Expressway-C / Expressway-E）" }
  - { label: "深刻度", value: "CVSS 9.8（緊急）" }
  - { label: "悪用状況", value: "CISA KEV 掲載（2026年11月20日追加、米政府機関の対応期限 11月23日）" }
  - { label: "修正版・回避策", value: "Cisco のアドバイザリ（cisco-sa-vcs-static-cred-hr7EWZ8t）に記載の修正版へ更新" }
actions:
  - "Expressway を使っているか、ビデオ会議・電話・設備の担当部署にも確認する（情報システム部門の台帳に載っていないことがある）"
  - "Cisco のアドバイザリで修正版を確認して更新する。クラスタ構成で使っている場合は特に急ぐ"
  - "更新前に侵害されていないか、装置のログで見覚えのない接続やコマンド実行がないかを確認する"
sources:
  - { title: "CISA Known Exploited Vulnerabilities Catalog（CVE-2026-76466）", url: "https://www.cisa.gov/known-exploited-vulnerabilities-catalog?field_cve=CVE-2026-76466", date: "2026-11-20" }
  - { title: "NVD CVE-2026-76466", url: "https://nvd.nist.gov/vuln/detail/CVE-2026-76466", date: "2026-10-21" }
  - { title: "Cisco Security Advisory（cisco-sa-vcs-static-cred-hr7EWZ8t）", url: "https://sec.cloudapps.cisco.com/security/center/content/CiscoSecurityAdvisory/cisco-sa-vcs-static-cred-hr7EWZ8t" }
draft: false
---

## 何が起きるか

Expressway のデータベース機能に、使い回される認証用の情報（永続的な Cookie）が使われており、さらにクラスタ構成で TLS 検証を有効にしている場合でもクライアント証明書が正しく検証されない欠陥があります。この情報を持つ攻撃者は、装置のデータベース機能に接続して特定の命令を送り、**root 権限で任意のコマンドを実行**できる可能性があります（NVD・CISA の説明による）。

Expressway は、社外とのビデオ会議や通話を中継するため、インターネットに面して置かれることが多い装置です。

## 対応の優先度の根拠

- 脆弱性自体は2026年10月21日に公表されていましたが、米CISA が11月20日に実際の悪用を確認した一覧（KEV）へ追加しました。
- CVSS 基本値は 9.8（緊急）です。
- 手順書の基準「悪用が確認済みで、インターネットに面した製品」に当たるため、**今すぐ対応** としました。
