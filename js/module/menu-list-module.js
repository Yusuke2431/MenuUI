/**
 * メニュー一覧モジュール
 * メニュー一覧ページとお気に入りページの表示に関する機能
 */

import { navigationData, favoriteMenus } from './data-module.js';
import { clearElement, isRecommendedFeature, isNewFeature } from './utils-module.js';
import { createMenuCard, updateContentAreaSettings, updateTopNavActiveState } from './page-navigation-module.js';
import { renderSideNav } from './side-nav-module.js';

/**
 * メニュー一覧ページを表示する関数
 * @param {string} topNavKey - トップナビゲーションのキー
 */
export function renderMenuListPage(topNavKey) {
    const contentArea = document.getElementById('content-area');
    
    // コンテンツエリアをクリア
    clearElement(contentArea);
    
    // コンテンツエリアの設定を更新
    updateContentAreaSettings(topNavKey);
    
    // お気に入りの場合は特別な表示
    if (topNavKey === 'favorites') {
        renderFavoritesPage(contentArea);
        return;
    }
    
    // ダッシュボードの場合は特別な表示
    if (topNavKey === 'dashboard') {
        renderDashboardPage(contentArea);
        return;
    }
    
    const navData = navigationData[topNavKey];
    if (!navData) return;
    
    // メニュー一覧ページでは余白を保持（左右の余白なし）
    contentArea.style.padding = '0 0 20px';
    
    // カテゴリーごとのセクションを作成
    navData.items.forEach(category => {
        // カテゴリーセクションを作成
        const categorySection = document.createElement('div');
        categorySection.className = 'category-section';
        
        // カテゴリータイトルを追加
        const categoryTitle = document.createElement('h3');
        categoryTitle.className = 'category-title';
        categoryTitle.textContent = category.title;
        categorySection.appendChild(categoryTitle);
        
        // カード一覧を作成
        const cardsContainer = document.createElement('div');
        cardsContainer.className = 'cards-container';
        
        // カテゴリー内のメニュー項目をカードとして表示
        category.submenu.forEach(item => {
            const card = createMenuCard(topNavKey, category.title, item);
            cardsContainer.appendChild(card);
        });
        
        categorySection.appendChild(cardsContainer);
        contentArea.appendChild(categorySection);
    });
}

/**
 * お気に入りページを表示する関数
 * @param {HTMLElement} contentArea - コンテンツエリア要素
 */
function renderFavoritesPage(contentArea) {
    // お気に入りページのタイトルを追加
    const pageTitle = document.createElement('h2');
    pageTitle.className = 'page-title';
    pageTitle.textContent = 'お気に入りメニュー一覧';
    pageTitle.style.margin = '20px';
    contentArea.appendChild(pageTitle);
    
    // トップナビゲーションのカテゴリーごとにセクションを作成
    const categories = {
        'team': 'チーム',
        'member': 'メンバー',
        'project': 'プロジェクト',
        'organization': '経営',
        'settings': '設定',
        'dashboard': 'ダッシュボード'
    };
    
    // カテゴリーごとにメニューをグループ化
    const groupedMenus = {};
    
    // お気に入りメニューをカテゴリーごとに分類
    favoriteMenus.forEach(menu => {
        if (!groupedMenus[menu.topNavKey]) {
            groupedMenus[menu.topNavKey] = [];
        }
        groupedMenus[menu.topNavKey].push(menu);
    });
    
    // カテゴリーごとにセクションを作成
    Object.keys(categories).forEach(key => {
        // そのカテゴリーのお気に入りがない場合はスキップ
        if (!groupedMenus[key] || groupedMenus[key].length === 0) {
            return;
        }
        
        // カテゴリーセクションを作成
        const categorySection = document.createElement('div');
        categorySection.className = 'category-section';
        
        // カテゴリータイトルを追加
        const categoryTitle = document.createElement('h3');
        categoryTitle.className = 'category-title';
        categoryTitle.textContent = categories[key];
        categoryTitle.style.margin = '20px 0 15px 40px';
        categoryTitle.style.paddingBottom = '10px';
        categoryTitle.style.borderBottom = '1px solid #eee';
        categorySection.appendChild(categoryTitle);
        
        // カード一覧を作成
        const cardsContainer = document.createElement('div');
        cardsContainer.className = 'cards-container';
        cardsContainer.style.padding = '0 40px 20px';
        
        // カテゴリー内のお気に入りメニューをカードとして表示
        groupedMenus[key].forEach(menu => {
            // カード要素を作成
            const card = document.createElement('div');
            card.className = 'menu-card';
            
            // おすすめ機能かどうかを確認
            const isRecommended = isRecommendedFeature(menu.name);
            
            // 新機能かどうかを確認
            const isNew = isNewFeature(menu.name);
            
            // カード内容を設定
            card.innerHTML = `
                <div class="card-image">
                    <img src="../../Full Screenshot/${menu.name}.png" alt="${menu.name}">
                    ${isRecommended ? '<div class="recommended-badge" style="display: block !important; visibility: visible !important; opacity: 1 !important;">おすすめ機能</div>' : ''}
                    ${isNew ? '<div class="new-feature-badge" style="display: block !important; visibility: visible !important; opacity: 1 !important;">新機能</div>' : ''}
                </div>
                <div class="card-title-container">
                    <div class="card-title">${menu.name}</div>
                    <i class="fas fa-star" style="color: #FFB400; margin-left: 8px;"></i>
                </div>
                <div class="card-subtitle">${menu.description}</div>
            `;
            
            // カードをクリックしたときの処理
            card.addEventListener('click', function() {
                // 既存のオーバーレイを削除
                const existingOverlay = document.querySelector('.restriction-overlay');
                if (existingOverlay) {
                    existingOverlay.remove();
                }
                
                // トップナビゲーションのアクティブ状態を更新
                updateTopNavActiveState(menu.topNavKey);
                
                // サイドナビゲーションを表示
                const sideNav = document.getElementById('side-nav');
                sideNav.style.display = 'block';
                
                // コンテンツの左マージンを元に戻す
                const content = document.getElementById('content');
                content.style.marginLeft = '';
                
                // サイドナビゲーション開閉ボタンを表示
                document.getElementById('side-nav-toggle').style.display = '';
                
                // サイドナビゲーションを更新
                renderSideNav(menu.topNavKey);
                
                // ページに遷移
                import('/js/modules/page-navigation-module.js').then(module => {
                    module.navigateToPage(menu.topNavKey, menu.category, menu.name);
                });
            });
            
            cardsContainer.appendChild(card);
        });
        
        categorySection.appendChild(cardsContainer);
        contentArea.appendChild(categorySection);
    });
    
    // お気に入りがない場合のメッセージを表示
    if (Object.keys(groupedMenus).length === 0) {
        const emptyMessage = document.createElement('p');
        emptyMessage.textContent = 'お気に入りに登録されたメニューはありません。';
        emptyMessage.style.textAlign = 'center';
        emptyMessage.style.margin = '40px 0';
        emptyMessage.style.color = '#666';
        contentArea.appendChild(emptyMessage);
    }
}

/**
 * ダッシュボードページを表示する関数
 * @param {HTMLElement} contentArea - コンテンツエリア要素
 */
function renderDashboardPage(contentArea) {
    // ダッシュボードの内容を表示（z-indexを設定して、サイドナビゲーションを突き抜けないようにする）
    contentArea.innerHTML = `
        <div style="position: relative; z-index: 1;">
            <img src="../../Full Screenshot/メインダッシュボード.png" alt="メインダッシュボード" style="width: 100%; border-radius: 8px;">
        </div>
    `;
}
