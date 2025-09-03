/**
 * ユーティリティ関数を定義するファイル
 */

import { restrictedFeatures, recommendedFeatures } from './data.js';

/**
 * 機能がおすすめかチェックする関数
 * @param {string} featureName - 機能名
 * @returns {boolean} おすすめかどうか
 */
export function isRecommendedFeature(featureName) {
    return recommendedFeatures.includes(featureName);
}

/**
 * 機能が制限されているかチェックする関数
 * @param {string} featureName - 機能名
 * @returns {boolean} 制限されているかどうか
 */
export function isFeatureRestricted(featureName) {
    return restrictedFeatures.includes(featureName);
}

/**
 * メニュー項目の説明を取得する関数
 * @param {string} topNavKey - トップナビゲーションのキー
 * @param {string} category - カテゴリー名
 * @param {string} item - 項目名
 * @returns {string} 説明文
 */
export function getMenuDescription(topNavKey, category, item) {
    // チームメニュー
    if (topNavKey === 'team') {
        if (category === 'アクティビティ') {
            if (item === 'チームサマリ') return 'チーム全体のリードタイムやアクティビティを俯瞰して把握できる機能です';
            if (item === 'チームコンディション') return 'チーム内のアクティビティと開発クオリティの傾向を可視化できる機能です';
            if (item === 'チーム詳細') return 'チーム内の具体的なアクティビティや傾向を深掘りできる機能です';
            if (item === 'チーム比較') return '複数チームのアクティビティやリードタイムを比較できる画面です（Standardプラン以上で利用可能）';
            if (item === '詳細比較') return 'チームやメンバー単位の詳細な数値を横並びで比較できる機能です（Standardプラン以上で利用可能）';
            if (item === 'チームスタッツ') return 'チームの詳細なアクティビティデータを月毎に確認できる機能です';
            if (item === 'チームスタッツエクスポート') return 'チームの詳細なアクティビティデータをCSV形式で出力できる機能です（Standardプラン以上で利用可能）';
        }
        if (category === '開発プロセス') {
            if (item === 'レビュー分析') return 'プルリクのレビューの速度や傾向を可視化し、ボトルネックを把握できる機能です';
            if (item === 'サイクルタイム分析') return 'コミットからマージまでのサイクルタイムを可視化し、開発プロセスの改善ポイントを発見できる機能です';
        }
        if (category === 'DevEx') {
            if (item === 'ミーティング分析') return 'チーム全体のミーティング時間や頻度を可視化できる機能です（Standardプラン以上で利用可能）';
            if (item === 'チームサーベイ') return 'チームの開発者体験をSPACEフレームワークに沿って可視化できる機能です（Standardプラン以上で利用可能）';
            if (item === 'KPTふりかえり') return 'KPTフレームワークに基づくふりかえりにより、改善アクションの可視化と実行を支援する機能です';
        }
        if (category === 'ベンチマーク') {
            if (item === '開発生産性スコア') return 'Findy Team+全体のデータをもとに、開発パフォーマンスを相対スコアで把握できる機能です';
            if (item === 'DevOps分析') return 'Four Keys 指標に基づいて、チームのデリバリーパフォーマンスを可視化できる機能です';
        }
    }
    // メンバーメニュー
    else if (topNavKey === 'member') {
        if (category === 'アクティビティ') {
            if (item === 'メンバー詳細') return '個々のメンバーのアクティビティや傾向を詳細に確認できる機能です';
            if (item === 'メンバー比較') return '複数メンバーのアクティビティやリードタイムを比較できる機能です（Standardプラン以上で利用可能）';
            if (item === 'メンバースタッツ') return 'メンバーの詳細なアクティビティデータを月毎に確認できる機能です';
            if (item === 'メンバースタッツエクスポート') return 'メンバーの詳細なアクティビティデータをCSV形式で出力できる機能です（Standardプラン以上で利用可能）';
        }
    }
    
    return '機能の説明';
}
