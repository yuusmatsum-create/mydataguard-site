---
title: "VMware vCenter に認証回避の脆弱性（CVE-2026-123890）、悪用を確認"
category: vulnerability
priority: now
summary: "仮想基盤の管理サーバー VMware vCenter に、ネットワークから届けば認証なしで管理機能に入られる脆弱性。米CISAが11月20日に「悪用を確認した脆弱性」に追加した。修正版への更新を急ぐ必要がある。"
insight: "vCenter は社内のサーバー群をまとめて動かす「鍵束」で、ここを取られると個々のサーバーの対策が意味を失う。ランサムウェアが仮想基盤ごと暗号化する被害が続くなか、管理ネットワークに誰が届くかの点検は、パッチ適用と同じ重さで扱うべきだ。"
publishedAt: 2026-11-21
tags: [VMware, 仮想基盤, 認証回避, KEV]
facts:
  - { label: "CVE", value: "CVE-2026-123890" }
  - { label: "影響を受ける製品", value: "VMware vCenter 9.1.x / 9.0.x / 8.0 / 5.x（Telco Cloud Platform・Telco Cloud Infrastructure の一部も対象）" }
  - { label: "深刻度", value: "CVSS 9.8（緊急）" }
  - { label: "悪用状況", value: "CISA KEV 掲載（2026年11月20日追加、米政府機関の対応期限 11月23日）" }
  - { label: "修正版", value: "9.1.1.0200 / 9.0.2.0200 / 8.0 U3m / 5.2.5" }
actions:
  - "vCenter のバージョンを確認し、上の修正版より古ければ更新を計画する。更新は週明けを待たずに判断する"
  - "vCenter の管理画面・ディレクトリサービスに、管理用ネットワーク以外から届かないか（インターネット公開や社内全体からの到達）を確認し、届くなら通信を絞る"
  - "更新前に侵害されていないか、vCenter の管理者アカウントの追加、権限変更、見覚えのない仮想マシン操作の記録を確認する"
sources:
  - { title: "CISA Known Exploited Vulnerabilities Catalog（CVE-2026-123890）", url: "https://www.cisa.gov/known-exploited-vulnerabilities-catalog?field_cve=CVE-2026-123890", date: "2026-11-20" }
  - { title: "NVD CVE-2026-123890", url: "https://nvd.nist.gov/vuln/detail/CVE-2026-123890", date: "2026-11-19" }
  - { title: "Broadcom Security Advisory", url: "https://support.broadcom.com/web/ecx/support-content-notification/-/external/content/SecurityAdvisories/0/39495" }
draft: false
---

## 何が起きるか

vCenter に含まれるディレクトリサービス（VMware Directory Service）に、正規の認証を経ずに別の経路から入れてしまう欠陥があります。vCenter にネットワークで届く攻撃者は、ログインせずにシステムへ不正にアクセスできる可能性があります（NVD・CISA の説明による）。

vCenter は仮想マシンの作成・停止・設定変更をまとめて行う管理サーバーです。ここに入られると、配下の仮想マシンを止めたり、外へ持ち出したりする足場になります。

## 対応の優先度の根拠

- 米CISA が2026年11月20日、実際の悪用が確認された脆弱性の一覧（KEV）に追加しました。米政府機関には11月23日までの対応を求めています。
- CVSS 基本値は 9.8（緊急）です。
- 手順書の基準「悪用が確認済みで、ネットワークから攻撃できる製品」に当たるため、**今すぐ対応** としました。
