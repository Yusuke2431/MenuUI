/**
 * アプリケーションメインモジュール
 * アプリケーションの初期化と全体的な制御を行う
 */

import { renderSideNav } from './side-nav-module.js';
import { renderMenuListPage } from './menu-list-module.js';
import { updateTopNavActiveState, navigateToPage } from './page-navigation-module.js';

// デフォルト値
const DEFAULT_NAV_KEY = 'team';

/**
 * アプリケーションを初期化する関数
 */
export function initializeApp() {
    // 初期表示
    updateTopNavActiveState(DEFAULT_NAV_KEY);
    renderSideNav(DEFAULT_NAV_KEY);
    renderMenuListPage(DEFAULT_NAV_KEY);
    
    // イベント設定
    setupTopNavEvents();
    setupSideNavToggleEvent();
}

/**
 * トップナビゲーションのイベントを設定する関数
 */
function setupTopNavEvents() {
    document.querySelectorAll('.top-nav-item').forEach(item => {
        item.addEventListener('click', handleTopNavClick);
    });
}

/**
 * トップナビゲーションクリック時の処理
 * @param {Event} event クリックイベント
 */
function handleTopNavClick(event) {
    const key = event.currentTarget.getAttribute('data-key');
    removeOverlays();
    updateTopNavActiveState(key);
    renderSideNav(key);
    
    if (key === 'dashboard') {
        navigateToPage(key, 'ダッシュボード', 'メインダッシュボード');
    } else {
        renderMenuListPage(key);
    }
}

/**
 * 制限ページからのオーバーレイを削除
 */
function removeOverlays() {
    const overlaySelectors = [
        '.restriction-overlay',
        'div[style*="position: fixed"][style*="z-index: 9999"]',
        'div[style*="backdrop-filter: blur"]',
        'div[style*="backgroundColor: rgba(255, 255, 255, 0.8)"]'
    ];
    
    overlaySelectors.forEach(selector => {
        const overlay = document.querySelector(selector);
        if (overlay) overlay.remove();
    });
}

/**
 * サイドナビゲーション開閉ボタンのイベントを設定する関数
 */
function setupSideNavToggleEvent() {
    const sideNavToggle = document.getElementById('side-nav-toggle');
    if (!sideNavToggle) return;
    
    sideNavToggle.addEventListener('click', toggleSideNav);
}

/**
 * サイドナビゲーションの開閉を切り替える
 */
function toggleSideNav() {
    const sideNav = document.getElementById('side-nav');
    const sideNavToggle = document.getElementById('side-nav-toggle');
    const content = document.getElementById('content');
    
    sideNav.classList.toggle('collapsed');
    sideNavToggle.classList.toggle('collapsed');
    
    const isOpen = !sideNav.classList.contains('collapsed');
    
    // 状態更新
    sideNavToggle.setAttribute('data-menu-open', isOpen.toString());
    sideNavToggle.setAttribute('aria-label', isOpen ? 'メニューを小さく表示' : 'メニューを大きく表示');
    
    // コンテンツ領域のマージン調整
    content.style.marginLeft = isOpen ? '' : '0';
}

// DOMContentLoaded イベントでアプリケーションを初期化
document.addEventListener('DOMContentLoaded', initializeApp);
