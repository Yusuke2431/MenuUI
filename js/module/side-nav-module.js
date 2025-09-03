/**
 * サイドナビゲーションモジュール
 * サイドナビゲーションの生成と操作に関する機能
 */

import { 
    navigationData, 
    teamData, 
    memberData, 
    projectData, 
    selectedState 
} from './data-module.js';
import { 
    isRecommendedFeature, 
    createElement, 
    addEventListeners, 
    clearElement 
} from './utils-module.js';
import { 
    isFeatureRestricted, 
    applyMenuItemRestrictionStyle 
} from './plan-restriction-module.js';
import { createDropdownContainer } from './dropdown-module.js';
import { navigateToPage } from './page-navigation-module.js';

/**
 * サイドナビゲーションを生成する関数
 * @param {string} topNavKey - トップナビゲーションのキー
 */
export function renderSideNav(topNavKey) {
    const sideNav = document.getElementById('side-nav');
    
    // お気に入りの場合はサイドナビを非表示にする
    if (topNavKey === 'favorites') {
        sideNav.style.display = 'none';
        return;
    } else {
        sideNav.style.display = 'block';
    }
    
    // ダッシュボードの場合は特別なサイドナビを表示
    if (topNavKey === 'dashboard') {
        renderDashboardSideNav(sideNav);
        return;
    }
    
    const navData = navigationData[topNavKey];
    if (!navData) return;
    
    // サイドナビゲーションをクリア
    clearElement(sideNav);
    
    // ドロップダウンを追加
    addDropdownToSideNav(sideNav, topNavKey);
    
    // サイドナビヘッダーを追加
    const header = createSideNavHeader();
    sideNav.appendChild(header);
    
    // サイドナビメニューを追加
    const menuContainer = createSideNavMenu(navData);
    sideNav.appendChild(menuContainer);
    
    // イベントリスナーを設定
    setupSideNavEventListeners(topNavKey);
}

/**
 * ドロップダウンをサイドナビに追加する関数
 * @param {HTMLElement} sideNav - サイドナビゲーション要素
 * @param {string} topNavKey - トップナビゲーションのキー
 */
function addDropdownToSideNav(sideNav, topNavKey) {
    // タイプに応じたデータを取得
    const dataMap = {
        team: teamData,
        member: memberData,
        project: projectData
    };
    
    // データが存在する場合のみドロップダウンを追加
    if (dataMap[topNavKey]) {
        const dropdownContainer = createDropdownContainer(topNavKey, dataMap[topNavKey]);
        sideNav.appendChild(dropdownContainer);
    }
}

/**
 * サイドナビヘッダーを作成する関数
 * @returns {HTMLElement} サイドナビヘッダー要素
 */
function createSideNavHeader() {
    const header = createElement('div', {
        className: 'side-nav-header'
    });
    
    // メニュー一覧リンクを追加
    const menuListLink = createElement('div', {
        className: 'menu-list-link'
    }, `
        <i class="fas fa-th-large"></i> メニュー一覧
    `);
    
    // お気に入りナビゲーションを追加
    const favoritesNav = createElement('div', {
        className: 'favorites-nav'
    }, `
        <i class="fas fa-star"></i> お気に入り
    `);
    
    // お気に入りメニューを作成
    const favoriteMenu = createElement('div', {
        className: 'user-menu',
        style: {
            width: '200px',
            right: 'auto',
            left: '0', // 左端に配置
            top: '100%', // 親要素の下に配置
            zIndex: '9999', // z-indexをさらに上げる
            display: 'none' // 初期状態では非表示
        }
    });
    
    // お気に入りメニューの内容を設定
    const favoritePages = [
        { name: "チームサマリ", category: "アクティビティ", icon: "fa-chart-line" },
        { name: "レビュー分析", category: "開発プロセス", icon: "fa-code-branch" },
        { name: "開発生産性スコア", category: "ベンチマーク", icon: "fa-chart-bar" },
        { name: "メンバー詳細", category: "アクティビティ", icon: "fa-user" }
    ];
    
    favoritePages.forEach(page => {
        const menuItem = createElement('div', {
            className: 'user-menu-item',
            dataset: {
                tooltip: page.name,
                category: page.category
            }
        }, `
            <i class="fas ${page.icon}"></i>
            ${page.name}
        `);
        favoriteMenu.appendChild(menuItem);
    });
    
    // 要素を組み立て
    favoritesNav.appendChild(favoriteMenu);
    header.appendChild(menuListLink);
    header.appendChild(favoritesNav);
    
    return header;
}

/**
 * サイドナビメニューを作成する関数
 * @param {Object} navData - ナビゲーションデータ
 * @returns {HTMLElement} サイドナビメニュー要素
 */
function createSideNavMenu(navData) {
    const menuContainer = createElement('div', {
        className: 'side-nav-menu'
    });
    
    // カテゴリーとサブメニューを生成
    navData.items.forEach(category => {
        const categoryElement = createElement('div', {
            className: 'nav-category'
        });
        
        // カテゴリーヘッダーを作成
        const categoryHeader = createElement('div', {
            className: 'nav-item-level1'
        }, `
            <span>${category.title}</span>
            <i class="fas fa-chevron-down caret"></i>
        `);
        
        // サブメニューを作成
        const submenu = createElement('div', {
            className: 'submenu'
        });
        
        // サブメニュー項目を生成
        category.submenu.forEach(item => {
            const isStandardRestricted = isFeatureRestricted(item, 'standard');
            const isAdvancedRestricted = isFeatureRestricted(item, 'advanced');
            // カスタムダッシュボード一覧はStandardプラン以上でしか見れないように制限
            const isCustomDashboardRestricted = item === 'カスタムダッシュボード一覧';
            const isRestricted = isStandardRestricted || isAdvancedRestricted || isCustomDashboardRestricted;
            const planType = isAdvancedRestricted ? 'advanced' : 'standard';
            
            // サブメニュー項目を作成
            const submenuItem = createElement('div', {
                className: 'nav-item-level2',
                dataset: {
                    category: category.title,
                    item: item
                }
            }, `
                <span>${item}</span>
                <div></div>
            `);
            
            // 制限機能の場合はマスキングスタイルを適用
            if (isRestricted) {
                applyMenuItemRestrictionStyle(submenuItem, planType);
            }
            
            submenu.appendChild(submenuItem);
        });
        
        // 要素を組み立て
        categoryElement.appendChild(categoryHeader);
        categoryElement.appendChild(submenu);
        menuContainer.appendChild(categoryElement);
    });
    
    return menuContainer;
}

/**
 * サイドナビゲーションのイベントリスナーを設定する関数
 * @param {string} topNavKey - トップナビゲーションのキー
 */
function setupSideNavEventListeners(topNavKey) {
    // カテゴリー開閉のイベントリスナーを設定
    document.querySelectorAll('.nav-item-level1').forEach(item => {
        addEventListeners(item, {
            click: function() {
                const submenu = this.nextElementSibling;
                submenu.classList.toggle('collapsed');
                this.classList.toggle('collapsed');
            }
        });
    });
    
    // メニュー項目クリック時のイベントリスナーを設定
    document.querySelectorAll('.nav-item-level2').forEach(item => {
        addEventListeners(item, {
            click: function() {
                const category = this.dataset.category;
                const menuItem = this.dataset.item;
                
                // 既存のオーバーレイを削除（複数の可能性のあるオーバーレイセレクタを確認）
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
                
                // アクティブ状態を更新
                document.querySelectorAll('.nav-item-level2').forEach(i => {
                    i.classList.remove('active');
                });
                this.classList.add('active');
                
                // 画面遷移
                navigateToPage(topNavKey, category, menuItem);
            }
        });
    });
    
    // メニュー一覧リンクのイベントリスナーを設定
    const menuListLink = document.querySelector('.menu-list-link');
    if (menuListLink) {
        addEventListeners(menuListLink, {
            click: function() {
                // 既存のオーバーレイを削除（制限ページから移動した場合）
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
                
                // メニュー一覧ページを表示
                import('/js/modules/menu-list-module.js').then(module => {
                    module.renderMenuListPage(topNavKey);
                });
            }
        });
    }
    
    // お気に入りナビゲーションのイベントリスナーを設定
    setupFavoritesNavEventListeners(topNavKey);
}

/**
 * お気に入りナビゲーションのイベントリスナーを設定する関数
 * @param {string} topNavKey - トップナビゲーションのキー
 */
function setupFavoritesNavEventListeners(topNavKey) {
    const favoritesNav = document.querySelector('.favorites-nav');
    const favoriteMenu = document.querySelector('.user-menu');
    
    if (!favoritesNav || !favoriteMenu) return;
    
    // ホバーイベントとクリックイベント
    addEventListeners(favoritesNav, {
        mouseenter: function() {
            favoriteMenu.style.display = 'block';
        },
        mouseleave: function() {
            favoriteMenu.style.display = 'none';
        },
        click: function(e) {
            e.stopPropagation(); // イベントの伝播を停止
            if (favoriteMenu.style.display === 'block') {
                favoriteMenu.style.display = 'none';
            } else {
                favoriteMenu.style.display = 'block';
            }
        }
    });
    
    // お気に入り項目のクリックイベント
    document.querySelectorAll('.user-menu-item').forEach(item => {
        addEventListeners(item, {
            click: function(e) {
                e.stopPropagation(); // イベントの伝播を停止
                const pageName = this.dataset.tooltip;
                const category = this.dataset.category;
                navigateToFavoritePage(topNavKey, pageName);
                favoriteMenu.style.display = 'none';
            }
        });
    });
    
    // ドキュメント全体のクリックでメニューを閉じる
    document.addEventListener('click', function() {
        favoriteMenu.style.display = 'none';
    });
}

/**
 * お気に入りページに遷移する関数
 * @param {string} topNavKey - トップナビゲーションのキー
 * @param {string} pageName - ページ名
 */
function navigateToFavoritePage(topNavKey, pageName) {
    // 既存のオーバーレイを削除（複数の可能性のあるオーバーレイセレクタを確認）
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
    
    // ページ名からカテゴリーを特定
    let category = '';
    let found = false;
    
    // navigationDataからカテゴリーを検索
    const navData = navigationData[topNavKey];
    if (!navData) return;
    
    navData.items.forEach(cat => {
        cat.submenu.forEach(item => {
            if (item === pageName) {
                category = cat.title;
                found = true;
            }
        });
    });
    
    if (found) {
        navigateToPage(topNavKey, category, pageName);
    }
}

/**
 * ダッシュボード用のサイドナビゲーションを生成する関数
 * @param {HTMLElement} sideNav - サイドナビゲーション要素
 */
function renderDashboardSideNav(sideNav) {
    // サイドナビゲーションをクリア
    clearElement(sideNav);
    
    // チーム選択ドロップダウンを追加
    const dropdownContainer = createDropdownContainer('team', teamData);
    sideNav.appendChild(dropdownContainer);
    
    // ダッシュボードメニューを作成
    const dashboardMenu = createElement('div', {
        className: 'side-nav-menu'
    });
    
    // ダッシュボードカテゴリーを作成
    const dashboardCategory = createElement('div', {
        className: 'nav-category'
    });
    
    // カテゴリーヘッダーを作成
    const categoryHeader = createElement('div', {
        className: 'nav-item-level1'
    }, `
        <span>ダッシュボード</span>
        <i class="fas fa-chevron-down caret"></i>
    `);
    
    // サブメニューを作成
    const submenu = createElement('div', {
        className: 'submenu'
    });
    
    // ダッシュボード項目
    const dashboardItems = [
        { name: "メインダッシュボード", active: true },
        { name: "カスタムダッシュボード一覧" }
    ];
    
    // ダッシュボード項目を追加
    dashboardItems.forEach(item => {
        const isCustomDashboardRestricted = item.name === 'カスタムダッシュボード一覧';
        const isRestricted = isCustomDashboardRestricted;
        const planType = 'standard';
        
        const itemElement = createElement('div', {
            className: `nav-item-level2 ${item.active ? 'active' : ''}`,
            dataset: {
                category: 'ダッシュボード',
                item: item.name
            }
        }, `
            <span>${item.name}</span>
            ${isRestricted ? '<div></div>' : ''}
        `);
        
        // 制限機能の場合はマスキングスタイルを適用
        if (isRestricted) {
            applyMenuItemRestrictionStyle(itemElement, planType);
        }
        
        submenu.appendChild(itemElement);
    });
    
    // 要素を組み立て
    dashboardCategory.appendChild(categoryHeader);
    dashboardCategory.appendChild(submenu);
    dashboardMenu.appendChild(dashboardCategory);
    sideNav.appendChild(dashboardMenu);
    
    // イベントリスナーを設定
    setupDashboardSideNavEventListeners();
}

/**
 * ダッシュボード用のサイドナビゲーションのイベントリスナーを設定する関数
 */
function setupDashboardSideNavEventListeners() {
    // カテゴリー開閉のイベントリスナーを設定
    document.querySelectorAll('.nav-item-level1').forEach(item => {
        addEventListeners(item, {
            click: function() {
                const submenu = this.nextElementSibling;
                submenu.classList.toggle('collapsed');
                this.classList.toggle('collapsed');
            }
        });
    });
    
    // メニュー項目クリック時のイベントリスナーを設定
    document.querySelectorAll('.nav-item-level2').forEach(item => {
        addEventListeners(item, {
            click: function() {
                const menuItem = this.dataset.item;
                
                // 既存のオーバーレイを削除（複数の可能性のあるオーバーレイセレクタを確認）
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
                
                // アクティブ状態を更新
                document.querySelectorAll('.nav-item-level2').forEach(i => {
                    i.classList.remove('active');
                });
                this.classList.add('active');
                
                // ダッシュボードページに遷移
                navigateToDashboardPage(menuItem);
            }
        });
    });
}

/**
 * ダッシュボードページに遷移する関数
 * @param {string} dashboardName - ダッシュボード名
 */
function navigateToDashboardPage(dashboardName) {
    // コンテンツエリアを取得
    const contentArea = document.getElementById('content-area');
    const content = document.getElementById('content');
    
    // コンテンツエリアをクリア
    clearElement(contentArea);
    
    // コンテンツエリアの余白を削除
    contentArea.style.padding = '0';
    
    // コンテンツの左マージンを設定（サイドナビゲーションの幅と一致させる）
    content.style.marginLeft = '276px';
    
    // サイドナビゲーション開閉ボタンを表示
    document.getElementById('side-nav-toggle').style.display = '';
    
    // 背景色を白に設定
    document.body.style.background = '#FFFFFF';
    
    // ダッシュボード画像を表示
    let imagePath = 'メインダッシュボード';
    if (dashboardName !== 'メインダッシュボード') {
        // カスタムダッシュボードの場合はメインダッシュボードの画像を使用
        imagePath = 'メインダッシュボード';
    }
    
    contentArea.innerHTML = `
        <div style="position: relative; z-index: 1;">
            <img src="../../Full Screenshot/${imagePath}.png" alt="${dashboardName}" style="width: 100%; border-radius: 8px;">
        </div>
    `;
    
    // カスタムダッシュボード一覧の場合は制限オーバーレイを表示
    if (dashboardName === 'カスタムダッシュボード一覧') {
        // 既存のオーバーレイを削除（複数の可能性のあるオーバーレイセレクタを確認）
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
        
        // オーバーレイを作成してbodyに追加
        import('/js/modules/plan-restriction-module.js').then(module => {
            const overlay = module.createRestrictionOverlay('standard');
            document.body.appendChild(overlay);
        });
    }
}
