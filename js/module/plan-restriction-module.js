/**
 * プラン制限モジュール
 * プランによる機能制限の表示を管理する
 */

import { createElement } from './utils-module.js';
import { navigateToPage } from './page-navigation-module.js';

// プラン制限の種類
const PLAN_TYPES = {
    STANDARD: 'standard',
    ADVANCED: 'advanced'
};

// 各プランで制限される機能のリスト
const restrictedFeatures = {
    [PLAN_TYPES.STANDARD]: [
        'チーム比較',
        '詳細比較',
        'チームスタッツエクスポート',
        'メンバー比較',
        'メンバースタッツエクスポート',
        'プロジェクト進捗',
        'プロセスタイム分析',
        'ミーティング分析',
        'チームサーベイ'
    ],
    [PLAN_TYPES.ADVANCED]: [
        'プロジェクトアウトカム分析β',
        'ROI分析',
        'Copilotレポート',
        '経営レポート'
    ]
};

/**
 * 機能が制限されているかチェックする関数
 * @param {string} featureName - 機能名
 * @param {string} planType - プランタイプ
 * @returns {boolean} 制限されているかどうか
 */
export function isFeatureRestricted(featureName, planType = PLAN_TYPES.STANDARD) {
    return restrictedFeatures[planType]?.includes(featureName) || false;
}

/**
 * 制限オーバーレイを作成する関数
 * @param {string} planType - 制限するプランタイプ
 * @returns {HTMLElement} 制限オーバーレイ要素
 */
export function createRestrictionOverlay(planType = PLAN_TYPES.STANDARD) {
    // 現在表示されている領域の中央に配置するためのオーバーレイコンテナを作成
    const overlay = createElement('div', {
        className: 'restriction-overlay',
        style: {
            position: 'fixed',
            top: '60px', // トップナビゲーションの高さ
            left: '276px', // サイドナビゲーションの幅
            right: '0',
            bottom: '0',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: '950'
        }
    });
    
    // プランタイプに応じたメッセージとスタイルを設定
    let title, message, buttonText, iconClass, iconColor;
    
    if (planType === PLAN_TYPES.STANDARD) {
        title = 'この機能はStandardプラン以上で利用できます';
        message = 'Standardプランにアップグレードすると、チーム比較やデータエクスポートなどの機能が利用可能になります。';
        buttonText = 'Standardプランにアップグレード';
        iconClass = 'fa-lock';
        iconColor = '#1E7ED5';
    } else if (planType === PLAN_TYPES.ADVANCED) {
        title = 'この機能はAdvancedプラン以上で利用できます';
        message = 'Advancedプランにアップグレードすると、経営レポートやROI分析などの高度な機能が利用可能になります。';
        buttonText = 'Advancedプランにアップグレード';
        iconClass = 'fa-lock';
        iconColor = '#1E7ED5';
    }
    
    // メッセージコンテナを作成
    const messageContainer = createElement('div', {
        style: {
            textAlign: 'center',
            maxWidth: '500px',
            padding: '0 20px'
        }
    });
    
    // アイコンを作成
    const icon = createElement('div', {
        style: {
            fontSize: '48px',
            color: iconColor,
            marginBottom: '20px'
        }
    }, `<i class="fas ${iconClass}"></i>`);
    
    // タイトルを作成
    const titleElement = createElement('h2', {
        style: {
            fontSize: '24px',
            fontWeight: 'bold',
            marginBottom: '16px',
            color: '#333'
        }
    }, title);
    
    // メッセージを作成
    const messageElement = createElement('p', {
        style: {
            fontSize: '16px',
            marginBottom: '24px',
            color: '#666',
            lineHeight: '1.6'
        }
    }, message);
    
    // ボタンを作成
    const button = createElement('button', {
        style: {
            backgroundColor: iconColor,
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            padding: '12px 24px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'background-color 0.3s'
        }
    }, buttonText);
    
    // ボタンのホバー効果
    button.addEventListener('mouseover', function() {
        this.style.backgroundColor = '#1565C0';
    });
    
    button.addEventListener('mouseout', function() {
        this.style.backgroundColor = iconColor;
    });
    
    // ボタンのクリックイベント
    button.addEventListener('click', function() {
        // プランアップグレードページへ遷移
        alert(`${planType === PLAN_TYPES.STANDARD ? 'Standard' : 'Advanced'}プランへのアップグレードページに遷移します`);
    });
    
    // 要素を組み立て
    messageContainer.appendChild(icon);
    messageContainer.appendChild(titleElement);
    messageContainer.appendChild(messageElement);
    messageContainer.appendChild(button);
    
    overlay.appendChild(messageContainer);
    
    // サイドナビゲーションの開閉状態に応じてオーバーレイの位置を調整
    const sideNav = document.getElementById('side-nav');
    if (sideNav && sideNav.classList.contains('collapsed')) {
        overlay.style.left = '0';
    }
    
    // サイドナビゲーション開閉ボタンのクリックイベントを監視
    const sideNavToggle = document.getElementById('side-nav-toggle');
    if (sideNavToggle) {
        sideNavToggle.addEventListener('click', function() {
            if (sideNav.classList.contains('collapsed')) {
                overlay.style.left = '0';
            } else {
                overlay.style.left = '276px';
            }
        });
    }
    
    return overlay;
}

/**
 * 制限されたカードのマスキングスタイルを適用する関数
 * @param {HTMLElement} card - カード要素
 * @param {string} planType - プランタイプ
 */
export function applyCardRestrictionStyle(card, planType = PLAN_TYPES.STANDARD) {
    // カード画像に制限スタイルを適用
    const cardImage = card.querySelector('.card-image');
    if (cardImage) {
        cardImage.classList.add('restricted-image');
        
        // プランタイプに応じたスタイルを適用
        if (planType === PLAN_TYPES.STANDARD) {
            cardImage.style.filter = 'blur(3px) grayscale(50%)';
        } else if (planType === PLAN_TYPES.ADVANCED) {
            cardImage.style.filter = 'blur(3px) grayscale(50%)';
        }
    }
    
    // カードタイトルに制限アイコンを追加
    const cardTitleContainer = card.querySelector('.card-title-container');
    if (cardTitleContainer) {
        const lockIcon = cardTitleContainer.querySelector('.lock-icon');
        if (lockIcon) {
            // プランタイプに応じたアイコンを設定
            if (planType === PLAN_TYPES.STANDARD) {
                lockIcon.innerHTML = '<i class="fas fa-lock"></i>';
                lockIcon.style.color = '#999';
            } else if (planType === PLAN_TYPES.ADVANCED) {
                lockIcon.innerHTML = '<i class="fas fa-lock"></i>';
                lockIcon.style.color = '#999';
            }
        }
    }
    
    // カードのポジションを相対位置に設定
    card.style.position = 'relative';
    
    // カードクリック時の処理を設定
    card.addEventListener('click', function(e) {
        e.stopPropagation();
        
        // ページ遷移
        navigateToPage('team', '', item);
    });
}

/**
 * サイドナビのメニュー項目に制限スタイルを適用する関数
 * @param {HTMLElement} menuItem - メニュー項目要素
 * @param {string} planType - プランタイプ
 */
export function applyMenuItemRestrictionStyle(menuItem, planType = PLAN_TYPES.STANDARD) {
    // メニュー項目に制限クラスを追加
    menuItem.classList.add('restricted');
    
    // 鍵アイコンを取得または作成
    let lockIcon = menuItem.querySelector('.lock-icon');
    if (!lockIcon) {
        lockIcon = createElement('i', {
            className: 'lock-icon'
        });
        menuItem.appendChild(lockIcon);
    }
    
    // プランタイプに応じたアイコンとスタイルを設定
    if (planType === PLAN_TYPES.STANDARD) {
        lockIcon.className = 'fas fa-lock lock-icon';
        lockIcon.style.color = '#999';
    } else if (planType === PLAN_TYPES.ADVANCED) {
        lockIcon.className = 'fas fa-lock lock-icon';
        lockIcon.style.color = '#999';
    }
    
    // メニュー項目のクリック時の処理を設定
    menuItem.addEventListener('click', function(e) {
        e.stopPropagation();
        
        // ページ遷移
        const item = this.dataset.item;
        const category = this.dataset.category;
        const topNavKey = document.querySelector('.top-nav-item.active').dataset.key;
        
        // navigateToPage関数をインポートして使用
        import('./page-navigation-module.js').then(module => {
            module.navigateToPage(topNavKey, category, item);
        });
    });
}
