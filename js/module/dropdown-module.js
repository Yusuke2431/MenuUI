/**
 * ドロップダウンモジュール
 * ドロップダウンの作成と操作に関する機能
 */

import { selectedState, updateSelectedState } from './data-module.js';
import { createElement, addEventListeners, toggleVisibility } from './utils-module.js';

/**
 * ドロップダウンを作成する関数
 * @param {string} title - ドロップダウンのタイトル
 * @param {Array} items - ドロップダウンの項目
 * @param {string} placeholder - 検索プレースホルダー
 * @param {string} selectedValue - 現在選択されている値
 * @returns {string} ドロップダウンのHTML
 */
export function createDropdown(title, items, placeholder, selectedValue) {
    // 選択値がある場合はそれを表示、なければデフォルトのタイトルを表示
    const displayText = selectedValue || title;
    
    // ドロップダウンコンテナを作成
    const container = createElement('div', {
        className: 'dropdown-container',
        style: {
            width: '100%',
            margin: '0'
        }
    });
    
    // ドロップダウン選択部分を作成
    const select = createElement('div', {
        className: 'dropdown-select'
    }, `
        <span>${displayText}</span>
        <i class="fas fa-chevron-down"></i>
    `);
    
    // ドロップダウンメニューを作成
    const menu = createElement('div', {
        className: 'dropdown-menu',
        style: {
            zIndex: '999',
            position: 'absolute',
            top: '100%',
            left: '0',
            width: '100%',
            display: 'none'
        }
    });
    
    // 検索部分を作成
    const search = createElement('div', {
        className: 'dropdown-search'
    }, `
        <input type="text" placeholder="${placeholder}" class="dropdown-search-input">
    `);
    
    // 項目リストを作成
    const itemsList = createElement('div', {
        className: 'dropdown-items'
    });
    
    // 項目を追加
    items.forEach(item => {
        const itemElement = createElement('div', {
            className: 'dropdown-item'
        }, item);
        itemsList.appendChild(itemElement);
    });
    
    // 要素を組み立て
    menu.appendChild(search);
    menu.appendChild(itemsList);
    container.appendChild(select);
    container.appendChild(menu);
    
    return container;
}

/**
 * ドロップダウンにイベントリスナーを設定する関数
 * @param {HTMLElement} container - ドロップダウンを含む要素
 * @param {string} type - ドロップダウンのタイプ（'team', 'member', 'project'）
 */
export function setupDropdownListeners(container, type) {
    const dropdownSelect = container.querySelector('.dropdown-select');
    const dropdownMenu = container.querySelector('.dropdown-menu');
    const dropdownItems = dropdownMenu.querySelectorAll('.dropdown-item');
    const searchInput = dropdownMenu.querySelector('.dropdown-search-input');
    
    if (!dropdownSelect || !dropdownMenu) return;
    
    // ドロップダウン開閉のイベントリスナー
    addEventListeners(dropdownSelect, {
        click: function(e) {
            e.stopPropagation(); // イベントの伝播を停止
            
            // 他のすべてのドロップダウンメニューを閉じる
            document.querySelectorAll('.dropdown-menu').forEach(menu => {
                if (menu !== dropdownMenu) {
                    toggleVisibility(menu, false);
                }
            });
            
            // このドロップダウンメニューを開閉
            toggleVisibility(dropdownMenu, dropdownMenu.style.display !== 'block');
        }
    });
    
    // 項目選択のイベントリスナー
    dropdownItems.forEach(item => {
        addEventListeners(item, {
            click: function(e) {
                e.stopPropagation(); // イベントの伝播を停止
                
                // 選択した値を保存
                const selectedValue = this.textContent;
                updateSelectedState(type, selectedValue);
                
                // ドロップダウンの表示を更新
                dropdownSelect.querySelector('span').textContent = selectedValue;
                toggleVisibility(dropdownMenu, false);
            }
        });
    });
    
    // 検索機能のイベントリスナー
    if (searchInput) {
        addEventListeners(searchInput, {
            input: function() {
                const searchText = this.value.toLowerCase();
                dropdownItems.forEach(item => {
                    const itemText = item.textContent.toLowerCase();
                    toggleVisibility(item, itemText.includes(searchText));
                });
            },
            click: function(e) {
                e.stopPropagation(); // イベントの伝播を停止
            }
        });
    }
    
    // ドロップダウン外クリックで閉じる
    document.addEventListener('click', function() {
        toggleVisibility(dropdownMenu, false);
    });
}

/**
 * ドロップダウンコンテナを作成する関数
 * @param {string} type - ドロップダウンのタイプ（'team', 'member', 'project'）
 * @param {Array} items - ドロップダウンの項目
 * @returns {HTMLElement} ドロップダウンコンテナ
 */
export function createDropdownContainer(type, items) {
    // タイプに応じた設定
    const config = {
        team: {
            title: 'チームを選択',
            placeholder: 'チームを検索...',
            selectedValue: selectedState.team,
            showSettings: true
        },
        member: {
            title: 'メンバーを選択',
            placeholder: 'メンバーを検索...',
            selectedValue: selectedState.member,
            showSettings: false
        },
        project: {
            title: 'プロジェクトを選択',
            placeholder: 'プロジェクトを検索...',
            selectedValue: selectedState.project,
            showSettings: false
        }
    };
    
    // 設定が存在しない場合は空のコンテナを返す
    if (!config[type]) return createElement('div');
    
    // ドロップダウンコンテナを作成
    const container = createElement('div', {
        className: 'select-container',
        style: {
            position: 'relative',
            zIndex: '900',
            margin: '10px 16px',
            width: 'calc(100% - 32px)' // サイドナビに収まるサイズ
        }
    });
    
    // ドロップダウンを作成して追加
    const dropdown = createDropdown(
        config[type].title,
        items,
        config[type].placeholder,
        config[type].selectedValue
    );
    
    container.appendChild(dropdown);
    
    // チームの場合は設定アイコンを追加
    if (config[type].showSettings) {
        // ドロップダウンコンテナを横並びのフレックスボックスに変更
        const dropdownRow = createElement('div', {
            className: 'dropdown-row',
            style: {
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                width: '100%'
            }
        });
        
        // 既存のドロップダウンを取り出す
        const existingDropdown = container.querySelector('.dropdown-container');
        if (existingDropdown) {
            container.removeChild(existingDropdown);
            
            // ドロップダウンをフレックスボックスに追加し、幅を調整
            existingDropdown.style.flex = '1';
            dropdownRow.appendChild(existingDropdown);
            
            // 設定アイコンを作成
            const settingsIcon = createElement('div', {
                className: 'team-settings-icon',
                title: 'チームモニタリング設定',
                style: {
                    marginLeft: '10px'
                }
            }, '<i class="fas fa-cog"></i>');
            
            // 設定アイコンのクリックイベント
            addEventListeners(settingsIcon, {
                click: function(e) {
                    e.stopPropagation(); // 親要素へのイベント伝播を防止
                    
                    // チームモニタリング設定ページへ遷移する処理
                    console.log('チームモニタリング設定ページへ遷移');
                    
                    // 例: モーダルを表示する場合
                    alert('チームモニタリング設定ページへ遷移します');
                }
            });
            
            // 設定アイコンをフレックスボックスに追加
            dropdownRow.appendChild(settingsIcon);
            
            // フレックスボックスをコンテナに追加
            container.appendChild(dropdownRow);
        }
    }
    
    // イベントリスナーを設定
    setupDropdownListeners(container, type);
    
    return container;
}
