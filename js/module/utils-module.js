/**
 * 機能がおすすめかチェックする関数
 * @param {string} featureName - 機能名
 * @returns {boolean} おすすめかどうか
 */
export function isRecommendedFeature(featureName) {
    const recommendedFeatures = [
        'レビュー分析', 
        '開発生産性スコア', 
        'メンバー詳細'
    ];
    
    return recommendedFeatures.includes(featureName);
}

/**
 * 機能が新機能かチェックする関数
 * @param {string} featureName - 機能名
 * @returns {boolean} 新機能かどうか
 */
export function isNewFeature(featureName) {
    const newFeatures = [
        'チームサマリ'
    ];
    
    return newFeatures.includes(featureName);
}

/**
 * HTML要素を作成する関数
 * @param {string} tag - タグ名
 * @param {Object} attributes - 属性オブジェクト
 * @param {string|Array} content - 内容（文字列または子要素の配列）
 * @returns {HTMLElement} 作成された要素
 */
export function createElement(tag, attributes = {}, content = '') {
    const element = document.createElement(tag);
    
    // 属性を設定
    Object.entries(attributes).forEach(([key, value]) => {
        if (key === 'style' && typeof value === 'object') {
            // スタイルオブジェクトの場合
            Object.entries(value).forEach(([prop, val]) => {
                element.style[prop] = val;
            });
        } else if (key === 'className') {
            // クラス名の場合
            element.className = value;
        } else if (key === 'dataset') {
            // データ属性の場合
            Object.entries(value).forEach(([dataKey, dataVal]) => {
                element.dataset[dataKey] = dataVal;
            });
        } else {
            // その他の属性
            element.setAttribute(key, value);
        }
    });
    
    // 内容を設定
    if (Array.isArray(content)) {
        // 子要素の配列の場合
        content.forEach(child => {
            if (child instanceof HTMLElement) {
                element.appendChild(child);
            } else if (typeof child === 'string') {
                element.appendChild(document.createTextNode(child));
            }
        });
    } else if (typeof content === 'string') {
        // 文字列の場合
        element.innerHTML = content;
    }
    
    return element;
}

/**
 * 要素のスタイルを設定する関数
 * @param {HTMLElement} element - 対象の要素
 * @param {Object} styles - スタイルオブジェクト
 */
export function setStyles(element, styles) {
    Object.entries(styles).forEach(([prop, value]) => {
        element.style[prop] = value;
    });
}

/**
 * 要素にイベントリスナーを追加する関数
 * @param {HTMLElement} element - 対象の要素
 * @param {string} eventType - イベントタイプ
 * @param {Function} handler - イベントハンドラ
 * @param {Object} options - イベントオプション
 */
export function addEventListeners(element, listeners) {
    Object.entries(listeners).forEach(([eventType, handler]) => {
        element.addEventListener(eventType, handler);
    });
}

/**
 * 要素の表示/非表示を切り替える関数
 * @param {HTMLElement} element - 対象の要素
 * @param {boolean} isVisible - 表示するかどうか
 */
export function toggleVisibility(element, isVisible) {
    element.style.display = isVisible ? 'block' : 'none';
}

/**
 * 要素のクラスを切り替える関数
 * @param {HTMLElement} element - 対象の要素
 * @param {string} className - クラス名
 * @param {boolean} isActive - 追加するかどうか
 */
export function toggleClass(element, className, isActive) {
    if (isActive) {
        element.classList.add(className);
    } else {
        element.classList.remove(className);
    }
}

/**
 * 要素の内容をクリアする関数
 * @param {HTMLElement} element - 対象の要素
 */
export function clearElement(element) {
    element.innerHTML = '';
}

/**
 * 画像パスを取得する関数
 * @param {string} itemName - 項目名
 * @returns {string} 画像パス
 */
export function getImagePath(itemName) {
    // HTMLファイルからの相対パス（ブラウザでの実行時基準）
    return `Full Screenshot/${itemName}.png`;
}

/**
 * 制限機能のオーバーレイを作成する関数
 * @param {string} item - 機能名
 * @returns {HTMLElement} オーバーレイ要素
 */
export function createRestrictedOverlay() {
    // オーバーレイ要素を作成
    const overlay = createElement('div', {
        style: {
            position: 'fixed',
            top: '60px', // トップナビゲーションの高さ
            left: '276px', // サイドナビゲーションの幅
            right: '0',
            bottom: '0',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(5px)',
            zIndex: '9999',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
        }
    });
    
    // ロックアイコンを追加
    const lockIcon = createElement('i', {
        className: 'fas fa-lock',
        style: {
            fontSize: '64px',
            color: '#1E7ED5',
            marginBottom: '30px'
        }
    });
    
    // タイトルを追加
    const title = createElement('div', {
        style: {
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#333',
            textAlign: 'center',
            marginBottom: '20px'
        }
    }, 'この機能は Standardプラン以上で利用可能です');
    
    // 説明を追加
    const description = createElement('div', {
        style: {
            fontSize: '16px',
            color: '#666',
            textAlign: 'center',
            marginBottom: '30px'
        }
    }, `
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
    `);
    
    // ボタンを追加
    const button = createElement('button', {
        style: {
            backgroundColor: '#1E7ED5',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            padding: '12px 24px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }
    }, 'プランをアップグレードする');
    
    // ボタンのホバー効果
    addEventListeners(button, {
        mouseover: function() {
            this.style.backgroundColor = '#1565C0';
        },
        mouseout: function() {
            this.style.backgroundColor = '#1E7ED5';
        },
        click: function() {
            alert('プランのアップグレードについては営業担当までお問い合わせください。');
        }
    });
    
    // 要素を追加
    overlay.appendChild(lockIcon);
    overlay.appendChild(title);
    overlay.appendChild(description);
    overlay.appendChild(button);
    
    return overlay;
}

/**
 * サイドナビが閉じられた場合のオーバーレイ位置調整を設定する関数
 * @param {HTMLElement} overlay - オーバーレイ要素
 */
export function setupOverlayPositionAdjustment(overlay) {
    document.getElementById('side-nav-toggle').addEventListener('click', function() {
        if (document.getElementById('side-nav').classList.contains('collapsed')) {
            overlay.style.left = '0';
        } else {
            overlay.style.left = '276px';
        }
    });
}
