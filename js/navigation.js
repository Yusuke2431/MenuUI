/**
 * ナビゲーション関連の機能を定義するファイル
 */

import { navigationData, teamData, memberData, projectData, selectedTeam, selectedMember, selectedProject } from './data.js';
import { isFeatureRestricted, isRecommendedFeature, getMenuDescription } from './utils.js';
import { createDropdown, setupDropdownListeners } from './dropdown.js';

/**
 * メニュー一覧ページを表示する関数
 * @param {string} topNavKey - トップナビゲーションのキー
 */
export function renderMenuListPage(topNavKey) {
    const contentArea = document.getElementById('content-area');
    const content = document.getElementById('content');
    
    // コンテンツエリアをクリア
    contentArea.innerHTML = '';
    
    // お気に入りの場合は余白なしで表示
    if (topNavKey === 'favorites') {
        // コンテンツエリアの余白を削除
        contentArea.style.padding = '0';
        // コンテンツの左マージンを削除
        content.style.marginLeft = '0';
        // サイドナビゲーション開閉ボタンを非表示
        document.getElementById('side-nav-toggle').style.display = 'none';
        
        // 背景色をグレーに設定
        document.body.style.background = '#f8f9fa';
        
        // お気に入りページの内容を表示
        renderFavoritesPage(contentArea);
        return;
    }
    
    // ダッシュボードの場合は特別な表示
    if (topNavKey === 'dashboard') {
        // コンテンツエリアの余白を削除
        contentArea.style.padding = '0';
        // コンテンツの左マージンを設定
        content.style.marginLeft = '276px';
        // サイドナビゲーション開閉ボタンを表示
        document.getElementById('side-nav-toggle').style.display = '';
        
        // 背景色を白に設定
        document.body.style.background = '#FFFFFF';
        
        // ダッシュボードの内容を表示
        contentArea.innerHTML = `
            <img src="Full Screenshot/メインダッシュボード.png" alt="メインダッシュボード" style="width: 100%; border-radius: 8px;">
        `;
        return;
    } else {
        // 通常表示時は元に戻す
        content.style.marginLeft = '';
        document.getElementById('side-nav-toggle').style.display = '';
    }
    
    const navData = navigationData[topNavKey];
    if (!navData) return;
    
    // メニュー一覧ページでは余白を保持（左右の余白なし）
    contentArea.style.padding = '0 0 20px';
    
    // メニュー一覧ページではドロップダウンは表示しない（サイドナビに表示されるため）
    
    // カテゴリーごとのセクションを作成
    navData.items.forEach(category => {
        // カテゴリーセクションを作成
        const categorySection = document.createElement('div');
        categorySection.className = 'category-section';
        categorySection.innerHTML = `
            <h3 class="category-title">${category.title}</h3>
        `;
        
        // カード一覧を作成
        const cardsContainer = document.createElement('div');
        cardsContainer.className = 'cards-container';
        
        // カテゴリー内のメニュー項目をカードとして表示
        category.submenu.forEach(item => {
            const isRestricted = isFeatureRestricted(item);
            const isRecommended = isRecommendedFeature(item);
            
            // カード要素を作成
            const card = document.createElement('div');
            card.className = 'menu-card';
            if (isRestricted) {
                card.classList.add('restricted');
            }
            
            // カード内容を設定
            card.innerHTML = `
                <div class="card-image ${isRestricted ? 'restricted-image' : ''}">
                    <img src="Full Screenshot/${item}.png" alt="${item}">
                </div>
                <div class="card-title-container">
                    <div class="card-title">${item}</div>
                    ${isRestricted ? '<i class="fas fa-lock lock-icon"></i>' : ''}
                </div>
                <div class="card-subtitle">${getMenuDescription(topNavKey, category.title, item)}</div>
            `;
            
            // カードをクリックしたときの処理
            card.addEventListener('click', function() {
                navigateToPage(topNavKey, category.title, item);
            });
            
            cardsContainer.appendChild(card);
        });
        
        categorySection.appendChild(cardsContainer);
        contentArea.appendChild(categorySection);
    });
}

/**
 * お気に入りページの内容を表示する関数
 * @param {Element} contentArea - コンテンツエリア要素
 */
function renderFavoritesPage(contentArea) {
    // お気に入りページのタイトルを追加
    const pageTitle = document.createElement('h2');
    pageTitle.className = 'page-title';
    pageTitle.textContent = 'お気に入りメニュー一覧';
    pageTitle.style.margin = '20px';
    contentArea.appendChild(pageTitle);
    
    // お気に入りカードを表示するコンテナを作成
    const cardsContainer = document.createElement('div');
    cardsContainer.className = 'cards-container';
    cardsContainer.style.padding = '0 20px 20px';
    
    // お気に入りメニューのデータ
    const favoriteMenus = [
        { name: "チームサマリ", category: "アクティビティ", topNavKey: "team", description: "チーム全体のリードタイムやアクティビティを俯瞰して把握できる機能です" },
        { name: "レビュー分析", category: "開発プロセス", topNavKey: "team", description: "プルリクのレビューの速度や傾向を可視化し、ボトルネックを把握できる機能です" },
        { name: "開発生産性スコア", category: "ベンチマーク", topNavKey: "team", description: "Findy Team+全体のデータをもとに、開発パフォーマンスを相対スコアで把握できる機能です" },
        { name: "メンバー詳細", category: "アクティビティ", topNavKey: "member", description: "個々のメンバーのアクティビティや傾向を詳細に確認できる機能です" }
    ];
    
    // お気に入りメニューのカードを作成
    favoriteMenus.forEach(menu => {
        // カード要素を作成
        const card = document.createElement('div');
        card.className = 'menu-card';
        
        // カード内容を設定
        card.innerHTML = `
            <div class="card-image">
                <img src="Full Screenshot/${menu.name}.png" alt="${menu.name}">
            </div>
            <div class="card-title-container">
                <div class="card-title">${menu.name}</div>
                <i class="fas fa-star" style="color: #FFB400; margin-left: 8px;"></i>
            </div>
            <div class="card-subtitle">${menu.description}</div>
        `;
        
        // カードをクリックしたときの処理
        card.addEventListener('click', function() {
            // トップナビゲーションのアクティブ状態を更新
            document.querySelectorAll('.top-nav-item').forEach(item => {
                if (item.getAttribute('data-key') === menu.topNavKey) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });
            
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
            navigateToPage(menu.topNavKey, menu.category, menu.name);
        });
        
        cardsContainer.appendChild(card);
    });
    
    contentArea.appendChild(cardsContainer);
}

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
    sideNav.innerHTML = '';
    
    // チーム選択ドロップダウンを含むヘッダー
    const selectContainer = document.createElement('div');
    selectContainer.className = 'select-container';
    selectContainer.style.position = 'relative';
    selectContainer.style.zIndex = '900';
    selectContainer.style.margin = '16px';
    selectContainer.style.width = 'calc(100% - 32px)'; // サイドナビに収まるサイズ
    
    // 適切なドロップダウンを作成
    if (topNavKey === 'team') {
        selectContainer.innerHTML = createDropdown('チームを選択', teamData, 'チームを検索...', selectedTeam);
    } else if (topNavKey === 'member') {
        selectContainer.innerHTML = createDropdown('メンバーを選択', memberData, 'メンバーを検索...', selectedMember);
    } else if (topNavKey === 'project') {
        selectContainer.innerHTML = createDropdown('プロジェクトを選択', projectData, 'プロジェクトを検索...', selectedProject);
    }
    
    // ドロップダウンをサイドナビに追加
    sideNav.appendChild(selectContainer);
    
    // ドロップダウンのイベントリスナーを設定
    setupDropdownListeners(selectContainer, topNavKey);
    
    // サイドナビゲーションの内容を生成
    let sideNavHTML = `
        <div class="side-nav-header">
            <div class="menu-list-link">
                <i class="fas fa-th-large"></i> メニュー一覧
            </div>
            <div class="favorites-nav">
                <i class="fas fa-star"></i> お気に入り
                <div class="favorites-tooltip">
                    <div class="favorite-item" data-tooltip="チームサマリ">
                        <i class="fas fa-star"></i>
                    </div>
                    <div class="favorite-item" data-tooltip="レビュー分析">
                        <i class="fas fa-star"></i>
                    </div>
                    <div class="favorite-item" data-tooltip="開発生産性スコア">
                        <i class="fas fa-star"></i>
                    </div>
                    <div class="favorite-item" data-tooltip="メンバー詳細">
                        <i class="fas fa-star"></i>
                    </div>
                </div>
            </div>
        </div>
        <div class="side-nav-menu">
    `;
    
    // カテゴリーとサブメニューを生成
    navData.items.forEach(category => {
        sideNavHTML += `
            <div class="nav-category">
                <div class="nav-item-level1">
                    <span>${category.title}</span>
                    <i class="fas fa-chevron-down caret"></i>
                </div>
                <div class="submenu">
        `;
        
        // サブメニュー項目を生成
        category.submenu.forEach(item => {
            const isRestricted = isFeatureRestricted(item);
            const isRecommended = isRecommendedFeature(item);
            
            sideNavHTML += `
                <div class="nav-item-level2 ${isRestricted ? 'restricted' : ''}" data-category="${category.title}" data-item="${item}">
                    <span>${item}</span>
                    <div>
                        ${isRestricted ? '<i class="fas fa-lock lock-icon"></i>' : ''}
                    </div>
                </div>
            `;
        });
        
        sideNavHTML += `
                </div>
            </div>
        `;
    });
    
    sideNavHTML += `
        </div>
    `;
    
    // サイドナビメニューを追加
    const menuContainer = document.createElement('div');
    menuContainer.innerHTML = sideNavHTML;
    sideNav.appendChild(menuContainer);
    
    // カテゴリー開閉のイベントリスナーを設定
    document.querySelectorAll('.nav-item-level1').forEach(item => {
        item.addEventListener('click', function() {
            const submenu = this.nextElementSibling;
            submenu.classList.toggle('collapsed');
            this.classList.toggle('collapsed');
        });
    });
    
    // メニュー項目クリック時のイベントリスナーを設定
    document.querySelectorAll('.nav-item-level2').forEach(item => {
        item.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            const menuItem = this.getAttribute('data-item');
            
            // アクティブ状態を更新
            document.querySelectorAll('.nav-item-level2').forEach(i => {
                i.classList.remove('active');
            });
            this.classList.add('active');
            
            // 画面遷移
            navigateToPage(topNavKey, category, menuItem);
        });
    });
    
    // メニュー一覧リンクのイベントリスナーを設定
    document.querySelector('.menu-list-link').addEventListener('click', function() {
        // 既存のオーバーレイを削除（制限ページから移動した場合）
        const existingOverlay = document.querySelector('div[style*="position: fixed"][style*="z-index: 9999"]');
        if (existingOverlay) {
            existingOverlay.remove();
        }
        
        renderMenuListPage(topNavKey);
    });
    
    // お気に入りナビゲーションのイベントリスナーを設定
    const favoritesNav = document.querySelector('.favorites-nav');
    
    // お気に入りメニューを作成
    const favoriteMenu = document.createElement('div');
    favoriteMenu.className = 'user-menu';
    favoriteMenu.style.width = '200px';
    favoriteMenu.style.right = 'auto';
    favoriteMenu.style.left = '0'; // 左端に配置
    favoriteMenu.style.top = '100%'; // 親要素の下に配置
    favoriteMenu.style.zIndex = '9999'; // z-indexをさらに上げる
    
    // お気に入りメニューの内容を設定
    const favoritePages = [
        { name: "チームサマリ", category: "アクティビティ", icon: "fa-chart-line" },
        { name: "レビュー分析", category: "開発プロセス", icon: "fa-code-branch" },
        { name: "開発生産性スコア", category: "ベンチマーク", icon: "fa-chart-bar" },
        { name: "メンバー詳細", category: "アクティビティ", icon: "fa-user" }
    ];
    
    favoritePages.forEach(page => {
        const menuItem = document.createElement('div');
        menuItem.className = 'user-menu-item';
        menuItem.innerHTML = `
            <i class="fas ${page.icon}"></i>
            ${page.name}
        `;
        
        // クリックイベント
        menuItem.addEventListener('click', function() {
            // ページに遷移
            navigateToPage(topNavKey, page.category, page.name);
            // メニューを非表示
            favoriteMenu.style.display = 'none';
        });
        
        favoriteMenu.appendChild(menuItem);
    });
    
    // お気に入りナビゲーションにメニューを追加
    favoritesNav.appendChild(favoriteMenu);
    
    // ホバーイベントとクリックイベント
    favoritesNav.addEventListener('mouseenter', function() {
        favoriteMenu.style.display = 'block';
    });
    
    favoritesNav.addEventListener('mouseleave', function() {
        favoriteMenu.style.display = 'none';
    });
    
    // クリックイベントも追加
    favoritesNav.addEventListener('click', function(e) {
        e.stopPropagation(); // イベントの伝播を停止
        if (favoriteMenu.style.display === 'block') {
            favoriteMenu.style.display = 'none';
        } else {
            favoriteMenu.style.display = 'block';
        }
    });
    
    // ドキュメント全体のクリックでメニューを閉じる
    document.addEventListener('click', function() {
        favoriteMenu.style.display = 'none';
    });
}

/**
 * ダッシュボード用のサイドナビゲーションを生成する関数
 * @param {Element} sideNav - サイドナビゲーション要素
 */
function renderDashboardSideNav(sideNav) {
    // チーム選択ドロップダウンを含むヘッダー
    const selectContainer = document.createElement('div');
    selectContainer.className = 'select-container';
    selectContainer.style.position = 'relative';
    selectContainer.style.zIndex = '900';
    selectContainer.style.margin = '16px';
    selectContainer.style.width = 'calc(100% - 32px)'; // サイドナビに収まるサイズ
    
    // チーム選択ドロップダウンを作成
    selectContainer.innerHTML = createDropdown('チームを選択', teamData, 'チームを検索...', selectedTeam);
    
    // サイドナビゲーションの内容を生成
    let sideNavHTML = `
        <div class="side-nav-menu">
            <div class="nav-category">
                <div class="nav-item-level1">
                    <span>ダッシュボード</span>
                    <i class="fas fa-chevron-down caret"></i>
                </div>
                <div class="submenu">
                    <div class="nav-item-level2 active" data-category="ダッシュボード" data-item="メインダッシュボード">
                        <span>メインダッシュボード</span>
                    </div>
                    <div class="nav-item-level2" data-category="ダッシュボード" data-item="カスタムダッシュボード1">
                        <span>カスタムダッシュボード1</span>
                    </div>
                    <div class="nav-item-level2" data-category="ダッシュボード" data-item="カスタムダッシュボード2">
                        <span>カスタムダッシュボード2</span>
                    </div>
                    <div class="nav-item-level2" data-category="ダッシュボード" data-item="プロジェクト進捗ダッシュボード">
                        <span>プロジェクト進捗ダッシュボード</span>
                    </div>
                    <div class="nav-item-level2" data-category="ダッシュボード" data-item="チーム生産性ダッシュボード">
                        <span>チーム生産性ダッシュボード</span>
                    </div>
                    <div class="nav-item-level2" data-category="ダッシュボード" data-item="開発者体験ダッシュボード">
                        <span>開発者体験ダッシュボード</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // サイドナビゲーションに内容を設定
    sideNav.innerHTML = '';
    sideNav.appendChild(selectContainer);
    
    // ドロップダウンのイベントリスナーを設定
    setupDropdownListeners(selectContainer, 'dashboard');
    
    // サイドナビメニューを追加
    const menuContainer = document.createElement('div');
    menuContainer.innerHTML = sideNavHTML;
    sideNav.appendChild(menuContainer.firstElementChild);
    
    // カテゴリー開閉のイベントリスナーを設定
    document.querySelectorAll('.nav-item-level1').forEach(item => {
        item.addEventListener('click', function() {
            const submenu = this.nextElementSibling;
            submenu.classList.toggle('collapsed');
            this.classList.toggle('collapsed');
        });
    });
    
    // メニュー項目クリック時のイベントリスナーを設定
    document.querySelectorAll('.nav-item-level2').forEach(item => {
        item.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            const menuItem = this.getAttribute('data-item');
            
            // アクティブ状態を更新
            document.querySelectorAll('.nav-item-level2').forEach(i => {
                i.classList.remove('active');
            });
            this.classList.add('active');
            
            // ダッシュボードページに遷移
            navigateToDashboardPage(menuItem);
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
    contentArea.innerHTML = '';
    
    // コンテンツエリアの余白を削除
    contentArea.style.padding = '0';
    
    // コンテンツの左マージンを設定
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
        <img src="Full Screenshot/${imagePath}.png" alt="${dashboardName}" style="width: 100%; border-radius: 8px;">
    `;
}

/**
 * お気に入りページに遷移する関数
 * @param {string} topNavKey - トップナビゲーションのキー
 * @param {string} pageName - ページ名
 */
export function navigateToFavoritePage(topNavKey, pageName) {
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
 * 特定のページに遷移する関数
 * @param {string} topNavKey - トップナビゲーションのキー
 * @param {string} category - カテゴリー名
 * @param {string} item - 項目名
 */
export function navigateToPage(topNavKey, category, item) {
    // 制限機能かどうかを確認
    const isRestricted = isFeatureRestricted(item);
    
    // アラートは表示しない（マスキングオーバーレイで表示する）
    
    // 既存のオーバーレイを削除（別のページに移動する場合）
    const existingOverlay = document.querySelector('div[style*="position: fixed"][style*="z-index: 9999"]');
    if (existingOverlay) {
        existingOverlay.remove();
    }
    
    // コンテンツエリアを取得
    const contentArea = document.getElementById('content-area');
    
    // コンテンツエリアをクリア
    contentArea.innerHTML = '';
    
    // 背景色を白に設定
    document.body.style.background = '#FFFFFF';
    
    // メニュー一覧以外の各ページではh2は不要
    
    // 画像を表示
    const img = document.createElement('img');
    img.src = `Full Screenshot/${item}.png`;
    img.alt = item;
    img.style.width = '100%';
    img.style.borderRadius = '8px';
    
    // 画像を追加
    contentArea.appendChild(img);
    
    // 制限機能の場合はメインコンテンツエリア全体にマスキングを適用
    if (isRestricted) {
        // コンテンツエリア全体をマスキングするためのオーバーレイを作成
        const pageOverlay = document.createElement('div');
        pageOverlay.style.position = 'fixed';
        pageOverlay.style.top = '60px'; // トップナビゲーションの高さ
        pageOverlay.style.left = '276px'; // サイドナビゲーションの幅
        pageOverlay.style.right = '0';
        pageOverlay.style.bottom = '0';
        pageOverlay.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
        pageOverlay.style.backdropFilter = 'blur(5px)';
        pageOverlay.style.zIndex = '9999';
        pageOverlay.style.display = 'flex';
        pageOverlay.style.flexDirection = 'column';
        pageOverlay.style.alignItems = 'center';
        pageOverlay.style.justifyContent = 'center';
        pageOverlay.style.padding = '20px';
        
        // ロックアイコンを追加
        const lockIcon = document.createElement('i');
        lockIcon.className = 'fas fa-lock';
        lockIcon.style.fontSize = '64px';
        lockIcon.style.color = '#1E7ED5';
        lockIcon.style.marginBottom = '30px';
        
        // タイトルを追加
        const title = document.createElement('div');
        title.textContent = 'この機能は Standardプラン以上で利用可能です';
        title.style.fontSize = '24px';
        title.style.fontWeight = 'bold';
        title.style.color = '#333';
        title.style.textAlign = 'center';
        title.style.marginBottom = '20px';
        
        // 説明を追加
        const description = document.createElement('div');
        description.innerHTML = `
            <p style="font-size: 16px; color: #666; text-align: center; margin-bottom: 30px;">
                Standardプランにアップグレードすると、以下の機能が利用できるようになります：
            </p>
            <ul style="font-size: 16px; color: #666; text-align: left; margin-bottom: 30px; list-style-type: none;">
                <li style="margin-bottom: 10px;"><i class="fas fa-check" style="color: #1E7ED5; margin-right: 10px;"></i> チーム比較機能</li>
                <li style="margin-bottom: 10px;"><i class="fas fa-check" style="color: #1E7ED5; margin-right: 10px;"></i> 詳細比較機能</li>
                <li style="margin-bottom: 10px;"><i class="fas fa-check" style="color: #1E7ED5; margin-right: 10px;"></i> チームスタッツエクスポート</li>
                <li style="margin-bottom: 10px;"><i class="fas fa-check" style="color: #1E7ED5; margin-right: 10px;"></i> ミーティング分析</li>
                <li style="margin-bottom: 10px;"><i class="fas fa-check" style="color: #1E7ED5; margin-right: 10px;"></i> チームサーベイ</li>
            </ul>
        `;
        
        // ボタンを追加
        const button = document.createElement('button');
        button.textContent = 'プランをアップグレードする';
        button.style.backgroundColor = '#1E7ED5';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '4px';
        button.style.padding = '12px 24px';
        button.style.fontSize = '16px';
        button.style.fontWeight = 'bold';
        button.style.cursor = 'pointer';
        button.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
        
        // ボタンのホバー効果
        button.addEventListener('mouseover', function() {
            this.style.backgroundColor = '#1565C0';
        });
        
        button.addEventListener('mouseout', function() {
            this.style.backgroundColor = '#1E7ED5';
        });
        
        // ボタンのクリックイベント
        button.addEventListener('click', function() {
            alert('プランのアップグレードについては営業担当までお問い合わせください。');
        });
        
        pageOverlay.appendChild(lockIcon);
        pageOverlay.appendChild(title);
        pageOverlay.appendChild(description);
        pageOverlay.appendChild(button);
        
        document.body.appendChild(pageOverlay);
        
        // サイドナビが閉じられた場合のオーバーレイ位置調整
        document.getElementById('side-nav-toggle').addEventListener('click', function() {
            if (document.getElementById('side-nav').classList.contains('collapsed')) {
                pageOverlay.style.left = '0';
            } else {
                pageOverlay.style.left = '276px';
            }
        });
    }
    
    // サイドナビゲーションのアクティブ状態を更新
    document.querySelectorAll('.nav-item-level2').forEach(navItem => {
        if (navItem.getAttribute('data-item') === item) {
            navItem.classList.add('active');
        } else {
            navItem.classList.remove('active');
        }
    });
}
