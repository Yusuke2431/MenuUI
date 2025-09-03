
/**
 * ナビゲーションデータと関連データを定義するファイル
 */

// ナビゲーションデータ
export const navigationData = {
    dashboard: {
        title: "ダッシュボード",
        items: [
            {
                title: "ダッシュボード",
                submenu: [
                    "メインダッシュボード",
                    "カスタムダッシュボード一覧"
                ]
            }
        ]
    },
    favorites: {
        title: "お気に入り",
        items: [
            {
                title: "お気に入りメニュー",
                submenu: [
                    "お気に入りメニュー一覧"
                ]
            }
        ]
    },
    team: {
        title: "チーム",
        items: [
            {
                title: "ベンチマーク",
                submenu: [
                    "開発生産性スコア",
                    "DevOps分析"
                ]
            },
            {
                title: "開発プロセス",
                submenu: [
                    "サイクルタイム分析",
                    "レビュー分析"
                ]
            },
            {
                title: "アクティビティ",
                submenu: [
                    "チームサマリ",
                    "チーム詳細",
                    "チーム比較",
                    "詳細比較",
                    "チームコンディション",
                    "チームスタッツ",
                    "チームスタッツエクスポート"
                ]
            },
            {
                title: "コーディング",
                submenu: [
                    "コード変更分析β",
                    "プルリク一覧"
                ]
            },
            {
                title: "DevEx",
                submenu: [
                    "KPTふりかえり",
                    "ふりかえり一覧",
                    "アクション一覧",
                    "ミーティング分析",
                    "チームサーベイ分析",
                    "チームサーベイ配信結果"
                ]
            },
            {
                title: "ターゲット",
                submenu: [
                    "目標設定"
                ]
            },
            {
                title: "レポート",
                submenu: [
                    "オンボーディングレポートβ",
                    "レポート"
                ]
            }
        ]
    },
    member: {
        title: "メンバー",
        items: [
            {
                title: "アクティビティ",
                submenu: [
                    "メンバー詳細",
                    "メンバー比較",
                    "メンバースタッツ",
                    "メンバースタッツエクスポート"
                ]
            },
            {
                title: "DevEX",
                submenu: [
                    "メンバーサーベイ分析"
                ]
            },
            {
                title: "ターゲット",
                submenu: [
                    "メンバーターゲットβ"
                ]
            }
        ]
    },
    project: {
        title: "プロジェクト",
        items: [
            {
                title: "デリバリー",
                submenu: [
                    "プロジェクト進捗",
                    "スプリントパフォーマンス分析",
                    "Jiraスプリント分析",
                    "Jiraイシュー分析",
                    "Backlogイシュー分析",
                    "イシュー一覧"
                ]
            },
            {
                title: "プロセス",
                submenu: [
                    "プロジェクトプロセスタイム分析β"
                ]
            }
        ]
    },
    organization: {
        title: "経営",
        items: [
            {
                title: "ストラテジー",
                submenu: [
                    "プロジェクト投資分析",
                    "プロジェクトアウトカム分析β",
                    "ROI分析"
                ]
            },
            {
                title: "レポート",
                submenu: [
                    "Copilotレポート",
                    "経営レポート"
                ]
            }
        ]
    },
    settings: {
        title: "設定",
        items: [
            {
                title: "連携データ設定",
                submenu: [
                    "連携サービス",
                    "リポジトリ管理",
                    "プロジェクト管理"
                ]
            },
            {
                title: "表示データ設定",
                submenu: [
                    "チーム管理",
                    "チームモニタリング管理",
                    "メンバー管理",
                    "スタッツ管理"
                ]
            },
            {
                title: "機能設定",
                submenu: [
                    "チームサーベイ管理",
                    "プロジェクトカテゴリ管理",
                    "プロジェクトプロセス管理",
                    "お気に入り条件一覧"
                ]
            },
            {
                title: "組織設定",
                submenu: [
                    "組織管理",
                    "アカウント管理",
                    "認証管理（パスワード/SSO）",
                    "IPアドレス制限",
                    "アクセス状況"
                ]
            }
        ]
    }
};

// チームデータ
export const teamData = [
    "エンジニアリング部",
    "プロダクト開発チーム",
    "インフラストラクチャチーム",
    "フロントエンドチーム",
    "バックエンドチーム",
    "モバイルアプリチーム",
    "QAチーム",
    "デザインチーム",
    "プロダクトマネジメントチーム",
    "カスタマーサポートチーム",
    "セキュリティチーム",
    "データサイエンスチーム",
    "DevOpsチーム",
    "SREチーム",
    "テクニカルライティングチーム"
];

// メンバーデータ
export const memberData = [
    "佐藤 太郎",
    "鈴木 次郎",
    "高橋 三郎",
    "田中 四郎",
    "伊藤 五郎",
    "渡辺 六郎",
    "山本 七郎",
    "中村 八郎",
    "小林 九郎",
    "加藤 十郎",
    "吉田 一郎",
    "山田 二郎",
    "佐々木 三郎",
    "山口 四郎",
    "松本 五郎"
];

// プロジェクトデータ
export const projectData = [
    "ウェブサイトリニューアル",
    "モバイルアプリ開発",
    "APIインテグレーション",
    "インフラ刷新",
    "セキュリティ強化",
    "パフォーマンス最適化",
    "新機能開発",
    "バグ修正",
    "UI/UX改善",
    "テスト自動化",
    "データ分析基盤構築",
    "マイクロサービス移行",
    "レガシーシステム刷新",
    "CI/CD導入",
    "クラウド移行"
];

// Basicプランで利用できない機能のリスト
export const restrictedFeatures = [
    'カスタムダッシュボード一覧',
    'チーム比較',
    '詳細比較',
    'チームスタッツエクスポート',
    'メンバー比較',
    'メンバースタッツエクスポート',
    'プロジェクト進捗',
    'プロセスタイム分析',
    'ミーティング分析',
    'チームサーベイ'
];

// おすすめ機能リスト
export const recommendedFeatures = [
    'チームサマリ', 
    'レビュー分析', 
    '開発生産性スコア', 
    'メンバー詳細'
];

// 選択状態を保持するグローバル変数
export let selectedTeam = "チームを選択";
export let selectedMember = "メンバーを選択";
export let selectedProject = "プロジェクトを選択";

// 選択状態を更新する関数
export function updateSelectedTeam(team) {
    selectedTeam = team;
}

export function updateSelectedMember(member) {
    selectedMember = member;
}

export function updateSelectedProject(project) {
    selectedProject = project;
}
