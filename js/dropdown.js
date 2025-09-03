/**
 * ドロップダウン関連の機能を定義するファイル
 */

import { updateSelectedTeam, updateSelectedMember, updateSelectedProject } from './data.js';

/**
 * ドロップダウンを作成する関数
 * @param {string} title - ドロップダウンのタイトル
 * @param {Array} items - ドロップダウンの項目
 * @param {string} placeholder - 検索プレースホルダー
 * @param {string} selectedValue - 現在選択されている値
 * @returns {string} ドロップダウンのHTML
 */
export function createDropdown(title, items, placeholder, selectedValue) {
    let itemsHTML = '';
    items.forEach(item => {
        itemsHTML += `<div class="dropdown-item">${item}</div>`;
    });
    
    // 選択値がある場合はそれを表示、なければデフォルトのタイトルを表示
    const displayText = selectedValue || title;
    
    return `
        <div class="dropdown-container" style="max-width: 300px; margin: 20px 0;">
            <div class="dropdown-select">
                <span>${displayText}</span>
                <i class="fas fa-chevron-down"></i>
            </div>
            <div class="dropdown-menu" style="z-index: 99999; position: absolute; top: 100%; left: 0; width: 100%;">
                <div class="dropdown-search">
                    <input type="text" placeholder="${placeholder}" class="dropdown-search-input">
                </div>
                <div class="dropdown-items">
                    ${itemsHTML}
                </div>
            </div>
        </div>
    `;
}

/**
 * ドロップダウンにイベントリスナーを設定する関数
 * @param {Element} container - ドロップダウンを含む要素
 * @param {string} type - ドロップダウンのタイプ（'team', 'member', 'project'）
 */
export function setupDropdownListeners(container, type) {
    const dropdownSelect = container.querySelector('.dropdown-select');
    const dropdownMenu = container.querySelector('.dropdown-menu');
    
    if (dropdownSelect && dropdownMenu) {
        // ドロップダウンメニューのスタイルを設定
        dropdownMenu.style.zIndex = '99999';
        dropdownMenu.style.position = 'absolute';
        dropdownMenu.style.top = '100%';
        dropdownMenu.style.left = '0';
        dropdownMenu.style.width = '100%';
        
        // ドロップダウン開閉のイベントリスナー
        dropdownSelect.addEventListener('click', function(e) {
            e.stopPropagation(); // イベントの伝播を停止
            
            // 他のすべてのドロップダウンメニューを閉じる
            document.querySelectorAll('.dropdown-menu').forEach(menu => {
                if (menu !== dropdownMenu) {
                    menu.style.display = 'none';
                }
            });
            
            // このドロップダウンメニューを開閉
            if (dropdownMenu.style.display === 'block') {
                dropdownMenu.style.display = 'none';
            } else {
                dropdownMenu.style.display = 'block';
                // 初期表示時にスタイルを明示的に設定
                dropdownMenu.style.position = 'absolute';
                dropdownMenu.style.top = '100%';
                dropdownMenu.style.left = '0';
                dropdownMenu.style.width = '100%';
                dropdownMenu.style.zIndex = '99999';
            }
        });
        
        // 項目選択のイベントリスナー
        const dropdownItems = dropdownMenu.querySelectorAll('.dropdown-item');
        dropdownItems.forEach(item => {
            item.addEventListener('click', function(e) {
                e.stopPropagation(); // イベントの伝播を停止
                
                // 選択した値をグローバル変数に保存
                const selectedValue = this.textContent;
                if (type === 'team') {
                    updateSelectedTeam(selectedValue);
                } else if (type === 'member') {
                    updateSelectedMember(selectedValue);
                } else if (type === 'project') {
                    updateSelectedProject(selectedValue);
                }
                
                // ドロップダウンの表示を更新
                dropdownSelect.querySelector('span').textContent = selectedValue;
                dropdownMenu.style.display = 'none';
            });
        });
        
        // 検索機能のイベントリスナー
        const searchInput = dropdownMenu.querySelector('.dropdown-search-input');
        if (searchInput) {
            searchInput.addEventListener('input', function() {
                const searchText = this.value.toLowerCase();
                dropdownItems.forEach(item => {
                    const itemText = item.textContent.toLowerCase();
                    if (itemText.includes(searchText)) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
            
            // 検索入力時にドロップダウンが閉じないようにする
            searchInput.addEventListener('click', function(e) {
                e.stopPropagation();
            });
        }
        
        // ドロップダウン外クリックで閉じる
        document.addEventListener('click', function(e) {
            if (!container.contains(e.target)) {
                dropdownMenu.style.display = 'none';
            }
        });
    }
}
