/**
 * ページナビゲーションモジュール
 * ページ遷移と制限機能のオーバーレイ表示に関する機能
 */

import { clearElement, isRecommendedFeature, isNewFeature, getImagePath } from './utils-module.js';
import { getMenuDescription } from './data-module.js';
import { isFeatureRestricted, createRestrictionOverlay, applyCardRestrictionStyle } from './plan-restriction-module.js';

/**
 * 特定のページに遷移する関数
 * @param {string} topNavKey - トップナビゲーションのキー
 * @param {string} category - カテゴリー名
 * @param {string} item - 項目名
 */
export function navigateToPage(topNavKey, category, item) {
    // 制限機能かどうかを確認
    const isStandardRestricted = isFeatureRestricted(item, 'standard');
    const isAdvancedRestricted = isFeatureRestricted(item, 'advanced');
    // カスタムダッシュボード一覧はStandardプラン以上でしか見れないように制限
    const isCustomDashboardRestricted = item === 'カスタムダッシュボード一覧';
    const isRestricted = isStandardRestricted || isAdvancedRestricted || isCustomDashboardRestricted;
    const planType = isAdvancedRestricted ? 'advanced' : 'standard';
    
    // 既存のオーバーレイを削除（別のページに移動する場合）
    // 複数の可能性のあるオーバーレイセレクタを確認
    const overlaySelectors = [
        '.restriction-overlay',
        'div[style*="position: fixed"][style*="z-index: 9999"]',
        'div[style*="backdrop-filter: blur"]',
        'div[style*="backgroundColor: rgba(255, 255, 255, 0.8)"]'
    ];
    
    overlaySelectors.forEach(selector => {
        const overlay = document.querySelector(selector);
        if (overlay) {
            overlay.remove();
        }
    });
    
    // コンテンツエリアを取得
    const contentArea = document.getElementById('content-area');
    
    // コンテンツエリアをクリア
    clearElement(contentArea);
    
    // 背景色を白に設定
    document.body.style.background = '#FFFFFF';
    
    // 画像を表示（z-indexを設定して、サイドナビゲーションを突き抜けないようにする）
    const imgContainer = document.createElement('div');
    imgContainer.style.position = 'relative';
    imgContainer.style.zIndex = '1';
    
    const img = document.createElement('img');
    img.src = getImagePath(item);
    img.alt = item;
    img.style.width = '100%';
    img.style.borderRadius = '8px';
    
    // 画像をコンテナに追加し、コンテナをコンテンツエリアに追加
    imgContainer.appendChild(img);
    contentArea.appendChild(imgContainer);
    
    // 制限機能の場合はオーバーレイを表示
    if (isRestricted) {
        // オーバーレイを作成してbodyに追加
        const overlay = createRestrictionOverlay(planType);
        document.body.appendChild(overlay);
    }
    
    // サイドナビゲーションのアクティブ状態を更新
    updateSideNavActiveState(item);
}

/**
 * サイドナビゲーションのアクティブ状態を更新する関数
 * @param {string} activeItem - アクティブな項目名
 */
function updateSideNavActiveState(activeItem) {
    document.querySelectorAll('.nav-item-level2').forEach(navItem => {
        if (navItem.dataset.item === activeItem) {
            navItem.classList.add('active');
        } else {
            navItem.classList.remove('active');
        }
    });
}

/**
 * トップナビゲーションのアクティブ状態を更新する関数
 * @param {string} activeKey - アクティブなキー
 */
export function updateTopNavActiveState(activeKey) {
    document.querySelectorAll('.top-nav-item').forEach(item => {
        if (item.dataset.key === activeKey) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

/**
 * コンテンツエリアの設定を更新する関数
 * @param {string} topNavKey - トップナビゲーションのキー
 */
export function updateContentAreaSettings(topNavKey) {
    const contentArea = document.getElementById('content-area');
    const content = document.getElementById('content');
    const sideNavToggle = document.getElementById('side-nav-toggle');
    
    // お気に入りの場合
    if (topNavKey === 'favorites') {
        // コンテンツエリアの余白を削除
        contentArea.style.padding = '0';
        // コンテンツの左マージンを削除
        content.style.marginLeft = '0';
        // サイドナビゲーション開閉ボタンを非表示
        sideNavToggle.style.display = 'none';
        // 背景色をグレーに設定
        document.body.style.background = '#f8f9fa';
    }
    // ダッシュボードの場合
    else if (topNavKey === 'dashboard') {
        // コンテンツエリアの余白を削除
        contentArea.style.padding = '0';
        // コンテンツの左マージンを設定
        content.style.marginLeft = '276px';
        // サイドナビゲーション開閉ボタンを表示
        sideNavToggle.style.display = '';
        // 背景色を白に設定
        document.body.style.background = '#FFFFFF';
    }
    // 通常の場合
    else {
        // コンテンツエリアの余白を設定
        contentArea.style.padding = '';
        // コンテンツの左マージンを元に戻す
        content.style.marginLeft = '';
        // サイドナビゲーション開閉ボタンを表示
        sideNavToggle.style.display = '';
        // 背景色を白に設定
        document.body.style.background = '#FFFFFF';
    }
}

/**
 * メニューカードを作成する関数
 * @param {string} topNavKey - トップナビゲーションのキー
 * @param {string} category - カテゴリー名
 * @param {string} item - 項目名
 * @returns {HTMLElement} メニューカード要素
 */
export function createMenuCard(topNavKey, category, item) {
    const isStandardRestricted = isFeatureRestricted(item, 'standard');
    const isAdvancedRestricted = isFeatureRestricted(item, 'advanced');
    // カスタムダッシュボード一覧はStandardプラン以上でしか見れないように制限
    const isCustomDashboardRestricted = item === 'カスタムダッシュボード一覧';
    const isRestricted = isStandardRestricted || isAdvancedRestricted || isCustomDashboardRestricted;
    const planType = isAdvancedRestricted ? 'advanced' : 'standard';
    
    // カード要素を作成
    const card = document.createElement('div');
    card.className = 'menu-card';
    
    // おすすめ機能かどうかを確認
    const isRecommended = isRecommendedFeature(item);
    
    // 新機能かどうかを確認
    const isNew = isNewFeature(item);
    
    // カード内容を設定
    card.innerHTML = `
        <div class="card-image">
            <img src="${getImagePath(item)}" alt="${item}">
            ${isRecommended ? '<div class="recommended-badge" style="display: block !important; visibility: visible !important; opacity: 1 !important;">おすすめ機能</div>' : ''}
            ${isNew ? '<div class="new-feature-badge" style="display: block !important; visibility: visible !important; opacity: 1 !important;">新機能</div>' : ''}
        </div>
        <div class="card-title-container">
            <div class="card-title">${item}</div>
            ${isRestricted ? '<i class="lock-icon"></i>' : ''}
        </div>
        <div class="card-subtitle">${getMenuDescription(topNavKey, category, item)}</div>
    `;
    
    // 制限機能の場合はマスキングスタイルを適用
    if (isRestricted) {
        applyCardRestrictionStyle(card, planType);
    } else {
        // 制限なしの場合は通常のクリックイベント
        card.addEventListener('click', function() {
            navigateToPage(topNavKey, category, item);
        });
    }
    
    return card;
}
